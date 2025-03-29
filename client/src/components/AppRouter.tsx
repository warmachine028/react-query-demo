import { Link, Route, Routes, useLocation } from 'react-router'
import { Posts, Todos, Vite } from '@/pages'
import { Button } from '@/components/ui'

const AppRouter = () => {
	const location = useLocation()
	return (
		<Routes location={location}>
			<Route path="/vite" element={<Vite />} />
			<Route
				path="/"
				element={
					<div className="container mx-auto gap-5">
						<div className="flex h-screen items-center justify-center space-x-2">
							<Button asChild>
								<Link to="/todos">Todos</Link>
							</Button>
							<Button asChild>
								<Link to="/posts">Posts</Link>
							</Button>
						</div>
					</div>
				}
			/>
			<Route path="/todos" element={<Todos />} />
			<Route path="/posts" element={<Posts />} />
		</Routes>
	)
}
export default AppRouter
