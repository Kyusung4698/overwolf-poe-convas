import fetch from 'node-fetch';
import { POST_LIST_QUERY } from './queries';
import { Company } from './types';

export async function fetchCompany(subdomain: string): Promise<Company> {
    const response = await fetch(`https://${subdomain}.convas.io/api/graphql`, {
        method: 'post',
        body: JSON.stringify({
            operationName: 'PostList',
            query: POST_LIST_QUERY,
            variables: {
                subdomain,
                postsLimit: 100,
                postsOffset: 0,
                postsWhereInput: {

                }
            }
        }),
        headers: { 'Content-Type': 'application/json' }
    });
    const { data } = await response.json();
    return data.company;
}