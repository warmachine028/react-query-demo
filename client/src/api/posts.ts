import axios from 'axios'
import { PostsResponse, Post } from '@/types'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export const getPosts = async (skip: number = 0, limit: number = 10): Promise<PostsResponse> => {
	try {
		const { data } = await api.get<PostsResponse>('/posts', {
			params: { skip, limit }
		})
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}

export const createPost = async (post: Omit<Post, 'id' | 'views'>): Promise<Post> => {
	try {
		const { data } = await api.post<Post>('/posts', post)
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}

export const updatePost = async (post: Partial<Post> & { id: number }): Promise<Post> => {
	try {
		const { data } = await api.put(`/posts/${post.id}`, post)
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}

export const deletePost = async (id: number): Promise<void> => {
	try {
		await api.delete(`/posts/${id}`)
	} catch (error) {
		throw handleApiError(error)
	}
}

export const searchPosts = async (query: string): Promise<PostsResponse> => {
	try {
		const { data } = await api.get<PostsResponse>(`/posts/search?q=${query}`)

		return data
	} catch (error) {
		throw handleApiError(error)
	}
}

// Get posts by user
export const getPostsByUser = async (userId: number): Promise<PostsResponse> => {
	try {
		const { data } = await api.get<PostsResponse>(`/posts/user/${userId}`)

		const postsWithImages = data.posts.map((post) => ({
			...post,
			imageUrl: `https://picsum.photos/seed/${post.id}/800/600`
		}))

		return {
			...data,
			posts: postsWithImages
		}
	} catch (error) {
		throw handleApiError(error)
	}
}

export const updateReaction = async (postId: number, type: 'like' | 'dislike') => {
	try {
		const { data } = await api.put(`/posts/${postId}`, { reactions: { [type]: +1 } })

		return data
	} catch (error) {
		throw handleApiError(error)
	}
}

// Error handling helper
const handleApiError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		const message = error.response?.data?.message || error.message
		console.error('API Error:', {
			status: error.response?.status,
			message,
			details: error.response?.data
		})
		throw new Error(`API Error: ${message}`)
	}
	console.error('Unexpected error:', error)
	throw error
}
