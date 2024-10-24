import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button, Input, Textarea, ScrollArea, Badge } from '@/components/ui'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Trash2, Plus, Edit2, Save, ThumbsUp, ThumbsDown, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { useCreatePost, useDeletePost, useGetPosts, useUpdatePost } from '@/hooks'
import { type Post } from '@/types'

const tagColors = [
	'bg-red-100 text-red-800',
	'bg-blue-100 text-blue-800',
	'bg-green-100 text-green-800',
	'bg-yellow-100 text-yellow-800',
	'bg-purple-100 text-purple-800',
	'bg-pink-100 text-pink-800',
	'bg-indigo-100 text-indigo-800'
]

export default function Posts() {
	const [newPostTitle, setNewPostTitle] = useState('')
	const [newPostBody, setNewPostBody] = useState('')
	const [newPostTags, setNewPostTags] = useState('')
	const [_newPostImage, setNewPostImage] = useState<File | null>(null)
	const [editingPost, setEditingPost] = useState<Post | null>(null)
	const [deletePostId, setDeletePostId] = useState<number | null>(null)
	const { ref, inView } = useInView()

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useGetPosts()
	const addMutation = useCreatePost()
	const updateMutation = useUpdatePost()
	const deleteMutation = useDeletePost()

	if (inView && hasNextPage) {
		fetchNextPage()
	}

	const handleAddPost = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (newPostTitle.trim() && newPostBody.trim()) {
			addMutation.mutate({
				title: newPostTitle.trim(),
				body: newPostBody.trim(),
				userId: 1,
				tags: newPostTags
					.split(',')
					.map((tag) => tag.trim())
					.filter(Boolean),
				reactions: {
					likes: 0,
					dislikes: 0
				}
			})
		}
		setNewPostTitle('')
		setNewPostBody('')
		setNewPostTags('')
		setNewPostImage(null)
	}

	const handleUpdatePost = (post: Post) => {
		updateMutation.mutate({ ...post, tags: post.tags })
		setEditingPost(null)
	}

	const handleDeletePost = (id: number) => deleteMutation.mutate(id)

	return (
		<div className="container mx-auto py-8 px-4">
			<Card className="w-full shadow-lg">
				<CardHeader className="bg-primary text-primary-foreground">
					<CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<form onSubmit={handleAddPost} className="space-y-4">
						<Input
							type="text"
							value={newPostTitle}
							onChange={(e) => setNewPostTitle(e.target.value)}
							placeholder="Post title"
							className="w-full"
						/>
						<Textarea
							value={newPostBody}
							onChange={(e) => setNewPostBody(e.target.value)}
							placeholder="Post body"
							className="w-full min-h-[100px]"
						/>
						<Input
							type="text"
							value={newPostTags}
							onChange={(e) => setNewPostTags(e.target.value)}
							placeholder="Tags (comma-separated)"
							className="w-full"
						/>
						<div className="flex items-center space-x-2">
							<Input
								type="file"
								onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
								className="w-full"
								accept="image/*"
							/>
							<Button
								type="submit"
								disabled={addMutation.isPending}
								className="bg-primary text-primary-foreground"
							>
								{addMutation.isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<>
										<Plus className="h-4 w-4 mr-2" /> Add Post
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card className="w-full shadow-lg">
				<CardHeader className="bg-primary text-primary-foreground">
					<CardTitle className="text-2xl font-bold">Posts</CardTitle>
					<Badge variant="secondary" className="ml-2">
						{data?.pages.flatMap((page) => page.posts).length || 0} posts
					</Badge>
				</CardHeader>
				<CardContent className="p-6">
					<ScrollArea className="h-[600px]">
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
									{data.pages.flatMap((page) =>
										page.posts.map((post) => (
											<motion.div
												key={post.id}
												layout
												initial={{ opacity: 0, y: 50 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -50 }}
												transition={{ duration: 0.3 }}
											>
												<Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
													<CardHeader className="bg-secondary flex-shrink-0">
														<div className="relative h-48 w-full mb-4">
															<img
																src={post.imageUrl}
																alt={post.title}
																className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
															/>
														</div>
														<CardTitle className="text-lg font-semibold">
															{editingPost?.id === post.id ? (
																<Input
																	value={editingPost.title}
																	onChange={(e) =>
																		setEditingPost({
																			...editingPost,
																			title: e.target.value
																		})
																	}
																	className="font-semibold"
																/>
															) : (
																post.title
															)}
														</CardTitle>
														<div className="flex flex-wrap gap-2 mt-2">
															{post.tags.map((tag, index) => (
																<Badge
																	key={index}
																	className={`text-xs ${
																		tagColors[index % tagColors.length]
																	}`}
																>
																	{tag}
																</Badge>
															))}
														</div>
													</CardHeader>
													<CardContent className="p-4 flex-grow">
														{editingPost?.id === post.id ? (
															<>
																<Textarea
																	value={editingPost.body}
																	onChange={(e) =>
																		setEditingPost({
																			...editingPost,
																			body: e.target.value
																		})
																	}
																	className="min-h-[100px] mb-2"
																/>
																<Input
																	value={editingPost.tags.join(', ')}
																	onChange={(e) =>
																		setEditingPost({
																			...editingPost,
																			tags: e.target.value
																				.split(',')
																				.map((tag) => tag.trim())
																		})
																	}
																	placeholder="Tags (comma-separated)"
																	className="mt-2"
																/>
															</>
														) : (
															<p className="line-clamp-3">{post.body}</p>
														)}
													</CardContent>
													<CardFooter className="bg-muted flex justify-between items-center p-2 flex-shrink-0">
														<div className="flex items-center gap-4">
															<Badge
																variant="secondary"
																className="flex items-center gap-1"
															>
																<ThumbsUp className="h-4 w-4" />
																<span className="hidden sm:block">
																	{post.reactions.likes}
																</span>
															</Badge>
															<Badge
																variant="secondary"
																className="flex items-center gap-1"
															>
																<ThumbsDown className="h-4 w-4" />
																<span className="hidden sm:block">
																	{post.reactions.dislikes}
																</span>
															</Badge>
															<Badge
																variant="secondary"
																className="flex items-center gap-1"
															>
																<Eye className="h-4 w-4" />
																<span className="hidden sm:block">{post.views}</span>
															</Badge>
														</div>
														<div className="flex gap-2">
															{editingPost?.id === post.id ? (
																<Button
																	onClick={() => handleUpdatePost(editingPost)}
																	className="bg-primary text-primary-foreground"
																>
																	<Save className="h-4 w-4 sm:mr-2" />
																	<span className="hidden sm:block">Save</span>
																</Button>
															) : (
																<Button
																	variant="ghost"
																	onClick={() => setEditingPost(post)}
																	className="text-primary hover:text-primary hover:bg-primary/10"
																>
																	<Edit2 className="h-4 w-4 sm:mr-2" />
																	<span className="hidden sm:block">Edit</span>
																</Button>
															)}

															<Dialog>
																<DialogTrigger asChild>
																	<Button
																		variant="ghost"
																		className="text-destructive hover:text-destructive hover:bg-destructive/10"
																		onClick={() => setDeletePostId(post.id)}
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																</DialogTrigger>
																<DialogContent>
																	<DialogHeader>
																		<DialogTitle>
																			Are you sure you want to delete this post?
																		</DialogTitle>
																		<DialogDescription>
																			This action cannot be undone. This will
																			permanently delete the post.
																		</DialogDescription>
																	</DialogHeader>
																	<DialogFooter>
																		<DialogClose asChild>
																			<Button
																				variant="outline"
																				onClick={() => setDeletePostId(null)}
																			>
																				Cancel
																			</Button>
																		</DialogClose>
																		<Button
																			variant="destructive"
																			onClick={() =>
																				deletePostId &&
																				handleDeletePost(deletePostId)
																			}
																		>
																			Delete
																		</Button>
																	</DialogFooter>
																</DialogContent>
															</Dialog>
														</div>
													</CardFooter>
												</Card>
											</motion.div>
										))
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
