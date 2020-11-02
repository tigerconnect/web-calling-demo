// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { RemoteTrackPublication } from "twilio-video";
import ConnectingPreview from './ConnectingPreview';
import useTrack from '../../hooks/useTrack';
import AudioTrack from '../../Tracks/AudioTrack';
import VideoTrack from '../../Tracks/VideoTrack';

const userAgent = typeof window === 'undefined' ? 'serverSide' : window.navigator.userAgent;

export const IS_BRAVE = userAgent !== 'serverSide' && (!window || !window.clientInformation || !window.clientInformation.brave)
export const IS_OPERA = userAgent.includes('OPR/');
export const IS_EDGE = userAgent.includes('Edge/');
export const IS_CHROME =
  (userAgent.includes('Chrome/') || userAgent.includes('Chromium/')) &&
  !IS_BRAVE &&
  !IS_OPERA &&
  !IS_EDGE;
export const IS_SAFARI =
  userAgent.includes('Safari/') && !IS_CHROME && !IS_BRAVE && !IS_OPERA && !IS_EDGE;

interface PublicationProps {
  publication: RemoteTrackPublication;
  isLocal: boolean;
  disableAudio: boolean;
  videoPriority?: string;
}

export default function Publication({ publication, isLocal, disableAudio, videoPriority }: PublicationProps) {
  const track = useTrack(publication);
  const remoteVideoTrack = track && track.kind === 'video' && !isLocal;
  const [dimensions, setTrackDimensions] = useState(null);

  useEffect(() => {
    setTrackDimensions(remoteVideoTrack ? { ...track!.dimensions } : null);

    if (remoteVideoTrack) {
      const setDimensions = () => setTrackDimensions({ ...track.dimensions });

      track!.on('dimensionsChanged', setDimensions);
      return () => {
        track!.off('dimensionsChanged', setDimensions);
      };
    }
  }, [remoteVideoTrack, track]);

  if (!track) return null;

  const shouldRenderPreview = IS_SAFARI
    ? ((!!dimensions && !dimensions.width) || (!!track.dimensions && !track.dimensions.width)) &&
      !isLocal
    : !!dimensions && !dimensions.width && !isLocal;

  switch (track.kind) {
    case 'video':
      if (shouldRenderPreview) {
        return <ConnectingPreview />;
      } else {
        return (
          <VideoTrack
            track={track}
            priority={videoPriority}
            isLocal={track.name === 'camera' && isLocal}
          />
        );
      }
    case 'audio':
      return disableAudio ? null : <AudioTrack track={track} />;
    default:
      return null;
  }
}
