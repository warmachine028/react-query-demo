import axios from 'axios'
import { PostsResponse, Post } from '@/types'

const API_URL = 'https://dummyjson.com'

export const getPosts = async (skip: number = 0, limit: number = 10): Promise<PostsResponse> => {
	try {
		const { data } = await axios.get<PostsResponse>(`${API_URL}/posts?limit=${limit}&skip=${skip}`)

		// Add imageUrl and transform reactions to the required format for each post
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

// Other API functions remain similar but need to be updated with the new Post interface
export const createPost = async (post: Omit<Post, 'id' | 'imageUrl' | 'views'>): Promise<Post> => {
	try {
		const { data } = await axios.post(`${API_URL}/posts/add`, post)
		return {
			...data,
			imageUrl: `https://picsum.photos/seed/${data.id}/800/600`,
			views: 0,
			reactions: { likes: 0, dislikes: 0 }
		}
	} catch (error) {
		throw handleApiError(error)
	}
}

export const updatePost = async (post: Partial<Post> & { id: number }): Promise<Post> => {
	try {
		const { data } = await axios.put(`${API_URL}/posts/${post.id}`, post)
		return {
			...data,
			imageUrl: `https://picsum.photos/seed/${data.id}/800/600`,
			reactions: post.reactions || { likes: 0, dislikes: 0 },
			views: post.views || 0
		}
	} catch (error) {
		throw handleApiError(error)
	}
}

// Delete a post
export const deletePost = async (id: number): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/posts/${id}`)
	} catch (error) {
		throw handleApiError(error)
	}
}

// Search posts
export const searchPosts = async (query: string): Promise<PostsResponse> => {
	try {
		const { data } = await axios.get<PostsResponse>(`${API_URL}/posts/search?q=${query}`)

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

// Get posts by user
export const getPostsByUser = async (userId: number): Promise<PostsResponse> => {
	try {
		const { data } = await axios.get<PostsResponse>(`${API_URL}/posts/user/${userId}`)

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
