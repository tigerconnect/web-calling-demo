import React from "react";
import { Participant as TwilioParticipant } from "twilio-video";
import ParticipantInfo from "./ParticipantInfo";
import ParticipantTracks from "./ParticipantTracks";
import "./Participant.css";

export default function Participant({
  participant,
  disableAudio,
  index,
}: {
  participant: TwilioParticipant;
  disableAudio?: boolean;
  index: number;
}) {
  return (
    <ParticipantInfo participant={participant} index={index}>
      <ParticipantTracks
        participant={participant}
        disableAudio={!!disableAudio}
      />
    </ParticipantInfo>
  );
}
