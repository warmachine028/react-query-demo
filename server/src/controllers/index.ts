interface Post {
	id: number
	title: string
	reactions: { likes: number; dislikes: number }
	tags: string[]
	userId: number
	imageUrl: string
}

type GetPostsParams = {
	query: { skip?: string; limit?: string }
}

type UpdatePostParams = {
	params: { id: number }
	body: Post
}

type CreatePostParams = {
	body: Omit<Post, 'id' | 'imageUrl' | 'views'>
}

const baseUrl = 'https://dummyjson.com'

export const getPosts = async ({ query: { skip, limit } }: GetPostsParams): Promise<Post[]> => {
	const response = await fetch(`${baseUrl}/posts?skip=${skip || 0}&limit=${limit || 10}`)
	const data = await response.json()

	return {
		...data,
		posts: data.posts.map((post: Post) => ({
			...post,
			imageUrl: `https://picsum.photos/seed/${post.id}/800/600`
		}))
	}
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const createPost = async ({ body: post }: CreatePostParams): Promise<Post> => {
	await sleep(5000)
	const response = await fetch(`${baseUrl}/posts/add`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(post)
	})
	const data = await response.json()
	return {
		...data,
		imageUrl: `https://picsum.photos/seed/${data.id}/800/600`
	}
}

export const updatePost = async ({ body: post, params: { id } }: UpdatePostParams): Promise<Post> => {
	await sleep(5000)
	const response = await fetch(`${baseUrl}/posts/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(post)
	})
	const data = await response.json()
	return {
		...data,
		imageUrl: `https://picsum.photos/seed/${data.id}/800/600`
	}
}
