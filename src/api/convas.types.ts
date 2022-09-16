export interface PostBase {
    id: string;
    body: string;
    title: string;
    status: Status;
}

export interface BoardPost extends PostBase {
    _count: BoardPostCount;
    postPath: string;
}

export interface Status {
    name: string;
}

export interface BoardPostCount {
    votes: number;
    comments: number;
}

export interface Post extends PostBase {
    createdAt: string;
    user: User;
}

export interface User {
    name: string;
}

export interface PostTimelineEvent {
    id: string;
    eventType: PostTimelineEventType;
    createdAt: string;
    jsonBody: string;
    timeAgo: string;
    user: User;
}

export interface PostTimelineEventContent {
    type: 'doc' | 'paragraph' | 'text' | 'image';
    content: PostTimelineEventContent[];
    text?: string;
}

export enum PostTimelineEventType {
    Comment = 'comment'
}

export interface BoardFetchResult {
    posts: BoardPost[];
}

export interface PostFetchResult {
    post: Post;
    timeline: PostTimelineEvent[];
}