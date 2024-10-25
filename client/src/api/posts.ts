import axios from 'axios'
import { PostsResponse, Post } from '@/types'
import { handleApiError } from '@/lib/utils'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export const getPosts = async (skip: number = 0, limit: number = 10): Promise<PostsResponse> => {
	try {
		const { data } = await api.get<PostsResponse>('/posts', { params: { skip, limit } })
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}

export const searchPosts = async (query: string): Promise<PostsResponse> => {
	try {
		const { data } = await api.get<PostsResponse>('/posts/search', { params: { q: query } })
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}

export const getPost = async (id: number): Promise<Post> => {
	try {
		const { data } = await api.get<Post>(`/posts/${id}`)
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

export const updatePost = async (post: Partial<Post>): Promise<Post> => {
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

export const updateReaction = async (id: number, type: 'like' | 'dislike'): Promise<Post> => {
	try {
		const { data } = await api.put(`/posts/${id}`, { reactions: { [type]: +1 } })
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}
