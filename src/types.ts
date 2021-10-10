export interface PostStatus {
    id: string;
    name: string;
}

export interface PostUser {
    name: string;
}

export interface PostComment {
    body: string;
    createdAt: string;
    user?: PostUser;
}

export interface Post extends PostComment {
    id: string;
    title: string;
    comments?: PostComment[];
    status: PostStatus;
    voteCount: number;
    commentCount: number;
}

export type Posts = {
    [id: string]: Post;
}

export interface Company {
    id: string;
    name: string;
    posts: Post[];
}
