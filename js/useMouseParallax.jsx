/**
 * useMouseParallax.jsx
 * Custom hook: tracks mouse position and returns spring-smoothed
 * MotionValues for multi-layer parallax. Uses inertia so movement
 * never snaps — it glides.
 */
const { useEffect: useParallaxEffect, useCallback: useParallaxCb } = React;
const { useMotionValue: useParallaxMV, useSpring: useParallaxSpring } = Motion;

function useMouseParallax(opts = {}) {
  const { stiffness = 50, damping = 30 } = opts;

  const rawX = useParallaxMV(0);
  const rawY = useParallaxMV(0);

  const x = useParallaxSpring(rawX, { stiffness, damping });
  const y = useParallaxSpring(rawY, { stiffness, damping });

  useParallaxEffect(() => {
    const onMove = (e) => {
      /* normalise to -0.5 … +0.5 */
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return { x, y };
}

window.useMouseParallax = useMouseParallax;
