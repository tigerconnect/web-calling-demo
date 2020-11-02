import React from 'react';
import AudioPreview from './AudioPreview';
import VideoTrack from '../Tracks/VideoTrack';
import useVideoContext from '../hooks/useVideoContext'

export default function VideoPreview() {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find((track) => track.name === 'camera');

  return videoTrack ? <VideoTrack track={videoTrack} isLocal /> : <AudioPreview />;
}
