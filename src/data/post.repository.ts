import fs from 'fs/promises';
import { PostEntitySet } from './post.entity';

export class PostRepository {
    public constructor(
        private readonly source: string
    ) { }

    public async fetch(): Promise<PostEntitySet> {
        try {
            const stringified = await fs.readFile(this.source, 'utf-8');
            return JSON.parse(stringified);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.warn('An unexpected error occurred while fetching posts.', error);
                throw error;
            }
        }
    }

    public async store(entities: PostEntitySet): Promise<void> {
        try {
            const stringified = JSON.stringify(entities, undefined, 4);
            await fs.writeFile(this.source, stringified);
        } catch (error) {
            console.warn('An unexpected error occurred while storing posts.', error);
            throw error;
        }
    }
}