import React, { useCallback, useEffect, useState } from "react";
import clsx from 'clsx';
import { useAppState } from "../../../state";
import { SearchResult } from "../../../types";
import CallTarget from "../CallTarget/CallTarget";
import "./CallMembers.css";

export default function CallMembers() {
  const { client, currentCall, invite, isGroupCallEnabled, maxMembers } = useAppState();
  const [ members, setMembers ] = useState<any[]>([])
  const [inviteTarget, setInviteTarget] = useState<SearchResult | null>(null);
  const membersToExcludeFromSearch = members.filter(member => {
    if (!currentCall) return false
    const status = currentCall.membersStatuses[member.id]
    return !['Missed call', 'Declined call'].includes(status)
  })
  const activeMembers = members.filter(member => {
    if (!currentCall) return false
    const status = currentCall.membersStatuses[member.id]
    return ['Connected', 'Ringing...'].includes(status)
  })

  useEffect(() => {
    const getMembers = async () => {
      const users = await Promise.all(Object.keys(currentCall.membersStatuses).map(async id => {
        return client.users.find(id, currentCall.organizationId)
      }))
      setMembers(users)
    }
    currentCall && getMembers()
  }, [client.users, currentCall])

  const inviteMember = useCallback(() => {
    setInviteTarget(null)
    invite(inviteTarget)
  }, [invite, inviteTarget])

  const memberLineItem = (member: any) => {
    if (!currentCall) return
    const status = currentCall.membersStatuses[member.id]
    const green = ['Connected'].includes(status)
    const blue = ['Missed call'].includes(status)
    const red = ['Left call', 'Declined call'].includes(status)
    return (
      <div className="member" key={member.id}>
        <div className="name">{ member.displayName }</div>
        <div className={clsx('status', { green, blue, red })}>{ status }</div>
      </div>
    )
  }

  return (
    <div id="call-members">
      Call Members
      <div>
        {members.map(memberLineItem)}
      </div>
      { isGroupCallEnabled && currentCall && activeMembers.length < maxMembers && (<div>
        <div>
          <div className="label">Invite Member</div>
          <CallTarget
            disabled={false}
            network={'Provider'}
            organization={currentCall!.organizationId}
            excludeIds={membersToExcludeFromSearch.map(m => m.id)}
            searchTarget={inviteTarget}
            setSearchTarget={setInviteTarget}
          />
        </div>
        { inviteTarget && <button onClick={inviteMember}>Call</button> }
      </div>) }
    </div>
  );
}
