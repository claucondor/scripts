import { Profile } from "../../../entities/profile";
import { transformIpfsToUrl } from "../../../utils/type_checks";

function buildExternalProfile(item: any): Profile {
  return {
    externalId: item.id,
    handle: item.handle,
    ownedBy: item.ownedBy,
    name: item.name,
    picture: setProfileImage(item),
    coverPicture: setCoverProfileImage(item),
    bio: item.bio,
    attributes: item.attributes,
    profileStats: {
      followers: item.stats.totalFollowers,
      following: item.stats.totalFollowing,
      posts: item.stats.totalPosts,
      comments: item.stats.totalComments,
      mirrors: item.stats.totalMirrors,
      publications: item.stats.totalPublications,
      collects: item.stats.totalCollects,
    },
    followModule: item.followModule,
  } as Profile;
}

function setProfileImage(item: any): string | undefined {
  if (item?.picture?.original?.url)
    return transformIpfsToUrl(item.picture.original.url);

  if (item?.picture?.uri) return transformIpfsToUrl(item.picture.uri);

  return undefined;
}

function setCoverProfileImage(item: any): string | undefined {
  if (item?.coverPicture?.original?.url)
    return transformIpfsToUrl(item.coverPicture.original.url);

  if (item?.coverPicture?.uri) return transformIpfsToUrl(item.coverPicture.uri);

  return undefined;
}

export { buildExternalProfile };
