import React, { createContext } from "react";
import { LocalTrack } from 'twilio-video';
import { useAppState } from "../../state";
import useHandleRoomDisconnectionErrors from "./hooks/useHandleRoomDisconnectionErrors";
import useHandleOnDisconnect from "./hooks/useHandleOnDisconnect";
import useHandleTrackPublicationFailed from "./hooks/useHandleTrackPublicationFailed";
import useLocalTracks from "./hooks/useLocalTracks";
import useRoom from "./hooks/useRoom";

/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
 */

export interface VideoContextType {
  connect: Function;
  getLocalAudioTrack: Function;
  getLocalVideoTrack: Function;
  isConnecting: boolean;
  localTracks: LocalTrack[];
  localTrackToggling: {
    isLocalAudioToggledOff: boolean;
    isLocalVideoToggledOff: boolean;
    toggleLocalTrack: Function;
  };
  onDisconnect: Function;
  onError: Function;
  room: any;
  sendDataMessage: null | Function;
}

interface VideoProviderProps {
  children?: React.ReactNode;
  onDisconnect: Function;
  onError: Function;
}

export const VideoContext = createContext<VideoContextType>(null!);

export function VideoProvider({
  children,
  onDisconnect = () => {},
  onError = () => {},
}: VideoProviderProps) {
  const onErrorCallback = (error: Error) => {
    console.log(`ERROR: ${error.message}`, error);
    onError(error);
  };

  const { answerWithCamOn, room, sendDataMessage } = useAppState();
  const {
    localTracks,
    getLocalAudioTrack,
    getLocalVideoTrack,
    localTrackToggling,
  } = useLocalTracks(answerWithCamOn);
  const { isConnecting, connect } = useRoom(
    localTracks,
    localTrackToggling,
    onErrorCallback,
    room
  );

  // Register onError and onDisconnect callback functions.
  useHandleRoomDisconnectionErrors(room, onError);
  useHandleTrackPublicationFailed(room, onError);
  useHandleOnDisconnect(room, onDisconnect);

  return (
    <VideoContext.Provider
      value={{
        connect,
        getLocalAudioTrack,
        getLocalVideoTrack,
        isConnecting,
        localTracks,
        localTrackToggling,
        onDisconnect,
        onError: onErrorCallback,
        room,
        sendDataMessage: sendDataMessage,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}
