import { PostPage } from '@/types'
import { useContext } from 'react'
import { ThemeContext } from '@/contexts'
import { createPost, deletePost, getPosts, updatePost } from '@/api'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useTheme = () => {
	const context = useContext(ThemeContext)

	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}

	return context
}

export const useCreatePost = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createPost,
		onMutate: async (newPost) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] })
			const previousData = queryClient.getQueryData(['posts'])

			queryClient.setQueryData<{ pages: PostPage[]; pageParams: number[] }>(['posts'], (old) => {
				if (!old) {
					return { pages: [], pageParams: [] }
				}
				return {
					...old,
					pages: [
						{
							posts: [
								{
									...newPost,
									id: Date.now(),
									imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
									views: 0,
									reactions: {
										likes: 0,
										dislikes: 0
									}
								}
							],
							nextCursor: old.pages[0]?.nextCursor
						},
						...old.pages
					]
				}
			})

			return { previousData }
		},
		onError: (_err, _newPost, context) => {
			queryClient.setQueryData(['posts'], context?.previousData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] })
		}
	})
}

export const useUpdatePost = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updatePost,
		onMutate: async (updatedPost) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] })
			const previousData = queryClient.getQueryData(['posts'])

			queryClient.setQueryData<{ pages: PostPage[]; pageParams: number[] }>(['posts'], (old) => {
				if (!old) return { pages: [], pageParams: [] }
				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						posts: page.posts.map((post) =>
							post.id === updatedPost.id ? { ...post, ...updatedPost } : post
						)
					}))
				}
			})

			return { previousData }
		},
		onError: (_err, _updatedPost, context) => {
			queryClient.setQueryData(['posts'], context?.previousData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] })
		}
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
		onError: (_err, _postId, context) => {
			queryClient.setQueryData(['posts'], context?.previousData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] })
		}
	})
}

export const useGetPosts = () => {
	return useInfiniteQuery({
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
}