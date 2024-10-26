import { Link } from 'react-router-dom'
import { Menu, User, Home } from 'lucide-react'
import { Button } from '@/components/ui'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const Sidebar = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon">
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-72">
				<nav className="flex flex-col space-y-4">
					<Link to="/" className="flex items-center py-2">
						<Home className="mr-2" />
						Home
					</Link>
					<Link to="/profile" className="flex items-center py-2">
						<User className="mr-2" />
						Profile
					</Link>
					<Link to="/settings" className="flex items-center py-2">
						Settings
					</Link>
				</nav>
			</SheetContent>
		</Sheet>
	)
}
export default Sidebar
