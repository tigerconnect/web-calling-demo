// @ts-nocheck
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { useAppState } from '../../../state';
import usePublications from '../hooks/usePublications';
import useIsTrackSwitchedOff from '../hooks/useIsTrackSwitchedOff';
import useIsTrackEnabled from '../hooks/useIsTrackEnabled';
import useTrack from '../hooks/useTrack';
import useDominantSpeaker from '../hooks/useDominantSpeaker';
import useVideoContext from '../hooks/useVideoContext';
import { ReactComponent as VideoOffIcon } from '../../../images/provider-video-off.svg';
import AvatarImage from '../../AvatarImage/AvatarImage';
import { ReactComponent as AudioOffIcon } from '../../../images/mic-off.svg';

export default function ParticipantInfo({ participant, children, index }) {
  const publications = usePublications(participant);
  const { isEnlargedWindow, client, currentCall: { payload } } = useAppState();

  const audioPublication = publications.find((p) => p.kind === 'audio');
  const videoPublication = publications.find((p) => p.kind === 'video');
  const audioTrack = useTrack(audioPublication);
  const videoTrack = useTrack(videoPublication);
  const isAudioEnabled = useIsTrackEnabled(audioTrack);
  const isVideoEnabled = useIsTrackEnabled(videoTrack);
  const isAudioSwitchedOff = useIsTrackSwitchedOff(audioTrack);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack);
  const isAudioOn = isAudioEnabled && !isAudioSwitchedOff;
  const isVideoOn = isVideoEnabled && !isVideoSwitchedOff;

  const { room } = useVideoContext();
  const isLocal = participant === room.localParticipant;
  const remoteParticipantsCount = room.participants ? room.participants.size : 0;
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [displayName, setDisplayName] = useState(null);

  const dominantSpeaker = useDominantSpeaker();

  useEffect(() => {
    let mounted = true;
    async function userInfo(userId) {
      const {
        avatarUrl,
        displayName,
        isPatient,
        isPatientContact,
        patientContact,
      } = await client.users.find(userId, payload.orgId);
      const patientOrContact = isPatient || isPatientContact;
      if (!mounted) return
      setAvatarUrl(avatarUrl);
      setDisplayName(
        `${displayName}${
          patientOrContact ? ` (${isPatient ? 'Patient' : patientContact.relation})` : ''
        }`
      );
    }
    mounted && userInfo(participant.identity);

    return () => mounted = false

  }, [client, payload, participant.identity]);

  // const classes = useStyles();
  const isGrid = remoteParticipantsCount > 1;
  const isWideView = remoteParticipantsCount === 2 && index === 0;
  const isDominantSpeaker = dominantSpeaker && participant.identity === dominantSpeaker.identity;
  let videoPanel;
  if (isLocal) {
    videoPanel = isVideoOn ? 'provider-video-panel' : 'provider-video-disabled-panel';
  } else {
    videoPanel = isVideoOn ? 'participant-video-panel' : 'participant-video-disabled-panel';
  }

  return (
    <div
      className={clsx('participant-info', {
        isVideoSwitchedOff: !isVideoOn,
        isLocalVideoSwitchedOff: !isVideoOn && isLocal,
        isLocal: isLocal && !isEnlargedWindow && !isGrid,
        isLocalMax: isLocal && isEnlargedWindow && !isGrid,
        isRemote: !isLocal,
        p2p: !isGrid,
        wideTrack: isWideView,
        border: isGrid && !isWideView,
        dominantSpeaker: isDominantSpeaker && isGrid,
      })}
      data-cy-participant={participant.identity}
      data-qa-id={videoPanel}
    >
      <div
        className={clsx('info-container', {
          remoteHideVideo: !isVideoOn && !isLocal,
          localHideVideo: !isVideoOn && isLocal,
        })}
      >
        {!isVideoOn &&
          (isLocal ? (
            <VideoOffIcon width={24} />
          ) : (
            <AvatarImage
              size={40}
              entity={ displayName && {displayName, type: 'account'}}
              avatarUrl={avatarUrl}
            />
          ))}
        {(isGrid || !isAudioOn) && (
          <div
            className={clsx('name-audio-holder', {
              gridNameAudioHolder: isGrid,
            })}
          >
            {!isAudioOn && (
              <AudioOffIcon
                className={clsx('audio-off')}
                data-qa-id={isLocal ? 'provider-muted-indicator' : 'patient-muted-indicator'}
                width={15}
              />
            )}
            {isGrid && (
              <div className={clsx('ellipsis')}> {isLocal ? 'You' : displayName} </div>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
