import { useEffect } from 'react';

export default function useHandleTrackPublicationFailed(room: any, onError: Function) {
  const { localParticipant } = room;
  useEffect(() => {
    if (localParticipant) {
      localParticipant.on('trackPublicationFailed', onError);
      return () => {
        localParticipant.off('trackPublicationFailed', onError);
      };
    }
  }, [localParticipant, onError]);
}
