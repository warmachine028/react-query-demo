import { Route, Routes, useLocation } from 'react-router-dom'
import { Vite } from '@/pages'

const AppRouter = () => {
	const location = useLocation()
	return (
		<Routes location={location}>
			<Route path="/vite" element={<Vite />} />
		</Routes>
	)
}
export default AppRouter
