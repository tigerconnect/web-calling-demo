import { useEffect, useState } from "react";
import {
  Participant,
  TrackPublication,
  LocalTrackPublication,
} from "twilio-video";
import useVideoContext from "./useVideoContext";
import { useAppState } from "../../../state";

const TrackMessage = {
  REQUEST_TYPE: 'REQUEST',
  RESPONSE_TYPE: 'RESPONSE',
  GET_USER_INFO: 'GET_USER_INFO',
};

interface MessageParams {
  client: any;
  organizationId: string;
  sendDataMessage: null | Function;
}

const processMessage = async (
  data: any,
  { client, organizationId, sendDataMessage }: MessageParams
) => {
  let message;
  try {
    message = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }

  if (!message) return;

  if (message.type === TrackMessage.REQUEST_TYPE) {
    const { payload } = message;

    switch (message.requestType) {
      case TrackMessage.GET_USER_INFO:
        if (payload.userIds) {
          const participantsInfo = await Promise.all(
            payload.userIds.map(async (userId: string) => {
              const user = await client.users.find(userId, organizationId);
              const {
                avatarUrl,
                displayName,
                id,
                isPatient,
                isPatientContact,
              } = user;

              return {
                avatarUrl,
                displayName,
                id,
                isPatient,
                isPatientContact,
              };
            })
          );

          if (sendDataMessage) {
            sendDataMessage({
              type: TrackMessage.RESPONSE_TYPE,
              requestType: message.requestType,
              payload: {
                usersInfo: participantsInfo,
              },
            });
          }
        }

        break;
      default:
    }
  }
};

export default function usePublications(participant: Participant) {
  const [publications, setPublications] = useState<TrackPublication[]>([]);
  const { sendDataMessage } = useVideoContext();
  const {
    client,
    currentCall: { organizationId },
  } = useAppState();

  useEffect(() => {
    // Reset the publications when the 'participant' variable changes.
    setPublications(Array.from(participant.tracks.values()));

    /*
      Filtering is a temporary solution, we need to figure out what is the real issue with
      rendering 2 audio and 2 video tags for local participant
    */
    const publicationAdded = (publication: TrackPublication) => {
      setPublications((prevPublications) => {
        const prevPublicationsSet = new Set(prevPublications);
        return prevPublicationsSet.has(publication)
          ? prevPublications
          : [...prevPublications, publication];
      });
    };

    const publicationRemoved = (publication: TrackPublication) =>
      setPublications((prevPublications) =>
        prevPublications.filter((p) => p !== publication)
      );

    const trackSubscribed = (track: LocalTrackPublication) => {
      if (track.kind === "data") {
        track.on("message", (data) =>
          processMessage(data, { client, organizationId, sendDataMessage })
        );
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackPublished", publicationAdded);
    participant.on("trackUnpublished", publicationRemoved);
    return () => {
      participant.off("trackPublished", publicationAdded);
      participant.off("trackSubscribed", trackSubscribed);
      participant.off("trackUnpublished", publicationRemoved);
    };
  }, [client, organizationId, participant, sendDataMessage]);

  return publications;
}
