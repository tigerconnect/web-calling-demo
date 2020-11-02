import React from 'react';
import { ReactComponent as PatientAvatar } from '../../../images/default-avatar--singleProvider.svg';
import "./AudioPreview.css";

export default function AudioPreview() {
  return (
    <div className="audio-preview">
      <div className="avatar-container">
        <PatientAvatar className="avatar" />
      </div>
    </div>
  );
}
