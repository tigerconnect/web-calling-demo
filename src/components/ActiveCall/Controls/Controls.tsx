import React from 'react';
import clsx from 'clsx';

import EndCallButton from './EndCallButton';
import ToggleAudioButton from './ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton';

import useIsUserActive from '../hooks/useIsUserActive';
import useRoomState from '../hooks/useRoomState';
import useVideoContext from '../hooks/useVideoContext';
import { useAppState } from '../../../state'

import "./Controls.css";

export default function Controls() {
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';
  const isUserActive = useIsUserActive();
  const showControls = isUserActive || roomState === 'disconnected';
  const { room } = useVideoContext();
  const { answerWithCamOn } = useAppState()
  const isGrid = room.participants ? room.participants.size > 1 : false;

  return (
    <div id="controls" className={clsx({ showControls, isGrid })}>
      <ToggleAudioButton disabled={isReconnecting} />
      <ToggleVideoButton disabled={isReconnecting} isVideoInactive={!answerWithCamOn}  />
      {roomState !== 'disconnected' && <EndCallButton />}
    </div>
  );
}
