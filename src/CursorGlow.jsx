import { motion } from 'framer-motion';
import React, {   useEffect as useGlowEffect   } from 'react';
import * as Motion from 'framer-motion';
import {   useMotionValue as useGlowMV, useSpring as useGlowSpring   } from 'framer-motion';

/**
 * CursorGlow.jsx
 * Adds a subtle, colorful interactive radial glow blob that glides
 * smoothly behind the glass cards following the user's cursor.
 */




function CursorGlow() {
  const mouseX = useGlowMV(-200);
  const mouseY = useGlowMV(-200);

  const smoothX = useGlowSpring(mouseX, { stiffness: 45, damping: 25 });
  const smoothY = useGlowSpring(mouseY, { stiffness: 45, damping: 25 });

  useGlowEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX - 175); /* offset half size */
      mouseY.set(e.clientY - 175);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none rounded-full z-0 select-none opacity-30 blur-[90px]"
      style={{
        left: smoothX,
        top: smoothY,
        width: 350,
        height: 350,
        background: "radial-gradient(circle, rgba(100, 180, 255, 0.4) 0%, rgba(236, 72, 153, 0.15) 45%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}

export default CursorGlow;
