import { User } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const AccountMenu = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar asChild className="rounded-md p-0">
					<Button variant="ghost" size="icon" title="User menu">
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback className="rounded-md">
							<User />
						</AvatarFallback>
						<span className="sr-only">User menu</span>
					</Button>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-background/80 backdrop-blur-md" align="end">
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Settings</DropdownMenuItem>
				<DropdownMenuItem>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default AccountMenu
