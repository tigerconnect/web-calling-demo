import React, { useEffect, useRef } from 'react';
import { AudioTrack as TwilioAudioTrack } from 'twilio-video';

export default function AudioTrack({ track }: { track: TwilioAudioTrack}) {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = ref.current;
    track.attach(el!);
    return () => {
      track.detach(el!);
    };
  }, [track]);

  const restartAudio = () => {
    // This is a workaround for the following issue:
    // https://github.com/twilio/twilio-video.js/issues/922
    track.detach(ref.current!);
    track.attach(ref.current!);
  };

  return <audio ref={ref} onPause={restartAudio} />;
}
