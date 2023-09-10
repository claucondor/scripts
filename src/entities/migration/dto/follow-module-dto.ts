export type FollowModuleDto = {
  type: string;
  amount?: {
    asset: {
      symbol: string;
      name: string;
      decimals: number;
      address: string;
    };
    value: string;
  };
  recipient?: string;
};
