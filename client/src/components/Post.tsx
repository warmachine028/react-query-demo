import { useState } from 'react'
import { Button, AspectRatio, Input, Textarea, Badge } from '@/components/ui'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit2, Save, ThumbsUp, ThumbsDown, Eye } from 'lucide-react'
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

export default function Post({ post }: { post: PostType }) {
	const [isEditing, setIsEditing] = useState(false)
	const [editedPost, setEditedPost] = useState(post)

	const updateMutation = useUpdatePost()
	const deleteMutation = useDeletePost()
	const reactionMutation = useUpdateReaction()

	const handleUpdatePost = (post: PostType) => updateMutation.mutate(post)
	const handleDeletePost = (id: number) => deleteMutation.mutate(id)

	const handleReaction = (type: 'like' | 'dislike') => reactionMutation.mutate({ postId: post.id, type })

	const handleSave = () => {
		handleUpdatePost(editedPost)
		setIsEditing(false)
		setEditedPost(post)
	}

	const truncateDescription = (text: string, wordLimit: number) => {
		const words = text.split(' ')
		if (words.length > wordLimit) {
			return words.slice(0, wordLimit).join(' ') + '...'
		}
		return text
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="relative h-full overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
				<CardHeader className="p-0">
					<div className="relative">
						<AspectRatio ratio={16 / 9}>
							<img src={post.imageUrl} alt={post.title} className="h-44 w-full object-cover" />
						</AspectRatio>
						<div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-white">
							<Eye className="h-4 w-4" />
							<span className="text-sm font-medium">{post.views}</span>
						</div>
					</div>
				</CardHeader>
				<CardContent className="mb-16">
					<CardTitle className="mb-2 text-xl font-bold">
						{isEditing ? (
							<Input
								value={editedPost.title}
								onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
								className="text-xl font-bold"
							/>
						) : (
							post.title
						)}
					</CardTitle>
					<div className="mb-4 flex flex-wrap gap-2">
						{post.tags.map((tag, index) => (
							<Badge key={index} className={`text-xs ${tagColors[index % tagColors.length]}`}>
								{tag}
							</Badge>
						))}
					</div>
					{isEditing ? (
						<>
							<Textarea
								value={editedPost.body}
								onChange={(e) => setEditedPost({ ...editedPost, body: e.target.value })}
								className="mb-2 min-h-[100px]"
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
						<p className="text-muted-foreground">{truncateDescription(post.body, 20)}</p>
					)}
				</CardContent>
				<CardFooter className="bg-muted absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
							onClick={() => handleReaction('like')}
						>
							<ThumbsUp className="h-4 w-4" />
							<span>{post.reactions.likes}</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
							onClick={() => handleReaction('dislike')}
						>
							<ThumbsDown className="h-4 w-4" />
							<span>{post.reactions.dislikes}</span>
						</Button>
					</div>
					<div className="flex gap-2">
						<AnimatePresence mode="wait">
							{isEditing ? (
								<motion.div
									key="save"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ duration: 0.2 }}
								>
									<Button onClick={handleSave} size="sm">
										<Save className="mr-2 h-4 w-4" />
										Save
									</Button>
								</motion.div>
							) : (
								<motion.div
									key="edit"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ duration: 0.2 }}
								>
									<Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
										<Edit2 className="mr-2 h-4 w-4" />
										Edit
									</Button>
								</motion.div>
							)}
						</AnimatePresence>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm" className="text-destructive">
									<Trash2 className="h-4 w-4" />
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
