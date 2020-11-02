import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from 'clsx';
import { useAppState } from "../../../state";
import { SearchResult } from "../../../types";
import cancelIcon from "../../../images/cancel-icon.svg"
import "./CallTarget.css";

export default function CallTarget({
  disabled,
  excludeIds = [],
  network,
  organization,
  searchTarget,
  setSearchTarget,
}: CallTargetProps) {
  const { client } = useAppState();
  const [text, setText] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const timer = useRef<undefined | number>();
  const searchFields = ["displayName", "title", "name"].join(",");
  const searchTypes = ["group", "user", "patient_account"];

  useEffect(() => {
    setResults([])
    setSearchTarget(null)
  }, [network, organization, setSearchTarget])

  useEffect(() => {
    if (searchTarget === null) {
      setText("")
      setResults([])
    }
  }, [searchTarget])

  const search = useCallback(
    async (searchText) => {
      const isPatientNetwork = network === "Patient";
      const { results } = await client.search.query({
        excludeEmptyLists: isPatientNetwork,
        excludeIds,
        excludeSelf: true,
        organizationId: organization,
        query: { [searchFields]: searchText },
        sort: ["displayName"],
        types: searchTypes.filter((st) => {
          return isPatientNetwork ? true : st !== "patient_account";
        }),
      });
      setResults(results);
    },
    [client.search, excludeIds, network, organization, searchFields, searchTypes]
  );

  const debounceText = useCallback(
    (text) => {
      setText(text);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        search(text);
      }, 500);
    },
    [search]
  );

  const targetDisplay = () => {
    return (
      <div className={clsx('selected-target', { disabled })} onClick={() => !disabled && setSearchTarget(null)}>
        <div className="name">{searchTarget?.entity.displayName}</div>
        <div className="cancel"><img src={cancelIcon} alt="cancel" /></div>
      </div>
    );
  };

  const searchDisplay = () => {
    return (
      <div className={clsx('result-search', { results: results.length })}>
        <input
          disabled={disabled}
          onChange={(e) => debounceText(e.target.value)}
          placeholder="Search for a call target..."
          type="text"
          value={text}
        />
        <div className="results">
          {results.map((result) => (
            <div
              className="search-result"
              key={result.entity.id}
              onClick={() => setSearchTarget(result)}
            >
              {result.entity.displayName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div id="call-target">
      {searchTarget ? targetDisplay() : searchDisplay()}
    </div>
  );
}

type CallTargetProps = {
  disabled: boolean;
  excludeIds?: string[];
  network: string;
  organization: string;
  setSearchTarget: Function;
  searchTarget: SearchResult | null;
};
