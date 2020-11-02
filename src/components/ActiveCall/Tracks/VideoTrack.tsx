import React, { useRef, useEffect } from "react";

const defaultStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // TS doesn't recognize this CSS property
};

export default function VideoTrack({
  track,
  isLocal,
  priority,
}: {
  track: any;
  isLocal: boolean;
  priority?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    el!.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored.
  const transform = isLocal ? { transform: "rotateY(180deg)" } : {};

  return (
    <video
      ref={ref}
      // @ts-ignore
      style={{ ...defaultStyle, ...transform }}
      data-qa-id={isLocal ? "local-video" : "participant-video"}
    />
  );
}
