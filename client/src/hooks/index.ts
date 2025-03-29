import type { Post, PostPage } from '@/types'
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '@/contexts'
import { createPost, deletePost, getPosts, searchPosts, updatePost, updateReaction } from '@/api'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store'
import { useSearchParams } from 'react-router'
import Fuse from 'fuse.js'

export const useTheme = () => {
	const context = useContext(ThemeContext)

	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}

	return context
}

export const useGetPosts = () => {
	const { setOptimisticPages } = useStore()

	const query = useInfiniteQuery({
		queryKey: ['posts'],
		queryFn: async ({ pageParam = 0 }) => {
			const response = await getPosts(pageParam, 10)
			return {
				posts: response.posts,
				nextCursor: pageParam + 10 < response.total ? pageParam + 10 : undefined
			}
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		initialPageParam: 1
	})

	useEffect(() => {
		if (query.data?.pages) {
			setOptimisticPages(query.data.pages)
		}
	}, [query.data?.pages, setOptimisticPages])

	return query
}

export const useCreatePost = () => {
	const queryClient = useQueryClient() // Use QueryClient directly instead of from store
	const { optimisticPages, setOptimisticPages } = useStore()

	return useMutation({
		mutationFn: createPost,
		onMutate: async (newPost) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] })
			const previousData = queryClient.getQueryData(['posts'])

			const optimisticPost: Post = {
				...newPost,
				id: Date.now(),
				imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
				views: 0,
				reactions: {
					likes: 0,
					dislikes: 0
				}
			}

			const updatedPages = [
				{
					posts: [optimisticPost],
					nextCursor: optimisticPages[0]?.nextCursor
				},
				...optimisticPages
			]

			queryClient.setQueryData<{ pages: PostPage[]; pageParams: number[] }>(['posts'], (old) => ({
				...(old ?? { pageParams: [] }),
				pages: updatedPages
			}))
			setOptimisticPages(updatedPages)

			return { previousData }
		},
		onError: (_err, _newPost, context) => {
			const previousPages = (context?.previousData as { pages: PostPage[] })?.pages ?? []
			queryClient.setQueryData(['posts'], context?.previousData)
			setOptimisticPages(previousPages)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
	})
}

export const useUpdatePost = () => {
	const queryClient = useQueryClient()
	const { optimisticPages, setOptimisticPages } = useStore()

	return useMutation({
		mutationFn: updatePost,
		onMutate: async (updatedPost) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] })
			const previousData = queryClient.getQueryData(['posts'])

			// Update both states
			const newPages = optimisticPages.map((page) => ({
				...page,
				posts: page.posts.map((post) => (post.id === updatedPost.id ? { ...post, ...updatedPost } : post))
			}))

			queryClient.setQueryData<{ pages: PostPage[]; pageParams: number[] }>(['posts'], (old) => ({
				...(old ?? { pageParams: [] }),
				pages: newPages
			}))
			setOptimisticPages(newPages)

			return { previousData }
		},
		onError: (_err, _updatedPost, context) => {
			const previousPages = (context?.previousData as { pages: PostPage[] })?.pages ?? []
			queryClient.setQueryData(['posts'], context?.previousData)
			setOptimisticPages(previousPages)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
	})
}

export const useDeletePost = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deletePost,
		onMutate: async (postId) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] })
			const previousData = queryClient.getQueryData(['posts'])

			queryClient.setQueryData<{ pages: PostPage[]; pageParams: number[] }>(['posts'], (old) => {
				if (!old) {
					return { pages: [], pageParams: [] }
				}
				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						posts: page.posts.filter((post) => post.id !== postId)
					}))
				}
			})

			return { previousData }
		},
		onError: (_err, _postId, context) => queryClient.setQueryData(['posts'], context?.previousData),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
	})
}

export const useSearchPosts = () => {
	return useQuery({
		queryKey: ['searchPosts'],
		queryFn: () => searchPosts
	})
}

export const useRefresh = () => {
	const queryClient = useQueryClient()
	const { setOptimisticPages } = useStore()
	const [refreshing, setRefreshing] = useState(false)

	return {
		refresh: async () => {
			try {
				setRefreshing(true)
				// Reset the optimistic state first
				setOptimisticPages([])

				// Reset and refetch the posts query
				await queryClient.resetQueries({ queryKey: ['posts'] })

				return true
			} catch (error) {
				console.error('Failed to refresh:', error)
				return false
			} finally {
				setRefreshing(false)
			}
		},
		refreshing
	}
}

export const useSearch = (posts: Post[]) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const query = searchParams.get('q') || ''

	const getSearchResults = (searchQuery: string) => {
		if (!searchQuery) return posts

		const fuse = new Fuse(posts, {
			keys: ['title', 'body', 'tags'],
			threshold: 0.3
		})

		const searchResults = fuse.search(searchQuery)
		return searchResults.map((result) => result.item)
	}

	const results = getSearchResults(query)

	const setQuery = (newQuery: string) => {
		if (newQuery) {
			setSearchParams({ q: newQuery })
		} else {
			setSearchParams({})
		}
	}

	return { query, setQuery, results }
}

export const useUpdateReaction = () => {
	const queryClient = useQueryClient()
	const { optimisticPages, setOptimisticPages } = useStore()

	return useMutation({
		mutationFn: ({ postId, type }: { postId: number; type: 'like' | 'dislike' }) => updateReaction(postId, type),
		onMutate: async ({ postId, type }) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] })
			const previousData = queryClient.getQueryData(['posts'])

			// Update both states with optimistic update
			const newPages = optimisticPages.map((page) => ({
				...page,
				posts: page.posts.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							reactions: {
								...post.reactions,
								likes: post.reactions.likes + (type === 'like' ? 1 : 0),
								dislikes: post.reactions.dislikes + (type === 'dislike' ? 1 : 0)
							}
						}
					}
					return post
				})
			}))

			queryClient.setQueryData<{ pages: PostPage[]; pageParams: number[] }>(['posts'], (old) => ({
				...(old ?? { pageParams: [] }),
				pages: newPages
			}))
			setOptimisticPages(newPages)

			return { previousData }
		},
		onError: (_err, _variables, context) => {
			const previousPages = (context?.previousData as { pages: PostPage[] })?.pages ?? []
			queryClient.setQueryData(['posts'], context?.previousData)
			setOptimisticPages(previousPages)
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
	})
}
