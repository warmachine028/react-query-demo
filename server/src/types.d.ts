export interface Post {
	id: number
	title: string
	reactions: { likes: number; dislikes: number }
	tags: string[]
	userId: number
	imageUrl: string
}


export type Request = {
	params: { id: number }
	query: { skip?: string; limit?: string; q?: string }
	body: Post
}

export type PostsResponse = {
	posts: Post[]
	total: number
	skip: number
	limit: number
}
