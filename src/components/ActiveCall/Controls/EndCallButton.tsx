import React from 'react';

import Fab from '../../Fab/Fab';
import { ReactComponent as CallEndIcon } from '../../../images/call-end.svg';

import useVideoContext from '../hooks/useVideoContext';
import { useAppState } from '../../../state'

export default function EndCallButton() {
  const { room } = useVideoContext();
  const { end } = useAppState()

  function disconnect() {
    room.disconnect();
    end()
  }

  return (
    <Fab
      dataQaId={'end-call-button'}
      isDisabled={false}
      isEnabled
      onClick={disconnect}
      color='red'
    >
      <CallEndIcon />
    </Fab>
  );
}
