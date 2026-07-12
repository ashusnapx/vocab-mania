"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollAnimation(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: options?.rootMargin ?? "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return { ref, isVisible };
}

export function useCounter(end: number, duration = 2000, startOnVisible = true) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  useEffect(() => {
    if (startOnVisible && !isVisible) return;
    if (startedRef.current) return;
    startedRef.current = true;

    let startTime: number | null = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, startOnVisible, isVisible]);

  return { ref, count };
}
