"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getRegistrationByRef, type Registration } from "@/lib/registrations";

interface State {
  registration: Registration | null;
  loading: boolean; // true only on the very first load
  error: string | null;
  notFound: boolean;
}

/**
 * Loads a registration by ref. Pass `pollMs` to re-fetch on an interval
 * (used by the pending screen). Polling errors are swallowed silently so a
 * blip doesn't tear down a working screen; the first load surfaces errors.
 */
export function useRegistration(ref: string, pollMs?: number) {
  const [state, setState] = useState<State>({
    registration: null,
    loading: true,
    error: null,
    notFound: false,
  });
  const firstLoad = useRef(true);

  const load = useCallback(async () => {
    try {
      const reg = await getRegistrationByRef(ref);
      setState({
        registration: reg,
        loading: false,
        error: null,
        notFound: reg === null,
      });
    } catch (e) {
      // Only surface the error on the first load; later polls fail quietly.
      if (firstLoad.current) {
        setState({
          registration: null,
          loading: false,
          error: e instanceof Error ? e.message : "Failed to load.",
          notFound: false,
        });
      }
    } finally {
      firstLoad.current = false;
    }
  }, [ref]);

  useEffect(() => {
    firstLoad.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    load();
    if (!pollMs) return;
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  return { ...state, refetch: load };
}
