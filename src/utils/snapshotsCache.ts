import { get, set } from "idb-keyval";

const PERSIST_KEY = "slidesX_snapshots";
const MAX_ENTRIES = 50;
const PERSIST_DEBOUNCE = 2000; // ✅ Increased from 1000ms

type Subscriber = (data?: string | null) => void;

class SnapshotsCache {
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
          this.map.set(k, v as string | Blob);
          if (v instanceof Blob) {
            try {
              const url = URL.createObjectURL(v);
              this.objectUrlMap.set(k, url);
            } catch (e) {
              console.warn('Failed to create object URL for cached blob:', e);
            }
          }
          this.lru.push(k);
        });
      }
      this.initWorker();
    } catch (e) {
      console.warn("snapshotsCache: failed to load persisted snapshots", e);
    }
    this.initialized = true;
  }

  async generateFromCanvas(id: string, canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    await this.init();
    if (!this.worker) this.initWorker();
    
    try {
      const bitmap = await createImageBitmap(canvas);
      this.worker!.postMessage({ id, bitmap }, [bitmap]);
    } catch (e) {
      console.warn('snapshotsCache: failed to create ImageBitmap or post to worker', e);
      // Fallback: create dataURL on main thread
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
        const blob = await off.convertToBlob({ type: 'image/png', quality: 0.8 });
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
        this.handleNewBlob(id, blob as Blob);
      }
    };
  }

  private handleNewBlob(id: string, blob: Blob) {
    // ✅ FIXED: Always revoke old URL before creating new one
    const prevUrl = this.objectUrlMap.get(id);
    if (prevUrl) {
      try {
        URL.revokeObjectURL(prevUrl);
        console.log(`[SnapshotsCache] Revoked old URL for ${id}`);
      } catch (e) {
        console.warn('Failed to revoke old object URL:', e);
      }
    }
    
    const url = URL.createObjectURL(blob);
    this.objectUrlMap.set(id, url);
    this.map.set(id, blob);
    
    // Update LRU
    this.lru = this.lru.filter((k) => k !== id);
    this.lru.push(id);

    // ✅ FIXED: Enforce MAX_ENTRIES limit and cleanup old entries
    if (this.lru.length > MAX_ENTRIES) {
      const oldestId = this.lru.shift();
      if (oldestId) {
        const oldUrl = this.objectUrlMap.get(oldestId);
        if (oldUrl) {
          try {
            URL.revokeObjectURL(oldUrl);
            console.log(`[SnapshotsCache] Revoked old URL for evicted entry ${oldestId}`);
          } catch (e) {
            console.warn('Failed to revoke evicted object URL:', e);
          }
        }
        this.objectUrlMap.delete(oldestId);
        this.map.delete(oldestId);
      }
    }

    // Notify subscribers
    const subs = this.subscribers.get(id);
    if (subs) {
      subs.forEach((cb) => {
        try { cb(url); } catch (e) {
          console.warn('Subscriber callback error:', e);
        }
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

      if (typeof (window as any).requestIdleCallback === "function") {
        (window as any).requestIdleCallback(() => {
          void doSet();
        }, { timeout: 2000 });
      } else {
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
      console.warn('Failed to create object URL:', e);
      return null;
    }
  }

  async setSnapshot(id: string, data: string | Blob | null) {
    await this.init();
    
    if (data == null) {
      // ✅ FIXED: Cleanup on removal
      this.map.delete(id);
      const prevUrl = this.objectUrlMap.get(id);
      if (prevUrl) {
        try { 
          URL.revokeObjectURL(prevUrl);
          console.log(`[SnapshotsCache] Revoked URL for removed snapshot ${id}`);
        } catch (e) {
          console.warn('Failed to revoke URL on removal:', e);
        }
        this.objectUrlMap.delete(id);
      }
      this.lru = this.lru.filter((k) => k !== id);
    } else if (typeof data === 'string') {
      // ✅ FIXED: Cleanup old URL when setting string snapshot
      const prevUrl = this.objectUrlMap.get(id);
      if (prevUrl) {
        try { 
          URL.revokeObjectURL(prevUrl);
          console.log(`[SnapshotsCache] Revoked old URL for string snapshot ${id}`);
        } catch (e) {
          console.warn('Failed to revoke URL on string set:', e);
        }
        this.objectUrlMap.delete(id);
      }
      
      this.map.set(id, data);
      this.lru = this.lru.filter((k) => k !== id);
      this.lru.push(id);
      
      // Notify subscribers
      const subs = this.subscribers.get(id);
      if (subs) {
        subs.forEach((cb) => {
          try { cb(data); } catch (e) {
            console.warn('Subscriber callback error:', e);
          }
        });
      }
      
      this.schedulePersist();
    } else {
      // Blob
      this.handleNewBlob(id, data as Blob);
    }
  }

  subscribe(id: string, cb: Subscriber) {
    if (!this.subscribers.has(id)) this.subscribers.set(id, new Set());
    this.subscribers.get(id)!.add(cb);
  }

  unsubscribe(id: string, cb: Subscriber) {
    this.subscribers.get(id)?.delete(cb);
  }

  async clearAll() {
    // ✅ FIXED: Revoke all object URLs before clearing
    for (const url of this.objectUrlMap.values()) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Failed to revoke URL during clearAll:', e);
      }
    }
    
    this.map.clear();
    this.objectUrlMap.clear();
    this.lru = [];
    
    try {
      await set(PERSIST_KEY, {});
    } catch (e) {
      console.warn("snapshotsCache: failed to clear persisted snapshots", e);
    }
  }

  // ✅ NEW: Cleanup method for when component unmounts
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    for (const url of this.objectUrlMap.values()) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Failed to revoke URL during destroy:', e);
      }
    }
    
    this.objectUrlMap.clear();
  }
}

const snapshotsCache = new SnapshotsCache();
export default snapshotsCache;