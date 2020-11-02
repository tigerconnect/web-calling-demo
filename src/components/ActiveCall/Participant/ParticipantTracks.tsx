import React, { Fragment } from 'react';
import { Participant, LocalVideoTrackPublication } from "twilio-video";
import Publication from './Publication/Publication';
import usePublications from '../hooks/usePublications';
import useVideoContext from '../hooks/useVideoContext';

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

export default function ParticipantTracks({ participant, disableAudio, videoPriority }: { participant: Participant, disableAudio: boolean, videoPriority?: string }) {
  const { room } = useVideoContext();
  const publications = usePublications(participant) as LocalVideoTrackPublication[];
  const isLocal = participant === room.localParticipant;
  const filteredPublications = publications.filter((p) => p.trackName !== 'screen');

  return (
    <Fragment>
      {filteredPublications.map((publication) => (
        <Publication
          key={publication.kind}
          // @ts-ignore
          publication={publication}
          participant={participant}
          isLocal={isLocal}
          disableAudio={disableAudio}
          videoPriority={videoPriority}
        />
      ))}
    </Fragment>
  );
}
