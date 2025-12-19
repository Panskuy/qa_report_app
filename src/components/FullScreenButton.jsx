"use client";

import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Sync state kalau user keluar fullscreen pakai ESC
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="
        p-2
        border border-white/20
        rounded-md
        hover:bg-white/10
        transition
      "
      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
    >
      {isFullscreen ? (
        <Minimize className="w-4 h-4" />
      ) : (
        <Maximize className="w-4 h-4" />
      )}
    </button>
  );
};

export default FullscreenButton;
