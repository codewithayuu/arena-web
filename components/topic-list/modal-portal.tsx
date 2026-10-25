"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

let activeScrollLocks = 0;
let restoreDocumentStyles: (() => void) | null = null;

function acquireDocumentScrollLock() {
  const html = document.documentElement;
  const body = document.body;

  if (activeScrollLocks === 0) {
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const scrollbarGap = Math.max(0, window.innerWidth - html.clientWidth);

    if (scrollbarGap > 0) {
      const currentPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPadding + scrollbarGap}px`;
    }
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    restoreDocumentStyles = () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
    };
  }

  activeScrollLocks += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    activeScrollLocks = Math.max(0, activeScrollLocks - 1);
    if (activeScrollLocks === 0) {
      restoreDocumentStyles?.();
      restoreDocumentStyles = null;
    }
  };
}

export function ModalPortal({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
}) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    return acquireDocumentScrollLock();
  }, [isOpen]);

  if (!isOpen || !portalRoot) return null;
  return createPortal(children, portalRoot);
}
