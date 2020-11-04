import React, { useCallback, useEffect, useState } from "react";
import { useAppState } from "../../state";
import { User } from "../../types";
import "./IncomingCall.css";

// import { UserAvatar } from '../UserAvatar/UserAvatar';
import Fab from "../Fab/Fab";

import { ReactComponent as CallDeclineIcon } from "../../images/call-decline.svg";
import { ReactComponent as VideoOffIcon } from "../../images/video-off.svg";
import { ReactComponent as VideoOnIcon } from "../../images/video-on.svg";

const ActionType = {
  DECLINE_CALL: "DECLINE_CALL",
  JOIN_CALL_WITH_VIDEO: "JOIN_CALL_WITH_VIDEO",
  JOIN_CALL_WITHOUT_VIDEO: "JOIN_CALL_WITHOUT_VIDEO",
};

export default function IncomingCall() {
  const { client, currentCall, join, setAnswerWithCamOn, user } = useAppState();
  const [buttonsEnabled, setButtonsEnabled] = useState(true);
  const [caller, setCaller] = useState<User | null>(null);
  const [recipients, setRecipients] = useState<User[]>([]);
  const {
    payload: {
      callerId,
      connectedParticipants,
      disabledParticipants,
      participantsTokens = [],
      orgId,
    },
  } = currentCall;

  const buttons = [
    {
      clickFn: () => handleCall(ActionType.DECLINE_CALL),
      color: 'red',
      icon: CallDeclineIcon,
    },
    {
      clickFn: () => handleCall(ActionType.JOIN_CALL_WITHOUT_VIDEO),
      color: 'green',
      icon: VideoOffIcon,
    },
    {
      clickFn: () => handleCall(ActionType.JOIN_CALL_WITH_VIDEO),
      color: 'green',
      icon: VideoOnIcon,
    },
  ];

  useEffect(() => {
    async function fetchData() {
      const callerUser = await client.users.find(callerId, { organizationId: orgId });
      const results: User[] = await Promise.all(
        (connectedParticipants || participantsTokens)
          .filter(
            (token: string) =>
              !disabledParticipants[token] &&
              callerId !== token &&
              user?.id !== token
          )
          .map(async (token: string) => await client.users.find(token, { organizationId: orgId }))
      );
      setCaller(callerUser);
      setRecipients(results);
    }
    fetchData();
  }, [callerId, client.users, connectedParticipants, disabledParticipants, orgId, participantsTokens, user]);

  const buildMembersList = useCallback(() => {
    return recipients
    .map((r) => r.displayName.length > 20 ? `${r.displayName.slice(0,19)}...` : r.displayName).join(", ");
  }, [recipients]);

  const handleCall = (actionType: string) => {
    if (buttonsEnabled) setButtonsEnabled(false);

    switch (actionType) {
      case ActionType.DECLINE_CALL:
        client.calls.decline(currentCall);
        break;
      case ActionType.JOIN_CALL_WITH_VIDEO:
        join();
        setAnswerWithCamOn(true)
        break;
      case ActionType.JOIN_CALL_WITHOUT_VIDEO:
        join();
        setAnswerWithCamOn(false)
        break;
      default:
    }
  };

  if (!caller || !recipients) {
    return null;
  }

  return (
    <div id="incoming-call">
      <div className="header-container">
        {/* <UserAvatar
          user={caller}
          size={38}
          smallVersion={true}
          shouldUseMinWidth={true}
        /> */}
        <div className="header-text">
          <div className="call-header">Call from {caller.displayName}</div>
          {!recipients.length && (
            <div className="network-header">Patient Call</div>
          )}
        </div>
      </div>
      {!!recipients.length && (
        <div className="members-container">
          <div className="network-header">Patient Call</div>
          <div className="member-list">{buildMembersList()}</div>
        </div>
      )}
      <div className="controls">
        {buttons.map((button, i) => (
          <Fab
            key={i}
            onClick={button.clickFn}
            isEnabled={buttonsEnabled}
            isDisabled={!buttonsEnabled}
            isInactive={!buttonsEnabled}
            color={button.color}
            marginButton={"0 20px"}
            size={"large"}
          >
            <button.icon />
          </Fab>
        ))}
      </div>
      <audio src={'media/call.wav'} autoPlay loop />
    </div>
  );
}
