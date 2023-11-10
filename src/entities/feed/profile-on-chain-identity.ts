export interface ProfileOnchainIdentity {
  proofOfHumanity: boolean;
  ens: EnsOnchainIdentity;
  sybilDotOrg: SybilDotOrgIdentity;
  worldcoin: WorldcoinIdentity;
}

export interface EnsOnchainIdentity {
  name: Ens;
}

export interface SybilDotOrgIdentity {
  verified: boolean;
  source: SybilDotOrgIdentitySource;
}

export interface SybilDotOrgIdentitySource {
  twitter: SybilDotOrgTwitterIdentity;
}

export interface SybilDotOrgTwitterIdentity {
  handle: string;
}

export interface WorldcoinIdentity {
  isHuman: boolean;
}

type Ens = string;
