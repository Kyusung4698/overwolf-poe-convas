
export const POST_LIST_QUERY = `
    query PostList($subdomain: String, $customDomain: String, $postsWhereInput: PostsWhereInput, $postsOrderBy: String, $postsLimit: Int, $postsOffset: Int) {
        company(subdomain: $subdomain, customDomain: $customDomain) {
            id
            name
            posts(
                where: $postsWhereInput
                orderBy: $postsOrderBy
                limit: $postsLimit
                offset: $postsOffset
            ) {
                id
                title
                body
                status {
                    id
                    name
                    color
                }
                voteCount
                commentCount
            }
        }
    }
`;