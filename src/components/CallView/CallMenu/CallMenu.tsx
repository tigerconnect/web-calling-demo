import React, { useEffect, useState } from "react";
import { useAppState } from "../../../state";
import { Organization, SearchResult } from "../../../types";
import CallTarget from "../CallTarget/CallTarget";
import "./CallMenu.css";

export default function CallMenu() {
  const { client, isGroupCallEnabled, maxMembers, setIsGroupCallEnabled, start } = useAppState();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTarget, setSearchTarget] = useState<SearchResult | null>(null);
  const [videoCallEnabled, setVideoCallEnabled] = useState(false)
  const canCall = searchTarget && videoCallEnabled && activeOrg

  useEffect(() => {
    const getOrgs = async () => {
      const response = await client.organizations.findAll();
      setOrgs(response);
      setActiveOrg(response[0]);
    };
    getOrgs();
  }, [client.organizations]);

  useEffect(() => {
    if (!searchTarget) return
    setErrorMessage('')
    if (searchTarget.entityType === 'group') {
      if (searchTarget.entity.memberIds!.length > 2 && !isGroupCallEnabled) {
        setErrorMessage('Group Video Calling is not enabled for this Organization')
      }
      if (searchTarget.entity.memberIds!.length > maxMembers) {
        setErrorMessage(`This group has too many members. Try a group with <= ${maxMembers} members.`)
      }
    }
  }, [isGroupCallEnabled, maxMembers, searchTarget])

  useEffect(() => {
    setVideoCallEnabled(false)
    setIsGroupCallEnabled(false)
    setErrorMessage('')
    if (!activeOrg) return;
    if (activeOrg && activeOrg.videoCall) {
      setVideoCallEnabled(true)
      setIsGroupCallEnabled(activeOrg.groupVideoCall)
    } else {
      setErrorMessage('Video Calling is not enabled for this Organization')
    }
  }, [activeOrg, orgs, setIsGroupCallEnabled]);

  return (
    <div id="call-menu">
      Menu
      <div className="label">Organization</div>
      <select
        value={activeOrg ? activeOrg.id : undefined}
        onChange={(e) => setActiveOrg(orgs.find(o => o.id === e.target.value) as Organization)}
        disabled={orgs.length <= 1}
      >
        {orgs.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      {videoCallEnabled && (
        <div>
          <div className="label">Call Target</div>
          <CallTarget
            disabled={false}
            network={'Provider'}
            organization={activeOrg!.id}
            searchTarget={searchTarget}
            setSearchTarget={setSearchTarget}
          />
        </div>
      )}
      {errorMessage && <div className="alert"> {errorMessage} </div>}
      {canCall && (
        <button onClick={() => start('Provider', activeOrg!.id, searchTarget)}>
          Call
        </button>
      )}
    </div>
  );
}
