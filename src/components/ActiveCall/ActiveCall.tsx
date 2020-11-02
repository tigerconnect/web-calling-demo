import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { VideoProvider } from '../VideoProvider';
import Fab from '../Fab/Fab';
import Controls from './Controls/Controls';
import VideoPreview from './LocalPreview/VideoPreview';
import Room from './Room/Room';
import useIsUserActive from './hooks/useIsUserActive';
import useParticipants from './hooks/useParticipants';
import useRoomState from './hooks/useRoomState';
import useVideoContext from './hooks/useVideoContext';
import { useAppState } from '../../state';
import "./ActiveCall.css";

import { ReactComponent as MaximizeWindow } from '../../images/maximize-button.svg';
import { ReactComponent as MinimizeWindow } from '../../images/minimize-button.svg';

function ActiveCallComponent() {
  const roomState = useRoomState();
  const { connect, room } = useVideoContext();
  const { isEnlargedWindow, setIsEnlargedWindow } = useAppState();
  const participants = useParticipants();
  const [isRoomEmpty, setIsRoomEmpty] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const isUserActive = useIsUserActive();
  const showControls = isUserActive || roomState === 'disconnected';
  const toggleWindowSize = () => {
    if (isEnlargedWindow) setIsEnlargedWindow(false);
    else setIsEnlargedWindow(true);
  };

  useEffect(() => {
    setIsCalling(true);
    connect();
    setIsCalling(false);
  }, [connect]);

  useEffect(() => {
    if (!isCalling && room && room.participants && room.participants.size > 0) {
      setIsRoomEmpty(false);
    }
  }, [room, participants, isCalling]);

  return (
    <div id="active-call" className={clsx({enlarged: isEnlargedWindow})}>
      <div className={clsx('container', {enlarged: isEnlargedWindow})}>
        <div className="main">
          {isCalling && <VideoPreview />}
          {!isCalling && roomState !== 'disconnected' && <Room />}
          <div className={clsx('button-container', {controls: showControls})}>
            <div>
              <Fab
                dataQaId={isEnlargedWindow ? 'minimize-view-button' : 'expand-view-button'}
                onClick={toggleWindowSize}
                marginButton={'0 5px'}
              >
                {!isEnlargedWindow ? <MaximizeWindow /> : <MinimizeWindow />}
              </Fab>
            </div>
          </div>
          {isRoomEmpty && <div className="floating-text">Waiting for participant to join</div>}
          <Controls />
        </div>
      </div>
    </div>
  );
}

export default function ActiveCall() {
  return (
    <VideoProvider onError={() => {}} onDisconnect={() => {}}>
      <ActiveCallComponent/>
    </VideoProvider>
  )
}
