import { GraphQLClient } from "graphql-request";
import { Transaction, Wallet, utils } from "ethers";
import { getChallenge } from "./get-challengue";
import { authenticateWithChallenge } from "./authenticate-with-challenge";
import {
  PROFILE_ADRESS,
  PROFILE_ID,
  WALLET_PK,
  ZURF_SOCIAL_PRIVATE_KEY,
} from "../../infrastructure/env";
import { PUBLICATIONS_QUERY } from "./querys/publications-query";
import { FEED_QUERY } from "./querys/feed-query";
import { FeedItem } from "../../entities/feed/feed-item";
import { PaginatedFeed } from "../../entities/feed/paginated-feed";
import { fileExistsAsync } from "tsconfig-paths/lib/filesystem";
import {
  AnyPublication,
  Mirror,
  Post,
  Quote,
} from "../../entities/feed/any-publication";
import { Comment } from "../../entities/feed/any-publication";
import { CREATE_CHANGE_PROFILE_MANAGER_TYPED_DATA } from "./querys/create-change-profile-manafer-typed-data";
import { CreateChangeProfileManagersBroadcastItemResult } from "../../entities/profile-manager/typed-data";
import { WAV3S_POLYGON_CONTRACT_ADDRESS } from "../consts/contracts/addresses/wav3s";
import { ethers } from "ethers";
import { contracts } from "../consts/contracts";
import { getGasToPay, getSigner } from "../get-signer";
import { BigNumber } from "ethers";
import { CREATE_ON_CHAIN_POST_TYPED_DATA } from "./querys/create-on-chain-post-typed-data";
import { CreateOnchainPostBroadcastItemResult } from "../../entities/profile-manager/post-typed-data";
import { generateTokens } from "./generate-tokes";
import { CREATE_ON_CHAIN_MOMOKA_MIRROR_TYPED_DATA } from "./querys/create_momoka_mirror_typed_data";
import { CreateMomokaMirrorBroadcastItemResultFragment } from "@lens-protocol/client";
import { BROADCAST_ON_MOMOMKA } from "./querys/broadcast-on-momoka";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";
const ZURF_DELEGATOR_ADDRESS = "0xC38f33A75b58093ba1c21C4B2763f48DaB226ff2"

const client = new GraphQLClient(GRAPHQL_API_URL);

async function mirrorOnMomoka(publicationId: string) {
  try {
    let response;
    const accessToken = await generateTokens();
    client.setHeader("x-access-token", accessToken as string);
    response = (await client.request(CREATE_ON_CHAIN_MOMOKA_MIRROR_TYPED_DATA, {
      request: {
        mirrorOn: publicationId,
      },
    })) as any;
    console.log(response);

    const {typedData, id} = response.createMomokaMirrorTypedData;
    console.log(JSON.stringify(typedData));

    const domain = typedData.domain;
    const types = typedData.types;
    const value = typedData.value;

    const zurfWallet = new Wallet(ZURF_SOCIAL_PRIVATE_KEY as string);


    const signature = await zurfWallet._signTypedData(domain, types, value);

    console.log(signature);
    response = (await client.request(BROADCAST_ON_MOMOMKA, {
        request: {
          id,
          signature
        },
      })) as any; 

  console.log(response);
  } catch (error) {
    console.error(error);
  }
}


export { mirrorOnMomoka}