import React from 'react';

import Fab from '../../Fab/Fab';
import { ReactComponent as CallEndIcon } from '../../../images/call-end.svg';

import useVideoContext from '../hooks/useVideoContext';
import { useAppState } from '../../../state'

export default function EndCallButton() {
  const { room } = useVideoContext();
  const { client, currentCall } = useAppState()

  function disconnect() {
    room.disconnect();
    client.calls.end(currentCall, { reason: 'ended' })
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
