export const PROFILES_QUERY = `
query Profiles($request: ProfilesRequest!) {
    result: profiles(request: $request) {
      items{
              ... on Profile {
          ... ProfileByFragment
        }
      }
      pageInfo {
        next
            prev
      }
    }
  }
  
  fragment ImageSetFragment on Image {
    mimeType
    width
    height
    uri
  }
  
  fragment ProfileStatsFragment on ProfileStats {
      id
      followers
      following
      comments
      posts
      mirrors
      quotes
      publications
      reactions
      reacted
      countOpenActions
  }
  
  fragment ProfilePictureFragment on ProfilePicture {
    ... on ImageSet{
      raw {
        ... ImageSetFragment
      }
      optimized{
        ... ImageSetFragment
      }
    }
    ... on NftImage{
      collection {
        address
        chainId
      }
      tokenId
      image {
        raw{
          ...ImageSetFragment
        }
        optimized{
          ...ImageSetFragment
        }
      }
      verified
    }
  }
  
  fragment ProfileMetadataFragment on ProfileMetadata {
    displayName
    bio
    rawURI
    appId
    picture {
        ... ProfilePictureFragment
      }
    coverPicture{
      raw{
        ...ImageSetFragment
      }
      optimized{
        ...ImageSetFragment
      }
    }
  }
  
  fragment ProfileByFragment on Profile {
    id
    handle {
      localName
      namespace
      suggestedFormatted {
        full
        localName
      }
    }
    ownedBy {
      address
      chainId
    } 
    metadata{
      bio
      ... ProfileMetadataFragment
    }
    txHash
    createdAt
    stats {
          ... ProfileStatsFragment
    }
    operations {
          ... ProfileOperationsFragment
    }
    interests
    guardian {
      protected
      cooldownEndsOn
    }
    invitedBy{
      handle{
        fullHandle
      }
    }
  }
  
  fragment ProfileOperationsFragment on ProfileOperations{
    id
    isBlockedByMe {
      value
      isFinalisedOnchain
    }
    hasBlockedMe{
      value
      isFinalisedOnchain
    }
    isFollowedByMe{
      value
      isFinalisedOnchain
    }
    isFollowingMe{
      value
      isFinalisedOnchain
    }
    canBlock
    canUnblock
    canFollow
    canUnfollow
  }`;
