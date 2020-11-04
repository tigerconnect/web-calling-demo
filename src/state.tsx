import React, { useCallback, createContext, useContext, useEffect, useState } from "react";
import Video from "twilio-video";
import { User } from "./types";
const { Client: TigerConnectClient } = require("./js-sdk/src");

const urlParams = new URLSearchParams(window.location.search);

const client = new TigerConnectClient({
  apiEnv: urlParams.get("apiEnv"),
  keepConversationsForAllForums: true,
  manuallyRequestEventQueueBatch: false,
  partnerName: "calling-demo",
  twilioVideo: Video,
  version: "1.0",
});

export interface StateContextType {
  answerWithCamOn: boolean;
  client: any;
  currentCall: any;
  end: Function;
  invite: Function;
  isEnlargedWindow: boolean;
  isGroupCallEnabled: boolean;
  isSigningIn: boolean;
  join: Function;
  maxMembers: number;
  room: any;
  sendDataMessage: null | Function;
  setAnswerWithCamOn: Function;
  setIsEnlargedWindow: Function;
  setIsGroupCallEnabled: Function;
  signInError: any;
  signIn: Function;
  start: Function;
  user?: null | { displayName: string; id: string };
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [room, setRoom] = useState(null)
  const [currentCall, setCurrentCall] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState(null);
  const [answerWithCamOn, setAnswerWithCamOn] = useState(true)
  const [isEnlargedWindow, setIsEnlargedWindow] = useState(false)
  const [sendDataMessage, setSendDataMessage] = useState(null)
  const [isGroupCallEnabled, setIsGroupCallEnabled] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  let contextValue = { client } as StateContextType;

  const clear = useCallback(() => {
    setCurrentCall(null)
    setRoom(null)
  }, [])

  const updateCurrentCall = useCallback((newCurrentCall) => {
    setCurrentCall({ ...newCurrentCall })
  }, [])

  useEffect(() => {
    client.on("signedIn", (sdkUser: User) => {
      setUser(sdkUser);
      client.events.connect();
    });
    client.on("call:ended", updateCurrentCall);
    client.on("call:incoming", updateCurrentCall);
    client.on("call:memberUpdate", updateCurrentCall);
    client.on("call:state", updateCurrentCall);

    client.on("call:answered", () => clear());
    client.on("call:closed", () => clear());
  }, [clear, updateCurrentCall])

  const signIn = useCallback((email, password) => {
    setIsSigningIn(true);
    setSignInError(null);
    const attemptSignIn = async () => {
      try {
        await client.signIn(email, password);
      } catch (e) {
        setSignInError(e);
        setIsSigningIn(false);
      }
    };
    attemptSignIn();
  }, []);

  const invite = useCallback(async (searchResult) => {
    const newCall = await client.calls.inviteUser(currentCall, searchResult.entity.id);
    setCurrentCall({ ...newCall })
  }, [currentCall])

  const join = useCallback(async () => {
    const newCall = await client.calls.join(currentCall);
    setRoom(newCall.room)
    setSendDataMessage(newCall.sendDataMessage)
    setCurrentCall({ ...newCall })
  }, [currentCall])

  const start = useCallback(async ( networkType, organizationId, searchResult ) => {
    let newCall

    if (searchResult.entityType === 'group') {
      newCall = await client.calls.startWithGroup({ groupId: searchResult.entity.id });
    } else {
      newCall = await client.calls.start({
        networkType,
        organizationId,
        participantIds: [searchResult.entity.id]
      });
    }

    setRoom(newCall.room)
    setSendDataMessage(newCall.sendDataMessage)
    setCurrentCall({ ...newCall })
  }, [])

  const end = useCallback(async () => {
    await client.calls.end(currentCall)
    clear()
  }, [clear, currentCall])

  return (
    <StateContext.Provider
      value={{
        ...contextValue,
        answerWithCamOn,
        end,
        invite,
        isEnlargedWindow,
        isGroupCallEnabled,
        isSigningIn,
        join,
        maxMembers: 4,
        room,
        sendDataMessage,
        setAnswerWithCamOn,
        setIsGroupCallEnabled,
        setIsEnlargedWindow,
        signIn,
        signInError,
        start,
        currentCall,
        user,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within the AppStateProvider");
  }
  return context;
}
