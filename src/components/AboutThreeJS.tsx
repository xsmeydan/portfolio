import { useEffect, useRef } from 'react';

/**
 * Decorative 3D particle background. The Three.js scene is code-split and
 * only loaded on wide screens without reduced-motion, once the section is
 * about to scroll into view. Phones skip the download and GPU work entirely.
 */
export default function AboutThreeJS() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shouldRender = window.matchMedia(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!shouldRender) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const startWhenNear = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        startWhenNear.disconnect();

        import('./networkScene')
          .then(({ mountNetworkScene }) => {
            if (!cancelled) cleanup = mountNetworkScene(container);
          })
          .catch(() => {
            // Decorative only: ignore load failures
          });
      },
      { rootMargin: '400px 0px' },
    );
    startWhenNear.observe(container);

    return () => {
      cancelled = true;
      startWhenNear.disconnect();
      cleanup?.();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" aria-hidden="true" />;
}
