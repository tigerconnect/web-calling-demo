import React from 'react';
import { ReactComponent as PatientAvatar } from '../../../../images/default-avatar--singleProvider.svg';
import "./ConnectingPreview.css";

export default function AudioPreview() {

  return (
    <div className={'connecting-preview'}>
      <div className={'avatar-container'}>
        <PatientAvatar className={'avatar'} />
      </div>
      <div className={'text'}>Connecting...</div>
    </div>
  );
}
