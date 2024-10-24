import { useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button, Input, Textarea, ScrollArea, Badge } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, RefreshCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreatePost, useGetPosts, useRefresh } from '@/hooks'
import { Post } from '@/components'
import { useStore } from '@/store'

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

const Posts = () => {
	const { ref, inView } = useInView()
	const { optimisticPages } = useStore()
	const { fetchNextPage, hasNextPage, isFetchingNextPage, status } = useGetPosts()
	const {refresh, refreshing} = useRefresh()

	if (inView && hasNextPage) {
		fetchNextPage()
	}

	return (
		<div className="container mx-auto sm:p-4">
			<CreatePost />

			<Card className="shadow-lg h-full sm:h-auto mt-6">
				<CardHeader className="bg-primary text-primary-foreground">
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl font-bold">Posts</CardTitle>
						<Button
							variant="outline"
							onClick={refresh}
							className="bg-primary"
							disabled={refreshing}
						>
							<RefreshCcw className={`${refreshing && 'animate-spin'}`} />
							{refreshing && <Loader2 className="h-4 w-4 animate-spin" />}
						</Button>
					</div>
					<Badge variant="secondary" className="ml-2">
						{optimisticPages.flatMap((page) => page.posts).length || 0} posts
					</Badge>
				</CardHeader>
				<CardContent className="p-6">
					<ScrollArea className="h-96">
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
									className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
								>
									{optimisticPages.map((page) =>
										page.posts.map((post) => <Post key={post.id} post={post} />)
									)}
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
	)
}

export default Posts
