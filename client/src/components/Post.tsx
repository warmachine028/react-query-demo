import { useState } from 'react'
import { Button, Input, Textarea, Badge } from '@/components/ui'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit2, Save, ThumbsUp, ThumbsDown, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
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
import { useDeletePost, useUpdatePost, useUpdateReaction } from '@/hooks'
import type { Post as PostType } from '@/types'

const tagColors = [
	'bg-red-100 text-red-800',
	'bg-blue-100 text-blue-800',
	'bg-green-100 text-green-800',
	'bg-yellow-100 text-yellow-800',
	'bg-purple-100 text-purple-800',
	'bg-pink-100 text-pink-800',
	'bg-indigo-100 text-indigo-800'
]

const Post = ({ post }: { post: PostType }) => {
	const [isEditing, setIsEditing] = useState(false)
	const [editedPost, setEditedPost] = useState(post)

	const updateMutation = useUpdatePost()
	const deleteMutation = useDeletePost()
	const reactionMutation = useUpdateReaction()

	const handleUpdatePost = (post: PostType) => updateMutation.mutate({ ...post, tags: post.tags })
	const handleDeletePost = (id: number) => deleteMutation.mutate(id)

	const handleReaction = (type: 'like' | 'dislike') => reactionMutation.mutate({ postId: post.id, type })

	const handleSave = () => {
		handleUpdatePost(editedPost)
		setIsEditing(false)
		setEditedPost(post)
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300" title={post.title}>
				<CardHeader className="bg-secondary flex-shrink-0">
					<div className="relative h-48 w-full mb-4">
						<img
							src={post.imageUrl}
							alt={post.title}
							className="absolute  w-full h-full object-cover rounded-lg"
						/>
					</div>
					<CardTitle className="text-lg font-semibold">
						{isEditing ? (
							<Input
								value={editedPost.title}
								onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
								className="font-semibold"
							/>
						) : (
							post.title
						)}
					</CardTitle>
					<div className="flex flex-wrap gap-2 mt-2">
						{post.tags.map((tag, index) => (
							<Badge key={index} className={`text-xs ${tagColors[index % tagColors.length]}`}>
								{tag}
							</Badge>
						))}
					</div>
				</CardHeader>
				<CardContent className="p-4 flex-grow">
					{isEditing ? (
						<>
							<Textarea
								value={editedPost.body}
								onChange={(e) => setEditedPost({ ...editedPost, body: e.target.value })}
								className="min-h-[100px] mb-2"
							/>
							<Input
								value={editedPost.tags.join(', ')}
								onChange={(e) =>
									setEditedPost({
										...editedPost,
										tags: e.target.value.split(',').map((tag) => tag.trim())
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
					<div className="flex items-center space-x-1">
						<Button
							variant="secondary"
							className="flex items-center gap-1"
							onClick={() => handleReaction('like')}
							title='Like'
						>
							<ThumbsUp className="h-4 w-4" />
							<span className="hidden xl:block">{post.reactions.likes}</span>
						</Button>
						<Button
							variant="secondary"
							className="flex items-center gap-1"
							onClick={() => handleReaction('dislike')}
							title="Dislike"
						>
							<ThumbsDown className="h-4 w-4" />
							<span className="hidden xl:block">{post.reactions.dislikes}</span>
						</Button>
						<Badge variant="secondary" className="flex items-center gap-1" title="Views">
							<Eye className="h-4 w-4" />
							<span className="hidden xl:block">{post.views}</span>
						</Badge>
					</div>
					<div className="flex gap-2">
						{isEditing ? (
							<Button onClick={handleSave} className="bg-primary text-primary-foreground" title="Save">
								<Save className="h-4 w-4 sm:mr-2" />
								<span className="hidden sm:block">Save</span>
							</Button>
						) : (
							<Button
								variant="ghost"
								onClick={() => setIsEditing(true)}
								className="text-primary hover:text-primary hover:bg-primary/10"
								title="Edit"
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
									title="Delete"
								>
									<Trash2 className="size-4" />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Are you sure you want to delete this post?</DialogTitle>
									<DialogDescription>
										This action cannot be undone. This will permanently delete the post.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button variant="destructive" onClick={() => handleDeletePost(post.id)}>
										Delete
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardFooter>
			</Card>
		</motion.div>
	)
}

export default Post
