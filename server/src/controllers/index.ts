type GetPostsParams = {
	query: {
		cursor: string
		limit: number
	}
}
export const getPosts = async ({ query: { cursor, limit } }: GetPostsParams) => {
	console.log(cursor, limit)
}
