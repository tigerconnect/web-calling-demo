import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';
import useVideoContext from './useVideoContext';

export default function useDominantSpeaker() {
  const { room } = useVideoContext();
  const [dominantSpeaker, setDominantSpeaker] = useState(room.dominantSpeaker);

  useEffect(() => {
    let mounted = true
    // Sometimes, the 'dominantSpeakerChanged' event can emit 'null', which means that
    // there is no dominant speaker. If we change the main participant when 'null' is
    // emitted, the effect can be jarring to the user. Here we ignore any 'null' values
    // and continue to display the previous dominant speaker as the main participant.
    const handleDominantSpeakerChanged = (newDominantSpeaker: Participant) => {
      mounted && setDominantSpeaker(newDominantSpeaker);
    };

    // Since 'null' values are ignored, we will need to listen for the 'participantDisconnected'
    // event, so we can set the dominantSpeaker to 'null' when they disconnect.
    const handleParticipantDisconnected = (participant: Participant) => {
      mounted && setDominantSpeaker((prevDominantSpeaker: Participant) => {
        return prevDominantSpeaker === participant ? null : prevDominantSpeaker;
      });
    };

    room.on('dominantSpeakerChanged', handleDominantSpeakerChanged);
    room.on('participantDisconnected', handleParticipantDisconnected);
    return () => {
      mounted = false
      room.off('dominantSpeakerChanged', handleDominantSpeakerChanged);
      room.off('participantDisconnected', handleParticipantDisconnected);
    };
  }, [room]);

  return dominantSpeaker;
}
