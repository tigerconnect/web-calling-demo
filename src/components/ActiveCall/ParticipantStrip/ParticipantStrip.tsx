import React from 'react';
import clsx from 'clsx';
import Participant from '../Participant/Participant';
import useParticipants from '../hooks/useParticipants';
import useVideoContext from '../hooks/useVideoContext';
import VideoPreview from '../LocalPreview/VideoPreview';
import "./ParticipantStrip.css";

export default function ParticipantStrip() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const remoteParticipantsCount = participants.length;

  return (
    <div id="participant-strip">
      <div
        className={clsx('grid-container', {grid: remoteParticipantsCount > 1})}
      >
        {participants
          .sort((participant1, participant2) => (participant1.sid < participant2.sid ? -1 : 1))
          .map((participant, index) => {
            const isWideView = remoteParticipantsCount === 2 && index === 0;

            return isWideView ? (
              <div key={participant.sid} className="wide-track">
                <Participant participant={participant} index={index} />
              </div>
            ) : (
              <Participant key={participant.sid} participant={participant} index={index} />
            );
          })}
        {remoteParticipantsCount === 0 ? (
          <VideoPreview />
        ) : (
          <Participant
            key={localParticipant.sid}
            participant={localParticipant}
            index={remoteParticipantsCount}
          />
        )}
      </div>
    </div>
  );
}
