import { LocalAudioTrack , LocalParticipant } from 'twilio-video';
import { useCallback } from 'react';
import useIsTrackEnabled from './useIsTrackEnabled';
import useVideoContext from './useVideoContext';

export default function useLocalAudioToggle() {
  const {
    room: { localParticipant },
    localTracks,
  } = useVideoContext();
  const audioTrack = localTracks.find((track) => track.kind === 'audio') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    toggleAudioEnabledCallback({ audioTrack, localParticipant });
  }, [audioTrack, localParticipant]);

  return [isEnabled, toggleAudioEnabled] as const;
}

export const toggleAudioEnabledCallback = ({ audioTrack, localParticipant }: { audioTrack: LocalAudioTrack, localParticipant: LocalParticipant }) => {
  if (audioTrack) {
    if (localParticipant.audioTracks.size) {
      const localTrackPublication = localParticipant.unpublishTrack(audioTrack);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      localParticipant.emit('trackUnpublished', localTrackPublication);
      audioTrack.disable();
    } else {
      localParticipant.publishTrack(audioTrack);
      audioTrack.enable();
    }
  }
};
