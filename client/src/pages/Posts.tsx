import { useRef, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button, Input, Textarea, ScrollArea, Badge, Search } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, RefreshCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreatePost, useGetPosts, useRefresh } from '@/hooks'
import { Post } from '@/components'
import { useStore } from '@/store'
import { Post as PostType } from '@/types'
import Fuse from 'fuse.js'
import { useSearchParams } from 'react-router-dom'

const CreatePost = () => {
	const initialData = {
		title: '',
		body: '',
		tags: '',
		image: null as File | null
	}
	const [post, setPost] = useState(initialData)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const addMutation = useCreatePost()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, files } = e.target as HTMLInputElement

		if (name === 'image') {
			setPost({ ...post, image: files?.[0] || null })
		} else {
			setPost({ ...post, [name]: value })
		}
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		addMutation.mutate({
			title: post.title.trim(),
			body: post.body.trim(),
			userId: 1,
			tags: post.tags
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean),
			reactions: {
				likes: 0,
				dislikes: 0
			}
		})

		setPost(initialData)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	return (
		<Card className="shadow-lg">
			<CardHeader className="bg-primary text-primary-foreground">
				<CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						type="text"
						name="title"
						value={post.title}
						onChange={handleChange}
						placeholder="eg: Sunshine Radio 📻"
						className="w-full"
					/>
					<Textarea
						name="body"
						value={post.body}
						onChange={handleChange}
						placeholder="eg: Sunshine Radio is a radio station that plays music 24/7. It's a great place to relax and enjoy the music."
						className="w-full min-h-24"
					/>
					<Input
						type="text"
						name="tags"
						value={post.tags}
						onChange={handleChange}
						placeholder="eg: radio, music, relax"
						className="w-full"
					/>
					<div className="flex items-center space-x-2">
						<Input
							type="file"
							name="image"
							onChange={handleChange}
							className="w-full"
							accept="image/*"
							placeholder="eg: radio.png"
							ref={fileInputRef}
						/>
						<Button
							type="submit"
							disabled={addMutation.isPending}
							className="bg-primary text-primary-foreground"
						>
							{addMutation.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Plus className="h-4 w-4 mr-2" />
							)}
							Add Post
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}

const useSearch = (posts: PostType[]) => {
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


const Posts = () => {
	const { ref, inView } = useInView()
	const { optimisticPages } = useStore()
	const { fetchNextPage, hasNextPage, isFetchingNextPage, status } = useGetPosts()
	const { refresh, refreshing } = useRefresh()

	const allPosts = optimisticPages.flatMap((page) => page.posts)
	const { query, setQuery, results } = useSearch(allPosts)

	useEffect(() => {
		if (inView && hasNextPage && !query) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, query, fetchNextPage])

	return (
		<div className="container mx-auto p-4 space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2">
					<Card className="shadow-lg">
						<CardHeader className="bg-primary text-primary-foreground">
							<div className="flex items-center justify-between">
								<CardTitle className="text-2xl font-bold">Posts</CardTitle>
								<Button
									variant="outline"
									onClick={refresh}
									className="bg-primary"
									disabled={refreshing}
								>
									<RefreshCcw className={`${refreshing && 'animate-spin'} mr-2`} />
									{refreshing ? 'Refreshing' : 'Refresh'}
								</Button>
							</div>
							<Badge variant="secondary" className="mt-2">
								{allPosts.length} posts
							</Badge>
						</CardHeader>
						<CardContent className="p-6">
							<div className="mb-4">
								<Search
									type="text"
									placeholder="Search posts..."
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className="w-full"
								/>
							</div>
							<ScrollArea className="h-[calc(100vh-20rem)]">
								{status === 'pending' ? (
									<div className="flex justify-center items-center h-full">
										<Loader2 className="h-8 w-8 animate-spin text-primary" />
									</div>
								) : status === 'error' ? (
									<p className="text-center text-destructive">Error fetching posts</p>
								) : (
									<AnimatePresence>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max"
										>
											{results.map((post) => (
												<Post key={post.id} post={post} />
											))}
										</motion.div>
									</AnimatePresence>
								)}
								{isFetchingNextPage && (
									<div className="flex justify-center mt-4">
										<Loader2 className="h-6 w-6 animate-spin text-primary" />
									</div>
								)}
								<div ref={ref} className="h-1" />
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
				<div className="md:col-span-1">
					<CreatePost />
				</div>
			</div>
		</div>
	)
}

export default Posts