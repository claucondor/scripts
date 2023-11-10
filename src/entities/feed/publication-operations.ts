import { PublicationId } from "./publication-stats";
import { TriStateValue } from "./tri-state-value";
import { OptimisticStatusResult } from "./optimistic-status-result";

export interface PublicationOperations {
  id: PublicationId;
  isNotInterested: boolean;
  hasBookmarked: boolean;
  hasReported: boolean;
  canAct: TriStateValue;
  hasActed: OptimisticStatusResult;
  hasReacted: boolean;
  canComment: TriStateValue;
  canMirror: TriStateValue;
  canQuote: TriStateValue;
  hasQuoted: boolean;
  hasMirrored: boolean;
}
