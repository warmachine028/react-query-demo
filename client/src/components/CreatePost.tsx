import { useRef, useState } from 'react'
import { Button, Input, Textarea } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ListRestart, Plus } from 'lucide-react'
import { useCreatePost } from '@/hooks'

const CreatePost = () => {
	const initialData = {
		title: '',
		body: '',
		tags: '',
		image: null as File | null
	}
	const [post, setPost] = useState(initialData)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [error, setError] = useState('')
	const addMutation = useCreatePost()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, files } = e.target as HTMLInputElement

		if (name === 'image') {
			setPost({ ...post, image: files?.[0] || null })
		} else if (name === 'tags') {
			setPost({
				...post,
				tags: value
					.split(',')
					.map((tag) => tag.trim())
					.join(', ')
			})
		} else {
			setPost({ ...post, [name]: value })
		}
	}
	const validate = () => post.title.trim() && post.body.trim() && post.tags.trim() && post.image

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		if (!validate()) {
			setError('Please fill in all fields and upload an image')
			return setTimeout(() => setError(''), 5000)
		}
		addMutation.mutate({
			title: post.title.trim(),
			body: post.body.trim(),
			userId: 1,
			imageUrl: URL.createObjectURL(post.image as File),
			tags: post.tags
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean),
			reactions: {
				likes: 0,
				dislikes: 0
			}
		})
		handleReset()
	}
	const handleReset = () => {
		setPost(initialData)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle>Create New Post</CardTitle>
				<CardDescription className="text-destructive h-5 text-center">{error}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4" onReset={handleReset}>
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
						className="min-h-24 w-full"
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
						<Button type="reset" className="*:size-4" size="icon" title="reset">
							<ListRestart />
						</Button>
					</div>

					<Button type="submit" className="w-full *:mr-2 *:size-4">
						<Plus />
						Add Post
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}

export default CreatePost
