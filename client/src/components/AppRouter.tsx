import { Link, Route, Routes, useLocation } from 'react-router-dom'
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
					<div className="flex gap-5">
						<Button asChild>
							<Link to="/todos">Todos</Link>
						</Button>
						<Button asChild>
							<Link to="/posts">Posts</Link>
						</Button>
					</div>
				}
			/>
			<Route path="/todos" element={<Todos />} />
			<Route path="/posts" element={<Posts />} />
		</Routes>
	)
}
export default AppRouter
