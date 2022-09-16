export type PostEntityId = string;

export interface PostEntity {
    id: PostEntityId;
    title: string;
    body: string;
    timeAgo: string;
    comments: PostCommentEntity[];
    user: PostUserEntity;
    status: PostStatusEntity;
    voteCount: number;
    commentCount: number;
}

export type PostEntitySet = Record<PostEntityId, PostEntity>;

export interface PostCommentEntity {
    body: string;
    timeAgo: string;
    user: PostUserEntity;
}

export interface PostUserEntity {
    name: string;
}

export interface PostStatusEntity {
    name: string;
}