import { App } from "./app";
import { MomokaInfo } from "./momoka-info";

interface Mirror {
  id: string;
  publishedOn: App;
  isHidden: boolean;
  momoka: MomokaInfo | null;
  txHash: string;
  createdAt: string;
  mirrorOn: MirrorablePublication;
  by: Profile;
}
