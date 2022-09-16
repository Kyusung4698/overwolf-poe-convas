import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { BoardFetchResult, PostFetchResult } from './convas.types';

export class ConvasClient {
    public constructor(
        private readonly subdomain: string
    ) { }

    public async fetchBoard(): Promise<BoardFetchResult> {
        try {
            const params = new URLSearchParams({
                limit: '100',
                _data: 'routes/__public/__c/index'
            });
            const response = await fetch(`https://${this.subdomain}.convas.io/?${params}`);
            return await response.json();
        } catch (error) {
            console.warn(`An unexpected error occurred while fetching board for subdomain: '${this.subdomain}'.`, error);
            throw error;
        }
    }

    public async fetchPost(path: string): Promise<PostFetchResult> {
        try {
            const params = new URLSearchParams({
                _data: 'routes/__public/__c/$boardSlug.$postSlug'
            });
            const response = await fetch(`https://${this.subdomain}.convas.io${path}?${params}`);
            return await response.json();
        } catch (error) {
            console.warn(`An unexpected error occurred while fetching post: ${path} for subdomain: '${this.subdomain}'.`, error);
            throw error;
        }
    }
}