export interface Organization {
  id: string;
  isPatientNetworkEnabled: boolean;
  isPFVideoCallEnabled: boolean;
  name: string;
  featureVideoCall: boolean;
  groupVideoCall: boolean;
  videoCall: boolean;
}

export interface SearchResult {
  entity: {
    id: string;
    displayName: string;
    memberIds?: string[];
  }
  entityType: string;
}

export interface User {
  id: string;
  displayName: string;
}
