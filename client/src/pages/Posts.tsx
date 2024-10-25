import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button, ScrollArea, Badge, Search } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, RefreshCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetPosts, useRefresh, useSearch } from '@/hooks'
import { Post } from '@/components'
import { useStore } from '@/store'
import { CreatePost } from '@/components'

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
		<Card className="border-0 shadow-lg sm:border">
			<CardHeader className="bg-primary text-primary-foreground">
				<div className="flex flex-col items-center justify-between gap-2 xl:flex-row">
					<div>
						<CardTitle className="text-center text-2xl font-bold">Posts</CardTitle>
						<Badge variant="secondary" title="Posts loaded">
							{allPosts.length} posts
						</Badge>
					</div>
					<div className="flex space-x-2">
						<Search
							type="text"
							placeholder="Search posts..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="text-foreground w-72"
						/>
						<Button
							variant="outline"
							onClick={refresh}
							disabled={refreshing}
							title={refreshing ? 'Refreshing' : 'Refresh'}
							size="icon"
							className="bg-primary"
						>
							<RefreshCcw className={`${refreshing && 'animate-spin'}`} />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-6">
				<ScrollArea className="h-[calc(100vh-22rem)]">
					{status === 'pending' ? (
						<div className="flex h-full items-center justify-center">
							<Loader2 className="text-primary size-8 animate-spin" />
						</div>
					) : status === 'error' ? (
						<p className="text-destructive text-center">Error fetching posts</p>
					) : (
						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="grid auto-rows-max grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-3"
							>
								{results.map((post) => (
									<Post key={post.id} post={post} />
								))}
								{!results && (
									<h6 className="text-center text-2xl font-bold">
										{query ? `No results found for "${query}"` : 'No posts found'}
									</h6>
								)}
							</motion.div>
						</AnimatePresence>
					)}
					{isFetchingNextPage && (
						<div className="mt-4 flex justify-center">
							<Loader2 className="text-primary size-6 animate-spin" />
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
		<div className="container mx-auto mt-5 space-y-6">
			<div className="grid h-screen grid-cols-1 gap-6 md:grid-cols-4">
				<div className="md:col-span-2 xl:col-span-3">
					<PostsCard />
				</div>
				<div className="md:col-span-2 xl:col-span-1">
					<CreatePost />
				</div>
			</div>
		</div>
	)
}

export default Posts
