/**
 * Loading and saving a deck against the backend.
 *
 * Two things this module exists to get right:
 *
 * 1. The wire format is snake_case (`block_spec`) while the editor works in
 *    camelCase (`blockSpec`). Mapping happens here, once, rather than being
 *    sprinkled through components.
 * 2. Saving requires a signed-in user. Callers get a typed result rather than
 *    a thrown error, so the UI can say "sign in to save" instead of showing a
 *    stack trace or, worse, silently losing the deck.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * String discriminant rather than a boolean one: this project compiles with
 * `strict: false`, and TypeScript does not narrow a union on a boolean
 * literal field when strictNullChecks is off.
 */
export type SaveOutcome =
  | { kind: "ok"; updatedAt: string }
  | {
      kind: "error";
      reason: "unauthenticated" | "forbidden" | "notfound" | "toolarge" | "network";
      message: string;
    };

export interface DeckSummary {
  presentation_id: string;
  title: string;
  slide_count: number;
  block_template_id: string | null;
  created_at: string;
  updated_at: string;
}

/** Wire -> editor. */
function fromWire(slide: any) {
  if (!slide || typeof slide !== "object") return slide;
  const { block_spec, ...rest } = slide;
  return block_spec ? { ...rest, blockSpec: block_spec } : rest;
}

/** Editor -> wire. */
function toWire(slide: any) {
  if (!slide || typeof slide !== "object") return slide;
  const { blockSpec, ...rest } = slide;
  return blockSpec ? { ...rest, block_spec: blockSpec } : rest;
}

/**
 * Rejects a payload that would be refused by the server anyway.
 *
 * The backend returns 413 for inline base64 images, and a deck that has
 * picked a few up (a pasted screenshot, a generated image not yet uploaded)
 * would otherwise fail every autosave silently, forever.
 */
function findInlineImage(slides: any[]): string | null {
  const json = JSON.stringify(slides ?? []);
  const hit = json.match(/"(data:image\/[a-z+]+;base64)/i);
  return hit ? hit[1] : null;
}

export async function loadPresentation(
  presentationId: string,
  token?: string
): Promise<{ slides: any[]; title: string | null; blockTemplateId: string | null } | null> {
  if (!API_BASE_URL) {
    console.warn("[presentationApi] NEXT_PUBLIC_API_BASE_URL is not set; cannot load");
    return null;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentations/${presentationId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      slides: (data.slides || []).map(fromWire),
      title: data.title ?? data.topic ?? null,
      blockTemplateId: data.block_template_id ?? null,
    };
  } catch (err) {
    console.error("[presentationApi] load failed", err);
    return null;
  }
}

export async function savePresentation(
  presentationId: string,
  payload: { slides: any[]; title?: string | null; blockTemplateId?: string | null },
  token?: string
): Promise<SaveOutcome> {
  if (!token) {
    return { kind: "error", reason: "unauthenticated", message: "Sign in to save this deck" };
  }
  if (!API_BASE_URL) {
    return { kind: "error", reason: "network", message: "API base URL is not configured" };
  }

  const inline = findInlineImage(payload.slides);
  if (inline) {
    return {
      kind: "error",
      reason: "toolarge",
      message: "An image is still embedded in the deck. It needs uploading before the deck can be saved.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/presentations/${presentationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        slides: (payload.slides || []).map(toWire),
        title: payload.title ?? undefined,
        block_template_id: payload.blockTemplateId ?? undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { kind: "ok", updatedAt: data.updated_at || new Date().toISOString() };
    }
    if (res.status === 401) {
      return { kind: "error", reason: "unauthenticated", message: "Your session expired. Sign in again to save." };
    }
    if (res.status === 403) {
      return { kind: "error", reason: "forbidden", message: "This deck belongs to another account" };
    }
    if (res.status === 404) {
      return { kind: "error", reason: "notfound", message: "This deck no longer exists on the server" };
    }
    if (res.status === 413) {
      return { kind: "error", reason: "toolarge", message: "The deck is too large to save. Images need uploading first." };
    }
    const body = await res.json().catch(() => ({}));
    return { kind: "error", reason: "network", message: body.error || `Save failed (${res.status})` };
  } catch (err: any) {
    return { kind: "error", reason: "network", message: err?.message || "Could not reach the server" };
  }
}

/** The signed-in user's own decks, newest first. */
export async function listMyPresentations(token?: string): Promise<DeckSummary[]> {
  if (!token || !API_BASE_URL) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentations/mine/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.presentations || [];
  } catch {
    return [];
  }
}


/**
 * Creates a deck server-side and returns its id.
 *
 * A deck started from a template exists only in the browser until this is
 * called -- there is no id to PUT against. Autosave calls it once, on the
 * first save, and then switches to updating.
 */
export async function createPresentation(
  payload: { slides: any[]; title?: string | null; topic?: string | null },
  token?: string
): Promise<{ id: string } | { error: string }> {
  if (!token) return { error: "Sign in to save this deck" };
  if (!API_BASE_URL) return { error: "API base URL is not configured" };

  if (findInlineImage(payload.slides)) {
    return { error: "An image is still embedded in the deck. It needs uploading before the deck can be saved." };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/presentations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        topic: payload.topic || payload.title || "Untitled presentation",
        slides: (payload.slides || []).map(toWire),
        meta: { created_from: "editor" },
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.error || `Could not create the deck (${res.status})` };
    }
    const data = await res.json();
    const id = data.presentation_id || data.presentationId || data?.presentation?.presentation_id;
    return id ? { id } : { error: "Server did not return a presentation id" };
  } catch (err: any) {
    return { error: err?.message || "Could not reach the server" };
  }
}
