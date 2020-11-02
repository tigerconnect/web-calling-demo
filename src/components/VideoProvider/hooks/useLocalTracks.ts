import { useCallback, useEffect, useState } from 'react';
import Video, { LocalAudioTrack, LocalVideoTrack, LocalTrack } from 'twilio-video';

interface LocalTracksType {
  localTracks: LocalTrack[],
  getLocalAudioTrack: Function,
  getLocalVideoTrack: Function,
  localTrackToggling: {
    isLocalAudioToggledOff: boolean;
    isLocalVideoToggledOff: boolean;
    toggleLocalTrack: Function;
  },
}

export function useLocalAudioTrack(): [LocalTrack | undefined, Function] {
  const [track, setTrack] = useState<LocalAudioTrack>();

  const getLocalAudioTrack = useCallback(async () => {
    try {
      const newTrack:LocalAudioTrack = await Video.createLocalAudioTrack();
      setTrack(newTrack);
      return newTrack;
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getLocalAudioTrack();
  }, [getLocalAudioTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalAudioTrack];
}

export function useLocalVideoTrack(shouldAnswerWithCamOn: boolean): [LocalTrack | undefined, Function] {
  const [track, setTrack] = useState<LocalVideoTrack>();

  const getLocalVideoTrack = useCallback(async () => {
    try {
      const newTrack:LocalVideoTrack = await Video.createLocalVideoTrack({ name: 'camera' });
      setTrack(newTrack);
      return newTrack;
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    // We get a new local video track when the app loads.
    if (shouldAnswerWithCamOn) {
      getLocalVideoTrack();
    } else {
      setTrack(undefined);
    }
  }, [getLocalVideoTrack, shouldAnswerWithCamOn]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalVideoTrack];
}

export function useLocalTrackToggle(shouldAnswerWithCamOn: boolean) {
  const [isLocalAudioToggledOff, setIsLocalAudioToggledOff] = useState<boolean>(false);
  const [isLocalVideoToggledOff, setIsLocalVideoToggledOff] = useState(!shouldAnswerWithCamOn);
  const toggleLocalTrack = (trackKind: string) => {
    if (trackKind === 'audio') {
      setIsLocalAudioToggledOff(!isLocalAudioToggledOff);
    } else {
      setIsLocalVideoToggledOff(!isLocalVideoToggledOff);
    }
  };

  return { isLocalAudioToggledOff, isLocalVideoToggledOff, toggleLocalTrack };
}

export default function useLocalTracks(shouldAnswerWithCamOn: boolean): LocalTracksType {
  const [audioTrack, getLocalAudioTrack] = useLocalAudioTrack();
  const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack(shouldAnswerWithCamOn);
  const localTrackToggling = useLocalTrackToggle(shouldAnswerWithCamOn);

  const localTracks = [audioTrack, videoTrack].filter((track) => track !== undefined) as LocalTrack[];

  return {
    localTracks,
    getLocalAudioTrack,
    getLocalVideoTrack,
    localTrackToggling,
  };
}
