import fs from 'fs/promises';
import { env } from 'process';
import { fetchCompany } from './client';
import { Company, Posts } from './types';
import { Webhook } from './webhook';

export async function execute() {
    const {
        SUBDOMAIN,
        BOARD,
        SOURCE,
        WEBHOOK,
        AVATAR_URL
    } = env;
    if (!SUBDOMAIN?.length) {
        throw 'env.SUBDOMAIN was undefined or empty.'
    }
    if (!BOARD?.length) {
        throw 'env.BOARD was undefined or empty.'
    }
    if (!SOURCE?.length) {
        throw 'env.SOURCE was undefined or empty.'
    }
    if (!WEBHOOK?.length) {
        throw 'env.WEBHOOK was undefined or empty.'
    }
    if (!AVATAR_URL?.length) {
        throw 'env.AVATAR_URL was undefined or empty.'
    }

    console.info('executing with: ' + JSON.stringify({ SUBDOMAIN, SOURCE, WEBHOOK, AVATAR_URL }));

    console.info('fetching company...');
    let company: Company;
    try {
        company = await fetchCompany(SUBDOMAIN);
    } catch (error) {
        console.warn(`An unexpected error occured while fetching company for subdomain: '${SUBDOMAIN}'.`, error);
        throw error;
    }

    console.info('reading post...');
    let prevPosts: Posts = {}
    try {
        const prevPostsRaw = await fs.readFile(SOURCE, 'utf-8');
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

    console.info('writing post...');
    try {
        await fs.writeFile(env.SOURCE, JSON.stringify(nextPosts, undefined, 4));
    } catch (error) {
        console.warn('An unexpected error occured while writing posts.', error);
        throw error;
    }

    console.info('updating...');
    const webhook = new Webhook(WEBHOOK, SUBDOMAIN, BOARD, AVATAR_URL);
    webhook.onUpdate(prevPosts, nextPosts);
}
