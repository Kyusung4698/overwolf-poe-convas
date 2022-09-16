import fetch from 'node-fetch';
import { PostEntitySet } from './data';

interface EmbedAuthor {
    name: string;
}

interface EmbedFooter {
    text?: string;
}

interface EmbedField {
    name: string;
    value: string;
    inline: boolean;
}

interface Embed {
    title?: string;
    description?: string;
    url?: string;
    author?: EmbedAuthor;
    timestamp?: string;
    footer?: EmbedFooter;
    fields?: EmbedField[];
}

interface ExecuteWebhookRequest {
    content: string;
    username: string;
    avatar_url: string;
    embeds: Embed[];
}

export class Webhook {
    constructor(
        private readonly url: string,
        private readonly subdomain: string,
        private readonly board: string,
        private readonly avatarUrl: string
    ) { }

    public onUpdate(
        prevPosts: PostEntitySet,
        nextPosts: PostEntitySet
    ): void {
        const ids = Object.keys(nextPosts);

        const newPosts: Embed[] = [];
        const voteChanged: Embed[] = [];
        const commentAdded: Embed[] = [];
        const statusChanged: Embed[] = [];

        for (const id of ids) {
            const prev = prevPosts[id];
            const next = nextPosts[id];
            const author = next?.user?.name || 'Anonymous';
            if (!prev) {
                newPosts.push({
                    title: next.title,
                    description: next.body,
                    url: `https://${this.subdomain}.convas.io/${this.board}/${next.id}`,
                    author: { name: author },
                    footer: { text: `status: ${next.status.name.toLowerCase()}, upvotes: ${next.voteCount}, comments: ${next.commentCount}` }
                });
            } else {
                if (prev.commentCount !== next.commentCount) {
                    commentAdded.push({
                        title: next.title,
                        description: next.body,
                        url: `https://${this.subdomain}.convas.io/${this.board}/${next.id}`,
                        author: { name: author },
                        footer: { text: `status: ${next.status.name.toLowerCase()}, upvotes: ${next.voteCount}, comments: ${next.commentCount}` },
                        fields: next.comments.slice(prev.commentCount, next.commentCount).map(x => ({
                            name: `${x.user?.name || 'Anonymous'} - ${x.timeAgo}`,
                            value: x.body,
                            inline: true
                        }))
                    });
                } else if (prev.status.name !== next.status.name) {
                    statusChanged.push({
                        title: next.title,
                        description: next.body,
                        url: `https://${this.subdomain}.convas.io/${this.board}/${next.id}`,
                        author: { name: author },
                        footer: { text: `status: ${next.status.name.toLowerCase()}, upvotes: ${next.voteCount}, comments: ${next.commentCount}` },
                        fields: [{
                            name: `Status changed`,
                            value: `From ${prev.status.name.toLowerCase()} to ${next.status.name.toLowerCase()}`,
                            inline: true
                        }]
                    });
                } else if (prev.voteCount !== next.voteCount) {
                    voteChanged.push({
                        title: next.title,
                        description: next.body,
                        url: `https://${this.subdomain}.convas.io/${this.board}/${next.id}`,
                        author: { name: author },
                        footer: { text: `status: ${next.status.name.toLowerCase()}, upvotes: ${next.voteCount}, comments: ${next.commentCount}` }
                    });
                }
            }
        }

        while (newPosts.length > 0) {
            const chunk = newPosts.splice(0, 10);
            this.execute(`${chunk.length} new post${chunk.length > 1 ? 's were' : ' was'} created on \`${this.board}\``, chunk);
        }
        while (commentAdded.length > 0) {
            const chunk = commentAdded.splice(0, 10);
            this.execute(`${chunk.length} post${chunk.length > 1 ? 's' : ''} received a new comment on \`${this.board}\``, chunk);
        }
        while (voteChanged.length > 0) {
            const chunk = voteChanged.splice(0, 10);
            this.execute(`${chunk.length} post${chunk.length > 1 ? 's' : ''} received a new vote on \`${this.board}\``, chunk);
        }
        while (statusChanged.length > 0) {
            const chunk = statusChanged.splice(0, 10);
            this.execute(`${chunk.length} post${chunk.length > 1 ? 's' : ''} status changed on \`${this.board}\``, chunk);
        }
    }

    private async execute(content: string, embeds?: Embed[]): Promise<boolean> {
        const request: ExecuteWebhookRequest = {
            avatar_url: this.avatarUrl,
            username: `${this.subdomain}.convas.io`,
            content, embeds
        };
        try {
            await fetch(this.url, {
                method: 'post',
                body: JSON.stringify(request),
                headers: { 'Content-Type': 'application/json' }
            });
            return true;
        } catch (error) {
            console.warn('An unexpected error occurred while executing webhook.', this.url, request, error);
            return false;
        }
    }
}