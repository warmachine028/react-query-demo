import { BrowserRouter } from 'react-router-dom'
import { AppRouter, Navbar } from '@/components'
import { ThemeProvider } from '@/providers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const ReactQueryDemoApp = () => {
	return (
		<BrowserRouter>
			<Navbar />
			<AppRouter />
			<ReactQueryDevtools initialIsOpen={false} />
		</BrowserRouter>
	)
}

const App = () => {
	const queryClient = new QueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<ReactQueryDemoApp />
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
