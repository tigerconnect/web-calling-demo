import { useCallback, useEffect, useRef, useState } from 'react';
import { LocalTrack } from 'twilio-video';

export default function useRoom(localTracks: LocalTrack[], localTrackToggling: any, onError: Function, room: any) {
  const [isConnecting, setIsConnecting] = useState(false);
  const disconnectHandlerRef = useRef(() => {});
  const localTracksRef = useRef<LocalTrack[]>([]);
  const { isLocalAudioToggledOff, isLocalVideoToggledOff } = localTrackToggling;

  useEffect(() => {
    // It can take a moment for Video.connect to connect to a room. During this time, the user may have enabled or disabled their
    // local audio or video tracks. If this happens, we store the localTracks in this ref, so that they are correctly published
    // once the user is connected to the room.
    localTracksRef.current = localTracks;
    if (room && room.localParticipant) {
      localTracksRef.current.forEach((track) => {
        if (
          !room.localParticipant.tracks.has(track) &&
          room.state !== 'disconnected' &&
          (track.kind === 'video' ? !isLocalVideoToggledOff : !isLocalAudioToggledOff)
        ) {
          room.localParticipant.publishTrack(track, {
            priority: track.kind === 'video' ? 'low' : 'standard',
          });
        }
      });
    }
  }, [isLocalAudioToggledOff, isLocalVideoToggledOff, localTracks, room]);

  const connect = useCallback(() => {
    setIsConnecting(true);

    window.twilioRoom = room;
    room.once('disconnected', () => {
      window.removeEventListener('beforeunload', disconnectHandlerRef.current);
    });

    disconnectHandlerRef.current = () => room.disconnect();
    setIsConnecting(false);

    // Add a listener to disconnect from the room when a user closes their browser
    window.addEventListener('beforeunload', disconnectHandlerRef.current);
  }, [room]);

  return { room, isConnecting, connect };
}
