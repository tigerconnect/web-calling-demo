import React from 'react';

import Fab from '../../Fab/Fab';
import { ReactComponent as MicOffIcon } from '../../../images/mic-off.svg';
import { ReactComponent as MicOnIcon } from '../../../images/mic-on.svg';

import useLocalAudioToggle from '../hooks/useLocalAudioToggle';

export default function ToggleAudioButton({ disabled }: { disabled: boolean }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  return (
    <Fab
      dataQaId={isAudioEnabled ? 'mute-button' : 'unmute-button'}
      onClick={toggleAudioEnabled}
      isDisabled={disabled}
      isEnabled={isAudioEnabled}
    >
      {isAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}
    </Fab>
  );
}
