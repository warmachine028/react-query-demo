import type { Post, Request } from '@/types'

const baseUrl = 'https://dummyjson.com'
const delay = 5000

export const getPosts = async ({ query: { skip, limit } }: Request): Promise<Post[]> => {
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

export const searchPosts = async ({ query: { q } }: Request): Promise<Post[]> => {
	const response = await fetch(`${baseUrl}/posts/search?q=${q}&delay=${delay}`)
	const data = await response.json()

	return {
		...data,
		posts: data.posts.map((post: Post) => ({
			...post,
			imageUrl: `https://picsum.photos/seed/${post.id}/800/600`
		}))
	}
}

export const getPost = async ({ params: { id } }: Request): Promise<Post> => {
	const response = await fetch(`${baseUrl}/posts/${id}`)
	const data = await response.json()
	return {
		...data,
		imageUrl: `https://picsum.photos/seed/${data.id}/800/600`
	}
}

export const createPost = async ({ body }: Request): Promise<Post> => {
	const response = await fetch(`${baseUrl}/posts/add?delay=${delay}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	})
	const data = await response.json()
	return {
		...data,
		imageUrl: `https://picsum.photos/seed/${data.id}/800/600`
	}
}

export const updatePost = async ({ body, params: { id } }: Request): Promise<Post> => {
	const response = await fetch(`${baseUrl}/posts/${id}?delay=${delay}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	})
	const data = await response.json()
	return {
		...data,
		imageUrl: `https://picsum.photos/seed/${data.id}/800/600`
	}
}

export const deletePost = async ({ params: { id } }: Request): Promise<void> => {
	const response = await fetch(`${baseUrl}/posts/${id}?delay=${delay}`, { method: 'DELETE' })
	return response.json()
}


