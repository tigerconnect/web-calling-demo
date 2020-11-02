import { useCallback } from 'react';
import { LocalVideoTrack } from 'twilio-video';
import useVideoContext from './useVideoContext';

export default function useLocalVideoToggle(): [boolean, () => void] {
  const {
    room: { localParticipant },
    localTracks,
    localTrackToggling: { toggleLocalTrack },
    getLocalVideoTrack,
  } = useVideoContext();
  const videoTrack = localTracks.find((track) => track.name === 'camera') as LocalVideoTrack;

  const toggleVideoEnabled = useCallback(() => {
    toggleLocalTrack('video');
    if (videoTrack) {
      if (localParticipant) {
        const localTrackPublication = localParticipant.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant.emit('trackUnpublished', localTrackPublication);
      }
      videoTrack.stop();
    } else {
      try {
        getLocalVideoTrack();
      } catch (err) {
        console.error(err);
      }
    }
  }, [toggleLocalTrack, videoTrack, localParticipant, getLocalVideoTrack]);

  return [!!videoTrack, toggleVideoEnabled];
}
