import React from 'react';
import { LocalVideoTrack } from 'twilio-video';

import Fab from '../../Fab/Fab';
import { ReactComponent as VideoOffIcon } from '../../../images/video-off.svg';
import { ReactComponent as VideoOnIcon } from '../../../images/video-on.svg';

import useLocalVideoToggle from '../hooks/useLocalVideoToggle';
import useIsTrackEnabled from '../hooks/useIsTrackEnabled';
import useVideoContext from '../hooks/useVideoContext';

export default function ToggleVideoButton({ isVideoInactive, disabled }: {isVideoInactive: boolean, disabled: boolean}) {
  const { localTracks } = useVideoContext();
  const [videoAvailable, toggleVideoEnabled] = useLocalVideoToggle();
  const videoTrack = localTracks.find((track) => track.name === 'camera') as LocalVideoTrack;
  const isVideoEnabled = useIsTrackEnabled(videoTrack);
  const isEnabled = isVideoEnabled && videoAvailable;
  return (
    <Fab
      dataQaId={
        isVideoInactive
          ? 'inactive-video-button'
          : isEnabled
          ? 'disable-video-button'
          : 'enable-video-button'
      }
      onClick={toggleVideoEnabled}
      isDisabled={disabled || isVideoInactive}
      isEnabled={isEnabled}
      isInactive={isVideoInactive}
    >
      {isEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
    </Fab>
  );
}
