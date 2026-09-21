import { useCallback, useEffect, useRef } from "react";

const SPEED = 0.32;
const EASE = 0.1;
const MAX_STEP = 90;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isEditable(node) {
  if (!(node instanceof Element)) return false;
  const tag = node.tagName;
  return node.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function canScrollInside(start, deltaY) {
  let el = start instanceof Element ? start : start?.parentElement;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const scrollable = (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1;
    if (scrollable) {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) return true;
    }
    el = el.parentElement;
  }
  return false;
}

function normalizeDelta(event) {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight * 0.8;
  return event.deltaY;
}

function maxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

export function useSlowPageScroll() {
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(0);

  const stop = () => {
    if (!rafRef.current) return;
    window.cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };

  const clampY = (value) => Math.max(0, Math.min(maxScroll(), value));

  const animateTo = (next, instant = false) => {
    targetRef.current = clampY(next);
    if (instant) {
      stop();
      currentRef.current = targetRef.current;
      window.scrollTo(0, targetRef.current);
      return;
    }
    if (rafRef.current) return;
    const tick = () => {
      currentRef.current += (targetRef.current - currentRef.current) * EASE;
      if (Math.abs(targetRef.current - currentRef.current) < 0.35) {
        currentRef.current = targetRef.current;
        window.scrollTo(0, currentRef.current);
        rafRef.current = 0;
        return;
      }
      window.scrollTo(0, currentRef.current);
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
  };

  const animateToRef = useRef(animateTo);
  animateToRef.current = animateTo;

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    animateToRef.current(top, prefersReducedMotion());
  }, []);

  useEffect(() => {
    currentRef.current = window.scrollY;
    targetRef.current = window.scrollY;

    if (prefersReducedMotion()) return undefined;

    const onWheel = (event) => {
      if (event.ctrlKey || event.defaultPrevented) return;
      const delta = normalizeDelta(event);
      if (!delta) return;
      if (canScrollInside(event.target, delta)) return;
      event.preventDefault();
      const step = Math.max(-MAX_STEP, Math.min(MAX_STEP, delta * SPEED));
      animateTo(targetRef.current + step);
    };

    const onKeyDown = (event) => {
      if (isEditable(event.target)) return;
      const view = window.innerHeight;
      let delta = 0;
      if (event.key === "ArrowDown") delta = 72;
      else if (event.key === "ArrowUp") delta = -72;
      else if (event.key === "PageDown") delta = view * 0.72;
      else if (event.key === "PageUp") delta = -view * 0.72;
      else if (event.key === " ") delta = event.shiftKey ? -view * 0.72 : view * 0.72;
      else if (event.key === "Home") {
        event.preventDefault();
        animateTo(0);
        return;
      } else if (event.key === "End") {
        event.preventDefault();
        animateTo(maxScroll());
        return;
      } else return;
      event.preventDefault();
      animateTo(targetRef.current + delta * SPEED * 2.2);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      currentRef.current = window.scrollY;
      targetRef.current = window.scrollY;
    };

    const onPointerDown = () => {
      stop();
      currentRef.current = window.scrollY;
      targetRef.current = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return scrollToId;
}
