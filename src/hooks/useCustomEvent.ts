import { useEffect } from "react";
import { TyEvt } from "../types/Evt.type"; // adjust path

export function useCustomEvent(
  eventName: TyEvt.CustomEventName,
  handler: () => void
) {
  useEffect(() => {
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, handler]);
}