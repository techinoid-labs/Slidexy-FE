"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { createPresentation, savePresentation, type SaveOutcome } from "@/utils/presentationApi";

export type SaveState =
  | { status: "idle" }
  | { status: "unsaved" }
  | { status: "saving" }
  | { status: "saved"; at: number }
  | { status: "error"; message: string; canRetry: boolean }
  | { status: "signedout" };

const DEBOUNCE_MS = 2500;

/**
 * Keeps a deck on the server.
 *
 * Saves are debounced and coalesced: typing a sentence is one save, not
 * twenty. A save already in flight is never raced -- a change arriving
 * mid-flight sets a dirty flag that triggers one more save on completion,
 * so the server always ends up with the latest state without a queue of
 * overlapping writes arriving out of order.
 *
 * Nothing here throws. A deck that cannot be saved (signed out, someone
 * else's deck, server down) still lives in IndexedDB, and the status this
 * returns is what tells the user which of those is true.
 */
export function useDeckAutosave(args: {
  presentationId: string | null;
  slides: any[];
  title: string | null;
  blockTemplateId?: string | null;
  /** Autosave is off until the deck has finished loading. */
  enabled: boolean;
  /** Called once, when a deck with no server identity gets created. */
  onCreated?: (presentationId: string) => void;
}) {
  const { presentationId, slides, title, blockTemplateId, enabled, onCreated } = args;
  const { data: session } = useSession();
  const token = (session?.user as any)?.accessToken as string | undefined;

  const [state, setState] = useState<SaveState>({ status: "idle" });

  // The id can appear mid-session: a deck started from a template has none
  // until the first save creates it.
  // Callers pass `onCreated` as an inline arrow, so depending on it made
  // runSave a new function every render, which re-ran the effect below,
  // which set state, which rendered again. Keep it in a ref instead.
  const onCreatedRef = useRef(onCreated);
  onCreatedRef.current = onCreated;

  const idRef = useRef<string | null>(presentationId);
  if (presentationId && idRef.current !== presentationId) idRef.current = presentationId;

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const dirtyWhileSaving = useRef(false);
  // The newest values, read at save time rather than captured in a closure,
  // so a save that fires late still sends the current deck.
  const latest = useRef({ slides, title, blockTemplateId });
  latest.current = { slides, title, blockTemplateId };

  const runSave = useCallback(async () => {
    if (inFlight.current) {
      dirtyWhileSaving.current = true;
      return;
    }

    inFlight.current = true;
    setState({ status: "saving" });

    // A template deck has no server record yet. Create one, then save into
    // it; without this the editor has nothing to PUT to and the deck lives
    // only in the browser.
    if (!idRef.current) {
      const created = await createPresentation(
        { slides: latest.current.slides, title: latest.current.title },
        token
      );
      if ("error" in created) {
        inFlight.current = false;
        setState(
          token
            ? { status: "error", message: created.error, canRetry: true }
            : { status: "signedout" }
        );
        return;
      }
      idRef.current = created.id;
      onCreatedRef.current?.(created.id);
    }

    const result: SaveOutcome = await savePresentation(
      idRef.current,
      {
        slides: latest.current.slides,
        title: latest.current.title,
        blockTemplateId: latest.current.blockTemplateId ?? null,
      },
      token
    );

    inFlight.current = false;

    if (result.kind === "ok") {
      setState({ status: "saved", at: Date.now() });
    } else if (result.reason === "unauthenticated") {
      setState({ status: "signedout" });
    } else {
      setState({
        status: "error",
        message: result.message,
        // A rejected deck (wrong account, missing, too large) will be
        // rejected again identically, so offering retry would just loop.
        canRetry: result.reason === "network",
      });
    }

    if (dirtyWhileSaving.current) {
      dirtyWhileSaving.current = false;
      void runSave();
    }
  }, [token]);

  // Debounced autosave on every change.
  useEffect(() => {
    if (!enabled) return;
    if (!slides || slides.length === 0) return;

    if (!token) {
      setState({ status: "signedout" });
      return;
    }

    // Only transition if we are not already in that state: returning a new
    // object every pass re-rendered the whole editor on each keystroke.
    setState((s) =>
      s.status === "saving" || s.status === "unsaved" ? s : { status: "unsaved" }
    );

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runSave(), DEBOUNCE_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // slides/title identity changes on every edit, which is the trigger.
  }, [slides, title, blockTemplateId, enabled, token, runSave]);

  // Warn before leaving with work that has not reached the server.
  useEffect(() => {
    const unsaved = state.status === "unsaved" || state.status === "saving";
    if (!unsaved) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [state.status]);

  /** Ctrl/Cmd+S saves now instead of waiting out the debounce. */
  const saveNow = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    void runSave();
  }, [runSave]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveNow();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saveNow]);

  return { state, saveNow, canSave: !!token };
}
