import { env } from 'process';
import { BoardPost, ConvasClient, PostTimelineEventContent, PostTimelineEventType } from './api';
import { assert } from './assert';
import { PostEntity, PostEntitySet, PostRepository } from './data';
import { Webhook } from './webhook';

export async function execute(

) {
    assert('env.SUBDOMAIN', env.SUBDOMAIN);
    assert('env.BOARD', env.BOARD);
    assert('env.SOURCE', env.SOURCE);
    assert('env.WEBHOOK', env.WEBHOOK);
    assert('env.AVATAR_URL', env.AVATAR_URL);

    const repository = new PostRepository(env.SOURCE);
    const client = new ConvasClient(env.SUBDOMAIN);
    const webhook = new Webhook(env.WEBHOOK, env.SUBDOMAIN, env.BOARD, env.AVATAR_URL);

    console.info('fetching previous posts...');
    const prevPosts = await repository.fetch();

    console.info('fetching board...');
    const board = await client.fetchBoard();

    const mapPost = async (
        next: BoardPost,
        prev: PostEntity
    ): Promise<PostEntity> => {
        const result: PostEntity = {
            id: next.id,
            title: next.title,
            body: next.body,
            timeAgo: prev?.timeAgo,
            comments: prev?.comments || [],
            user: prev?.user,
            status: {
                name: next.status.name
            },
            voteCount: next._count.votes,
            commentCount: next._count.comments
        };

        if (!result.timeAgo?.length
            || !result.user?.name?.length
            || result.commentCount !== prev.commentCount
            || result.voteCount !== prev.voteCount
        ) {
            const { post, timeline } = await client.fetchPost(next.postPath);
            result.timeAgo = post.createdAt;
            result.user = {
                name: post.user?.name || 'Anonymous'
            };
            result.comments = timeline
                .filter(x => x.eventType === PostTimelineEventType.Comment)
                .map(x => {
                    const body: PostTimelineEventContent = JSON.parse(x.jsonBody);
                    return {
                        body: body.content
                            .filter(x => x.type === 'paragraph')
                            .map(p => p.content
                                .filter(x => x.type === 'text')
                                .map(x => x.text)
                                .join('\n'))
                            .join('\n') || 'no content.',
                        timeAgo: x.timeAgo,
                        user: {
                            name: x.user?.name || 'Anonymous'
                        }
                    }
                })
        }

        return result;
    }

    const nextPosts: PostEntitySet = {};

    const posts = board.posts;
    for (const next of posts) {
        const prev = prevPosts[next.id];
        nextPosts[next.id] = await mapPost(next, prev);
    }

    console.info('storing next posts...');
    await repository.store(nextPosts);

    console.info('updating...');
    webhook.onUpdate(prevPosts, nextPosts);
}
