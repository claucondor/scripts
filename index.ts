import { delegate } from "./src/utils/lens-scripts-tests/delegate-lens-test";
import { generateTokens } from "./src/utils/lens-scripts-tests/generate-tokes";
import { delegatedPost } from "./src/utils/lens-scripts-tests/post-delegated-lens-tests";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { delegatedMirror } from "./src/utils/lens-scripts-tests/mirror-delegate-lens-tests";

const ZURF_API = "https://zurf-api-dot-zurf-social.uc.r.appspot.com";
const metadata = {
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
const address = "0xTest";

//delegate(accessToken);
const myFunction = async () => {
  const accessToken = await generateTokens();
  /*
  const response = await axios.post(
    `${ZURF_API}/storage/decentralized/metadata`,
    {
      ownedBy: address,
      data: metadata,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  await delegatedPost(accessToken as string, response.data.data.metadataId);
  */
  //delegate(accessToken as string);
  await delegatedMirror(accessToken as string);
};

myFunction();
