export interface PostStatus {
    id: string;
    name: string;
}

export interface Post {
    id: string;
    title: string;
    body: string;
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
