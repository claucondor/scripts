import { delegate } from "./src/utils/lens-scripts-tests/delegate-lens-test";
import { generateTokens } from "./src/utils/lens-scripts-tests/generate-tokes";
import { delegatedPost } from "./src/utils/lens-scripts-tests/post-delegated-lens-tests";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { delegatedMirror } from "./src/utils/lens-scripts-tests/mirror-delegate-lens-tests";
import { delegatedComment } from "./src/utils/lens-scripts-tests/comment-delegate-lens-tests";

const ZURF_API = "https://zurf-api-dot-zurf-social.uc.r.appspot.com";
const postMetadata = {
  version: "2.0.0",
  metadata_id: uuidv4(),
  description: `Post by @oydual3.lens via @wav3s.lens`,
  appId: "zurf",
  content: "Make a post via delegate Zurf",
  locale: "es-CL",
  tags: [],
  name: `Post by oydual3`,
  mainContentFocus: "TEXT_ONLY",
  external_url: "",
  image: null,
  imageMimeType: null,
  attributes: [],
  media: [],
};

const commentMetadata = {
  version: "2.0.0",
  mainContentFocus: "TEXT_ONLY",
  metadata_id: uuidv4(),
  description: `Comment by @oydual3.lens deletagated to @wav3s.lens`,
  locale: "en-US",
  content:
    "I am making test with Zurf Profile Manager, with this comment @cristianvaldivia",
  external_url: null,
  image: null,
  imageMimeType: null,
  name: `Comment by oydual3`,
  attributes: [],
  tags: [],
  appId: "zurf",
};

const address = "0xTest";

//delegate(accessToken);
const myFunction = async () => {
  const accessToken = await generateTokens();

  const response = await axios.post(
    `${ZURF_API}/storage/decentralized/metadata`,
    {
      ownedBy: address,
      data: commentMetadata,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  //await delegatedPost(accessToken as string, response.data.data.metadataId);
  await delegatedComment(
    accessToken as string,
    response.data.data.metadataId,
    "0xe222-0x035f"
  );
  //delegate(accessToken as string);
  await delegatedMirror(accessToken as string);
};

myFunction();
