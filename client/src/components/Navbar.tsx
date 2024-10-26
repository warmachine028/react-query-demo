import { Link } from 'react-router-dom'
import { Avatar, Button, ModeToggle, Search, Separator } from '@/components/ui'
import { AccountMenu, Sidebar } from '@/components'
import { AvatarFallback } from './ui/avatar'
import { IconBrandGithub } from '@tabler/icons-react'

const Navbar = ({ setIsSearchOpen }: { setIsSearchOpen: (value: boolean) => void }) => {
	return (
		<nav className="bg-background/80 sticky top-0 z-50 w-full border border-b backdrop-blur-md">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<Link to="/" className="text-foreground flex items-center text-xl font-bold">
							<img
								src="https://query.gg/favicon.png"
								alt="Brand"
								className="mr-2 size-7 animate-spin [animation-duration:10s]"
							/>
							<span className="hidden sm:block">React Query Demo</span>
						</Link>
					</div>
					<div className="hidden items-center space-x-4 sm:flex">
						<div className="relative">
							<Search
								type="search"
								placeholder="Search Posts..."
								className="w-64"
								onClick={() => setIsSearchOpen(true)}
							/>
							<kbd className="bg-muted absolute right-2 top-1/2 -translate-y-1/2 transform rounded border px-1.5 font-mono font-medium">
								<span className="text-xs">⌘</span>K
							</kbd>
						</div>
						<ModeToggle />
						<AccountMenu />
						<Separator orientation="vertical" className="h-10" />
						<Avatar asChild className="rounded-md p-0">
							<Button variant="ghost" size="icon" title="github" asChild>
								<Link
									to="https://github.com/warmachine028/react-query-demo"
									className="text-inherit"
									target="_blank"
									rel="noopener noreferrer"
								>
									<AvatarFallback className="rounded-md">
										<IconBrandGithub />
									</AvatarFallback>
								</Link>
							</Button>
						</Avatar>
					</div>

					<div className="flex items-center space-x-2 sm:hidden">
						<Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
							<Search className="h-5 w-5" />
						</Button>
						<ModeToggle />
						<Sidebar />
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
