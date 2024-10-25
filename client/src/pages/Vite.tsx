import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button, Separator, ModeToggle } from '@/components/ui'
import { Link } from 'react-router-dom'
import { House } from 'lucide-react'
import { create } from 'zustand'

const logos = [
	{ name: 'Vite', url: 'https://vite.dev', src: '/vite.svg' },
	{ name: 'React Query', url: 'https://tanstack.com/query', src: 'https://query.gg/favicon.png' },
	{ name: 'Zustand', url: 'https://zustand-demo.pmnd.rs', src: 'https://zustand-demo.pmnd.rs/favicon.ico' },
	{ name: 'shadcn/ui', url: 'https://ui.shadcn.com', src: 'https://ui.shadcn.com/favicon.ico' },
	{ name: 'React', url: 'https://react.dev', src: 'https://react.dev/favicon.ico' },
	{ name: 'Axios', url: 'https://axios-http.com', src: 'https://axios-http.com/assets/favicon.ico' },
	{ name: 'Tailwind CSS', url: 'https://tailwindcss.com', src: 'https://tailwindcss.com/favicons/favicon.ico' },
	{ name: 'Lucide Icons', url: 'https://lucide.dev', src: 'https://lucide.dev/favicon.ico' },
	{ name: 'TypeScript', url: 'https://www.typescriptlang.org', src: 'https://www.typescriptlang.org/favicon.ico' }
]

type Store = {
	count: number
	inc: () => void
	dec: () => void
}

const useStore = create<Store>()((set) => ({
	count: 1,
	inc: () => set((state) => ({ count: state.count + 1 })),
	dec: () => set((state) => ({ count: state.count - 1 }))
}))

const TechStack = () => {
	const { count, inc, dec } = useStore()

	return (
		<div className="container mx-auto">
			<Card className="mx-auto w-full max-w-3xl">
				<CardHeader>
					<CardTitle className="text-center text-3xl font-bold">Tech Stack</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-6 grid grid-cols-3 gap-6">
						{logos.map((logo) => (
							<Link
								key={logo.name}
								to={logo.url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:bg-accent text-foreground flex flex-col items-center justify-center rounded-lg p-4 transition-all duration-300 hover:shadow-md"
							>
								<img src={logo.src} alt={`${logo.name} logo`} className="mb-2 h-12 w-12" />
								<span className="text-sm font-medium">{logo.name}</span>
							</Link>
						))}
					</div>
					<Separator className="my-6" />
					<div className="flex flex-col items-center space-y-4">
						<div className="text-4xl font-bold">{count}</div>
						<div className="grid grid-cols-2 gap-2">
							<Button variant="outline" size="icon" onClick={dec}>
								-
							</Button>
							<Button variant="outline" size="icon" onClick={inc}>
								+
							</Button>
							<Button asChild size="icon">
								<Link to="/">
									<House />
								</Link>
							</Button>
							<ModeToggle />
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex items-center justify-between">
					<p className="text-muted-foreground text-sm">
						Edit <code>src/TechStack.tsx</code> and save to test HMR
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}

export default TechStack
