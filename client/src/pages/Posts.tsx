import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button, ScrollArea, Badge, Search, ModeToggle } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { House, Loader2, RefreshCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetPosts, useRefresh, useSearch } from '@/hooks'
import { Post } from '@/components'
import { useStore } from '@/store'
import { CreatePost } from '@/components'
import { Link } from 'react-router-dom'

const PostsCard = () => {
	const { ref, inView } = useInView()
	const { optimisticPages } = useStore()
	const { fetchNextPage, hasNextPage, isFetchingNextPage, status } = useGetPosts()
	const { refresh, refreshing } = useRefresh()

	const allPosts = optimisticPages.flatMap((page) => page.posts)
	const { query, setQuery, results } = useSearch(allPosts)

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, query, fetchNextPage])
	return (
		<Card className="shadow-lg">
			<CardHeader className="bg-primary text-primary-foreground sticky top-0 z-10">
				<div className="flex items-center justify-between">
					<CardTitle className="text-2xl font-bold">Posts</CardTitle>
					<div className="space-x-2 *:bg-primary">
						<Button asChild variant="outline" size="icon" title="Home">
							<Link to="/" className="text-inherit">
								<House />
							</Link>
						</Button>
						<ModeToggle variant="outline" />
						<Button
							variant="outline"
							onClick={refresh}
							disabled={refreshing}
							title={refreshing ? 'Refreshing' : 'Refresh'}
							size="icon"
						>
							<RefreshCcw className={`${refreshing && 'animate-spin'}`} />
						</Button>
					</div>
				</div>
				<Badge variant="secondary" className="max-w-fit" title="Posts loaded">
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
	)
}

const Posts = () => {
	return (
		<div className="container mx-auto space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2">
					<PostsCard />
				</div>
				<div className="md:col-span-1">
					<CreatePost />
				</div>
			</div>
		</div>
	)
}

export default Posts
