import { BrowserRouter } from 'react-router'
import { AppRouter, Navbar } from '@/components'
import { ThemeProvider } from '@/providers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useHotkeys } from 'react-hotkeys-hook'
import { Search } from '@/components/ui'
import { useState } from 'react'

const ReactQueryDemoApp = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false)

	useHotkeys('ctrl+k', (event) => {
		event.preventDefault()
		setIsSearchOpen(true)
	})

	return (
		<BrowserRouter>
			<Navbar setIsSearchOpen={setIsSearchOpen} />
			{isSearchOpen && (
				<div className="bg-background/80 fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 backdrop-blur-sm">
					<div className="bg-popover w-full max-w-2xl rounded-lg p-4 shadow-lg">
						<Search
							type="search"
							placeholder="Search..."
							className="w-full"
							autoFocus
							onBlur={() => setIsSearchOpen(false)}
						/>
					</div>
				</div>
			)}
			<AppRouter />
			<ReactQueryDevtools />
		</BrowserRouter>
	)
}

const App = () => {
	const queryClient = new QueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
				<ReactQueryDemoApp />
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
