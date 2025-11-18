import { get, set } from "idb-keyval";

const PERSIST_KEY = "slidesX_snapshots";
const MAX_ENTRIES = 50; // max number of snapshots to persist
const PERSIST_DEBOUNCE = 1000;

type Subscriber = (data?: string | null) => void;

class SnapshotsCache {
  // value can be a dataURL string or a Blob
  private map: Map<string, string | Blob> = new Map();
  private objectUrlMap: Map<string, string> = new Map();
  private lru: string[] = [];
  private subscribers: Map<string, Set<Subscriber>> = new Map();
  private initialized = false;
  private persistTimeout: any = null;
  private worker: Worker | null = null;

  private async init() {
    if (this.initialized) return;
    try {
      const persisted = await get(PERSIST_KEY);
      if (persisted && typeof persisted === "object") {
        const entries = Object.entries(persisted) as [string, any][];
        entries.slice(-MAX_ENTRIES).forEach(([k, v]) => {
          // v may be a Blob (structured clone) or a string
          this.map.set(k, v as string | Blob);
          if (v instanceof Blob) {
            try {
              const url = URL.createObjectURL(v);
              this.objectUrlMap.set(k, url);
            } catch (e) {
              // ignore
            }
          }
          this.lru.push(k);
        });
      }
      // create worker for converting ImageBitmap -> Blob
      this.initWorker();
    } catch (e) {
      console.warn("snapshotsCache: failed to load persisted snapshots", e);
    }
    this.initialized = true;
  }

  // Accept an HTMLCanvasElement, convert to ImageBitmap and send to worker
  async generateFromCanvas(id: string, canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    await this.init();
    if (!this.worker) this.initWorker();
    try {
      const bitmap = await createImageBitmap(canvas);
      // Post bitmap to worker (transfer bitmap)
      this.worker!.postMessage({ id, bitmap }, [bitmap]);
    } catch (e) {
      console.warn('snapshotsCache: failed to create ImageBitmap or post to worker', e);
      // Fallback: create dataURL on main thread (slower) so functionality is preserved
      try {
        const dataUrl = canvas.toDataURL('image/png');
        await this.setSnapshot(id, dataUrl);
      } catch (err) {
        console.warn('snapshotsCache: fallback to toDataURL failed', err);
      }
    }
  }

  private initWorker() {
    if (this.worker) return;
    const code = `self.onmessage = async function(e) {
      const { id } = e.data;
      const bitmap = e.data.bitmap;
      try {
        const off = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = off.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        try { if (bitmap.close) bitmap.close(); } catch(e){}
        const blob = await off.convertToBlob({ type: 'image/png', quality: 1 });
        self.postMessage({ id, blob });
      } catch (err) {
        self.postMessage({ id, error: String(err) });
      }
    };`;

    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    this.worker = new Worker(url);
    URL.revokeObjectURL(url);

    this.worker.onmessage = (ev: MessageEvent) => {
      const { id, blob, error } = ev.data as any;
      if (error) {
        console.warn('snapshotWorker error for', id, error);
        return;
      }
      if (blob) {
        // store blob and notify
        this.handleNewBlob(id, blob as Blob);
      }
    };
  }

  private handleNewBlob(id: string, blob: Blob) {
    // revoke old url if any
    const prevUrl = this.objectUrlMap.get(id);
    if (prevUrl) {
      try {
        URL.revokeObjectURL(prevUrl);
      } catch (e) {}
    }
    const url = URL.createObjectURL(blob);
    this.objectUrlMap.set(id, url);
    this.map.set(id, blob);
    // update LRU
    this.lru = this.lru.filter((k) => k !== id);
    this.lru.push(id);

    // notify subscribers
    const subs = this.subscribers.get(id);
    if (subs) {
      subs.forEach((cb) => {
        try { cb(url); } catch (e) {}
      });
    }

    this.schedulePersist();
  }

  private schedulePersist() {
    if (this.persistTimeout) clearTimeout(this.persistTimeout);
    this.persistTimeout = setTimeout(() => this.persist(), PERSIST_DEBOUNCE);
  }

  private async persist() {
    try {
      // Build a plain object with up to MAX_ENTRIES most recent
      const obj: Record<string, any> = {};
      const keys = this.lru.slice(-MAX_ENTRIES);
      keys.forEach((k) => {
        const v = this.map.get(k);
        if (v) obj[k] = v;
      });
      const doSet = async () => {
        try {
          await set(PERSIST_KEY, obj);
        } catch (e) {
          console.warn("snapshotsCache: failed to persist snapshots (inner)", e);
        }
      };

      // Prefer doing heavy IndexedDB writes during browser idle periods
      if (typeof (window as any).requestIdleCallback === "function") {
        (window as any).requestIdleCallback(() => {
          void doSet();
        }, { timeout: 2000 });
      } else {
        // Fallback
        setTimeout(() => {
          void doSet();
        }, 0);
      }
    } catch (e) {
      console.warn("snapshotsCache: failed to persist snapshots", e);
    }
  }

  getSnapshot(id: string) {
    const v = this.map.get(id);
    if (!v) return null;
    if (typeof v === "string") return v;
    // Blob -> return existing object URL or create one
    const existing = this.objectUrlMap.get(id);
    if (existing) return existing;
    try {
      const url = URL.createObjectURL(v);
      this.objectUrlMap.set(id, url);
      return url;
    } catch (e) {
      return null;
    }
  }

  async setSnapshot(id: string, data: string | Blob | null) {
    await this.init();
    if (data == null) {
      // remove
      this.map.delete(id);
      const prevUrl = this.objectUrlMap.get(id);
      if (prevUrl) {
        try { URL.revokeObjectURL(prevUrl); } catch (e) {}
        this.objectUrlMap.delete(id);
      }
      this.lru = this.lru.filter((k) => k !== id);
    } else if (typeof data === 'string') {
      // string snapshot (dataURL)
      const prevUrl = this.objectUrlMap.get(id);
      if (prevUrl) {
        try { URL.revokeObjectURL(prevUrl); } catch (e) {}
        this.objectUrlMap.delete(id);
      }
      this.map.set(id, data);
      this.lru = this.lru.filter((k) => k !== id);
      this.lru.push(id);
    } else {
      // Blob
      this.handleNewBlob(id, data as Blob);
    }

    // notify subscribers for string case
    if (typeof data === 'string') {
      const subs = this.subscribers.get(id);
      if (subs) {
        subs.forEach((cb) => {
          try { cb(data); } catch (e) {}
        });
      }
      this.schedulePersist();
    }
  }

  subscribe(id: string, cb: Subscriber) {
    if (!this.subscribers.has(id)) this.subscribers.set(id, new Set());
    this.subscribers.get(id)!.add(cb);
  }

  unsubscribe(id: string, cb: Subscriber) {
    this.subscribers.get(id)?.delete(cb);
  }

  // helper to bulk clear
  async clearAll() {
    this.map.clear();
    this.lru = [];
    try {
      await set(PERSIST_KEY, {});
    } catch (e) {
      console.warn("snapshotsCache: failed to clear persisted snapshots", e);
    }
  }
}

const snapshotsCache = new SnapshotsCache();
export default snapshotsCache;
