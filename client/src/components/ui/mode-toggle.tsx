import { Computer, Moon, Sun } from 'lucide-react'
import { Button } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { useTheme } from '@/hooks'

export const ModeToggle = ({ variant, className }: { variant?: 'default' | 'outline'; className?: string }) => {
	const { setTheme, theme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={variant} size="icon" className={className} title="Toggle theme">
					{theme === 'system' ? (
						<Computer />
					) : (
						<>
							<Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						</>
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-background/80 backdrop-blur-md" align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

ModeToggle.displayName = 'ModeToggle'
