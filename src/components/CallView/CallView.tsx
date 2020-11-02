import React from "react";
import { useAppState } from "../../state";
import IncomingCall from "../IncomingCall/IncomingCall";
import ActiveCall from "../ActiveCall/ActiveCall";
import CallMenu from "./CallMenu/CallMenu";
import CallMembers from "./CallMembers/CallMembers";
import "./CallView.css";

export default function CallView() {
  const { currentCall, room, user } = useAppState();

  return (
    <div id="call-view">
      <div className="menu">
        { !room && <CallMenu /> }
        { room && <CallMembers /> }
      </div>
      <div className="call-area">
        <div className="user">{user?.displayName}</div>
        {!currentCall && (
          <div> No active call, try using the menu to place a call. </div>
        )}
        {currentCall && !room && <IncomingCall />}
        {currentCall && room && <ActiveCall />}
      </div>
    </div>
  );
}
