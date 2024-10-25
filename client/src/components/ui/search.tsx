import { Search as SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input, type InputProps } from './input'

const Search = ({ className, iconClassName, ...props }: { iconClassName?: string } & InputProps) => {
	return (
		<div className="relative w-full">
			<div className="absolute left-2 top-1/2 -translate-y-1/2 transform">
				<SearchIcon size={18} className={cn('text-muted-foreground', iconClassName)} />
			</div>
			<Input
				className={cn(
					'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-4 py-2 pl-8 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				{...props}
			/>
		</div>
	)
}
Search.displayName = 'Search'

export { Search }
