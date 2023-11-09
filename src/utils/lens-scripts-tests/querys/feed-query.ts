export const FEED_QUERY = `
query Feed($request: FeedRequest!) {
    result: feed(request: $request) {
      items {
        ...FeedItem
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
  }
  
  fragment ReactionEvent on ReactionEvent {
    by {
      ...ProfileByFragment
    }
    reaction
    createdAt
  }
  
  fragment PublicationOperationsFragment on PublicationOperations {
      id
      isNotInterested
      hasBookmarked
      hasReported
      canAct
      hasActed {
             value
            isFinalisedOnchain    
      }
      hasReacted(request: { type: UPVOTE}) 
      canComment
      canMirror
      canQuote
      hasQuoted
      hasMirrored
  }
  
  fragment PublicationStatsFragment on PublicationStats {
      id
      comments
      mirrors
      quotes
      reactions
      countOpenActions
      bookmarks
  }
  
  fragment PostFields on Post {
    __typename
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    txHash
    createdAt
      by {
        ...ProfileByFragment
    }
    stats {
          ... PublicationStatsFragment
    }
    operations {
          ...PublicationOperationsFragment
    }
    metadata {
              ... PublicationMetadataFragment
    }
    isEncrypted
    profilesMentioned{
      profile{
        ...ProfileByFragment
      }
    }
    hashtagsMentioned
  }
  
  fragment CommentFields on Comment {
    __typename
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    txHash
    createdAt
      by {
        ...ProfileByFragment
    }
    stats {
          ... PublicationStatsFragment
    }
    operations {
          ...PublicationOperationsFragment
    }
    metadata {
              ... PublicationMetadataFragment
    }
    isEncrypted
    profilesMentioned{
      profile{
        ...ProfileByFragment
      }
    }  
    hashtagsMentioned
    root{
      ... on Post{
        ...PostFields
      }
      ... on Quote{
    __typename
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    txHash
    createdAt
      by {
        ...ProfileByFragment
    }
    stats {
          ... PublicationStatsFragment
    }
    operations {
          ...PublicationOperationsFragment
    }
    metadata {
              ... PublicationMetadataFragment
    }
    isEncrypted
    profilesMentioned{
      profile{
        ...ProfileByFragment
      }
    }
    hashtagsMentioned
      }
    }
    commentOn{
      ... on Post{
        ...PostFields
      }
      ... on Comment{
    __typename
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    txHash
    createdAt
      by {
        ...ProfileByFragment
    }
    stats {
          ... PublicationStatsFragment
    }
    operations {
          ...PublicationOperationsFragment
    }
    metadata {
              ... PublicationMetadataFragment
    }
    isEncrypted
    profilesMentioned{
      profile{
        ...ProfileByFragment
      }
    }  
    hashtagsMentioned    	  
      }
      ... on Quote{
        id
      }
    }
    firstComment{
    __typename
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    txHash
    createdAt
      by {
        ...ProfileByFragment
    }
    stats {
          ... PublicationStatsFragment
    }
    operations {
          ...PublicationOperationsFragment
    }
    metadata {
              ... PublicationMetadataFragment
    }
    isEncrypted
    profilesMentioned{
      profile{
        ...ProfileByFragment
      }
    }  
    hashtagsMentioned    
    }
  }
  
  fragment MirrorFields on Mirror {
    __typename
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    txHash
    createdAt
    mirrorOn{
      ... on Post{
        ...PostFields
      }
      ... on Comment{
        ...CommentFields
      }
      ... on Quote{
        ...QuoteFields
      }
    }
      by {
        ...ProfileByFragment
    }
  
  }
  
  fragment QuoteFields on Quote {
    __typename
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    txHash
    createdAt
      by {
        ...ProfileByFragment
    }
    stats {
          ... PublicationStatsFragment
    }
    operations {
          ...PublicationOperationsFragment
    }
    metadata {
              ... PublicationMetadataFragment
    }
    isEncrypted
    profilesMentioned{
      profile{
        ...ProfileByFragment
      }
    }
    hashtagsMentioned
    quoteOn{
      ... on Post{
        ...PostFields
      }
      ... on Comment{
        ... CommentFields
      }
      ... on Quote{
          __typename
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    txHash
    createdAt
      by {
        ...ProfileByFragment
    }
    stats {
          ... PublicationStatsFragment
    }
    operations {
          ...PublicationOperationsFragment
    }
    metadata {
              ... PublicationMetadataFragment
    }
    isEncrypted
    profilesMentioned{
      profile{
        ...ProfileByFragment
      }
    }
    hashtagsMentioned
      }
    }
  }
  
  fragment MarketPlaceMetadataFragment on MarketplaceMetadata{
        description
      externalURL
      name
      attributes {
        displayType
        traitType
        value
      }
      image {
          raw{
          ... ImageSetFragment
        }
        optimized{
          ... ImageSetFragment
        }
      }
  }
  
  fragment PublicationMetadataFragment on PublicationMetadata {
          ... on VideoMetadataV3 {
              ...VideoMetadataV3Fragment
      }
        ... on TextOnlyMetadataV3{
        ... TextOnlyMetadataV3Fragment
      }
        ... on ImageMetadataV3{
        ... ImageMetadataV3Fragment
      }
        ... on AudioMetadataV3{
        ... AudioMetadataV3Fragment
      }
  }
  
  fragment PublicationMetadataMediaVideoFragment on PublicationMetadataMediaVideo{
    video{
      raw{
        mimeType
        uri
      }
      optimized{
        mimeType
        uri
      }
    }
    cover{
      raw{
        mimeType
        width
        height
        uri
      }
      optimized{
        ...ImageSetFragment
      }
    }
    duration
    license
    altTag
    attributes{
      type
      key
      value
    }
    
  }
  
  fragment PublicationMetadataMediaImageFragment on PublicationMetadataMediaImage{
    image{
      raw{
        mimeType
        width
        height
        uri
      }
      optimized{
        ...ImageSetFragment
      }
    }
    license
    altTag
    attributes{
      type
      key
      value
    }
  }
  
  fragment PublicationMetadataMediaAudioFragment on PublicationMetadataMediaAudio{
    audio{
      raw{
        mimeType
        uri
      }
      optimized{
        mimeType
        uri
      }
    }
    attributes{
      type
      key
      value
    }
    cover{
      raw{
        mimeType
        width
        height
        uri
      }
      optimized{
        ... ImageSetFragment
      }
    }
    duration
    license
    credits
    artist
    genre
    recordLabel
    lyrics
  }
  
  fragment VideoMetadataV3Fragment on VideoMetadataV3 {
    id
    rawURI
    locale
    tags
    contentWarning
    hideFromFeed
    appId
    marketplace {
          ... MarketPlaceMetadataFragment
    }
    asset{
          ... PublicationMetadataMediaVideoFragment
    }
    attachments{
          ... PublicationMetadataMediaVideoFragment
      ... PublicationMetadataMediaImageFragment
      ... PublicationMetadataMediaAudioFragment
    }
    isShortVideo
    title
    content
  }
  
  fragment TextOnlyMetadataV3Fragment on TextOnlyMetadataV3{
    id
    rawURI
    locale
    tags
    contentWarning
    hideFromFeed
    appId
    marketplace{
      ... MarketPlaceMetadataFragment
    }
    attributes{
      type
      key
      value
    }
    content
  }
  
  fragment ImageMetadataV3Fragment on ImageMetadataV3{
    id
    rawURI
    locale
    tags
    contentWarning
    hideFromFeed
    appId
    marketplace{
      ...MarketPlaceMetadataFragment
    }
    attributes{
      type
      key
      value
    }
    asset{
      ...PublicationMetadataMediaImageFragment
    }
    attachments{
          ... PublicationMetadataMediaVideoFragment
      ... PublicationMetadataMediaImageFragment
      ... PublicationMetadataMediaAudioFragment
    }
    title
    content
  }
  
  fragment AudioMetadataV3Fragment on AudioMetadataV3{
    id
    rawURI
    locale
    tags
    contentWarning
    hideFromFeed
    appId
    marketplace{
      ...MarketPlaceMetadataFragment
    }
    attributes{
      type
      key
      value
    }
    asset{
      ...  PublicationMetadataMediaAudioFragment
    }
    attachments{
          ... PublicationMetadataMediaVideoFragment
      ... PublicationMetadataMediaImageFragment
      ... PublicationMetadataMediaAudioFragment
    }
    title
    content
  }
  
  fragment FeedItem on FeedItem {
    id
    root {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Quote {
        ...QuoteFields
      }
    }
    mirrors {
      ...MirrorFields
    }
    reactions {
      ...ReactionEvent
    }
    comments {
      ...CommentFields
    }
  }
`