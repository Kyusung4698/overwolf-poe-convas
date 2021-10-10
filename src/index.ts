import fs from 'fs/promises';
import { fetchCompany } from './client';
import { Company, Posts } from './types';
import { onUpdate } from './webhook';

const ENV = {
    SUBDOMAIN: 'poe-overlay',
    SOURCE: './data/posts.json'
};

export async function execute() {
    let company: Company;
    try {
        company = await fetchCompany(ENV.SUBDOMAIN);
    } catch (error) {
        console.warn(`An unexpected error occured while fetching company for subdomain: '${ENV.SUBDOMAIN}'.`, error);
        throw error;
    }

    let prevPosts: Posts = {}
    try {
        const prevPostsRaw = await fs.readFile(ENV.SOURCE, 'utf-8');
        prevPosts = JSON.parse(prevPostsRaw);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn('An unexpected error occured while reading posts.', error);
            throw error;
        }
    }

    const nextPosts: Posts = company.posts.reduce((set, post) => {
        set[post.id] = post;
        return set;
    }, {});
    try {
        await fs.writeFile(ENV.SOURCE, JSON.stringify(nextPosts, undefined, 4));
    } catch (error) {
        console.warn('An unexpected error occured while writing posts.', error);
        throw error;
    }

    onUpdate(prevPosts, nextPosts);
}
