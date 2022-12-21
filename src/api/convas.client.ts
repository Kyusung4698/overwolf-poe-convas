import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { BoardFetchResult, PostFetchResult } from './convas.types';

export class ConvasClient {
    public constructor(
        private readonly host: string
    ) { }

    public async fetchBoard(): Promise<BoardFetchResult> {
        try {
            const params = new URLSearchParams({
                limit: '100',
                _data: 'routes/__public/__c/index'
            });
            const response = await fetch(`https://${this.host}/?${params}`);
            return await response.json();
        } catch (error) {
            console.warn(`An unexpected error occurred while fetching board for host: '${this.host}'.`, error);
            throw error;
        }
    }

    public async fetchPost(path: string): Promise<PostFetchResult> {
        try {
            const params = new URLSearchParams({
                _data: 'routes/__public/__c/$boardSlug.$postSlug'
            });
            const response = await fetch(`https://${this.host}${path}?${params}`);
            return await response.json();
        } catch (error) {
            console.warn(`An unexpected error occurred while fetching post: ${path} for host: '${this.host}'.`, error);
            throw error;
        }
    }
}