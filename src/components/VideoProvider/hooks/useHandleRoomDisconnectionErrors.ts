import { useEffect } from 'react';

export default function useHandleRoomDisconnectionErrors(room: any, onError: Function) {
  useEffect(() => {
    const onDisconnected = (room: any, error: Error) => {
      if (error) {
        onError(error);
      }
    };

    room.on('disconnected', onDisconnected);
    return () => {
      room.off('disconnected', onDisconnected);
    };
  }, [room, onError]);
}
