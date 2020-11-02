import { useEffect } from 'react';

export default function useHandleOnDisconnect(room: any, onDisconnect: Function) {
  useEffect(() => {
    const disconnected = () => {
      room.localParticipant.tracks.forEach(({ track }: { track: any }) => {
        if (['audio', 'video'].includes(track.kind)) {
          track.stop();
        }
        room.localParticipant.unpublishTrack(track);
      });
      room.localParticipant.removeAllListeners();
      onDisconnect();
    };
    room.on('disconnected', disconnected);
    return () => {
      room.off('disconnected', disconnected);
    };
  }, [room, onDisconnect]);
}
