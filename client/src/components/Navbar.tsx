import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { Menu, Search, User, Home } from 'lucide-react'
import { Button, Input, ModeToggle } from '@/components/ui'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const AccountMenu = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" title="User menu">
					<User />
					<span className="sr-only">User menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-background/80 backdrop-blur-md" align="end">
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Settings</DropdownMenuItem>
				<DropdownMenuItem>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const MobileMenu = () => {
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

const Navbar = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false)

	useHotkeys('ctrl+k', (event) => {
		event.preventDefault()
		setIsSearchOpen(true)
	})

	return (
		<nav className="bg-background/80 sticky top-0 z-50 w-full border border-b backdrop-blur-md">
			<div className="container mx-auto">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<Link to="/" className="text-foreground flex items-center text-xl font-bold">
							<img
								src="https://query.gg/favicon.png"
								alt="Brand"
								className="mr-2 size-7 animate-spin [animation-duration:10s]"
							/>
							<span>React Query Demo</span>
						</Link>
					</div>

					<div className="hidden items-center space-x-4 sm:flex">
						<Input
							type="search"
							placeholder="Search (Ctrl + K)"
							className="w-64"
							onClick={() => setIsSearchOpen(true)}
						/>
						<ModeToggle />
						<AccountMenu />
					</div>

					<div className="flex items-center space-x-2 sm:hidden">
						<Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
							<Search className="h-5 w-5" />
						</Button>
						<ModeToggle />
						<MobileMenu />
					</div>
				</div>
			</div>

			{isSearchOpen && (
				<div className="bg-background/80 fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 backdrop-blur-sm">
					<div className="bg-popover w-full max-w-2xl rounded-lg p-4 shadow-lg">
						<Input
							type="search"
							placeholder="Search..."
							className="w-full"
							autoFocus
							onBlur={() => setIsSearchOpen(false)}
						/>
					</div>
				</div>
			)}
		</nav>
	)
}

export default Navbar
