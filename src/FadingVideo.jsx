import React, {   useEffect, useRef   } from 'react';



function FadingVideo({ src, className = "", style = {} }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const restartTimerRef = useRef(null);
  const fadingOutRef = useRef(false);
  const FADE_MS = 500;
  const FADE_OUT_LEAD = 0.55;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeTo = (target, duration = FADE_MS) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const startOpacity = parseFloat(video.style.opacity || "0");
      const startedAt = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        video.style.opacity = String(startOpacity + (target - startOpacity) * progress);
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const onLoadedData = () => {
      video.style.opacity = "0";
      const playAttempt = video.play();
      if (playAttempt?.catch) playAttempt.catch(() => {});
      fadeTo(1);
    };

    const onTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      if (!fadingOutRef.current && remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const onEnded = () => {
      video.style.opacity = "0";
      restartTimerRef.current = setTimeout(() => {
        video.currentTime = 0;
        const playAttempt = video.play();
        if (playAttempt?.catch) playAttempt.catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    if (video.readyState >= 2) onLoadedData();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <video ref={videoRef} src={src} autoPlay muted playsInline preload="auto" className={className} style={{ ...style, opacity: 0 }} aria-hidden="true" />
  );
}

export default FadingVideo;
