import { useEffect, useState, useRef } from 'react';
import { Participant } from 'twilio-video';
import useDominantSpeaker from './useDominantSpeaker';
import useVideoContext from './useVideoContext';
import useLocalVideoToggle from './useLocalVideoToggle';
import { useAppState } from '../../../state';

export default function useParticipants() {
  const { client, currentCall } = useAppState();
  const {
    room,
    localTrackToggling: { isLocalVideoToggledOff },
  } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [participants, setParticipants] = useState<Participant[]>(Array.from(room.participants.values()));
  const [, toggleVideoEnabled] = useLocalVideoToggle();
  const oldParticipants = useRef(participants);

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    if (dominantSpeaker) {
      setParticipants((prevParticipants) => [
        dominantSpeaker,
        ...prevParticipants.filter((participant) => participant !== dominantSpeaker),
      ]);
    }
  }, [dominantSpeaker]);

  useEffect(() => {
    if (oldParticipants.current.length > participants.length && participants.length === 0) {
      room.disconnect();
      client.calls.end(currentCall, { reason: 'ended'})
    }
    oldParticipants.current = participants;
  }, [client, currentCall, participants, room]);

  useEffect(() => {
    const participantConnected = (participant: Participant) => {
      if (!room.localParticipant.videoTracks.size && !isLocalVideoToggledOff) {
        toggleVideoEnabled();
      }
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };
    const participantDisconnected = (participant: Participant) => {
      setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant));
    };
    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [isLocalVideoToggledOff, room, toggleVideoEnabled]);

  return participants;
}
