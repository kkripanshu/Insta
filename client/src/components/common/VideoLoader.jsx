import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import loader from "../../assets/videos/WEP_Load.webm";

const VideoLoader = ({ isLoading, onComplete }) => {
  const startTimeRef = useRef(Date.now());
  const timeoutRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("video-loader-blur");
    if (!isLoading) {
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, 4000 - elapsedTime);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onComplete?.();
      }, remainingTime);
    }

    return () => {
      document.body.classList.remove("video-loader-blur");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, onComplete]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="w-40 h-40"
        >
          <source src={loader} type="video/webm" />
        </video>
      </div>
    </div>,
    document.body
  );
};

export default VideoLoader;
