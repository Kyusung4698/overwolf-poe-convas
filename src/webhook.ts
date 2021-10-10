import { Posts } from './types';

export function onUpdate(prevPosts: Posts, nextPosts: Posts): void {
    const ids = Object.keys(nextPosts);
    for (const id of ids) {
        const prev = prevPosts[id];
        const next = nextPosts[id];
        if (!prev) {
            console.info('new post', next.title, next.body);
        } else {
            const template = ``;
            if (prev.voteCount !== next.voteCount) {
                console.info('new vote on', next.title, next.body);
            }
            if (prev.commentCount !== next.commentCount) {
                console.info('new comment on', next.title, next.body);
            }
            if (prev.status.id !== next.status.id) {
                console.info('new status on', next.title, next.body);
            }
        }
    }
}