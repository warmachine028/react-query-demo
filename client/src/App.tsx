import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/components'
import { ThemeProvider } from '@/providers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const ReactQueryDemoApp = () => {
	return (
		<BrowserRouter>
			<AppRouter />
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
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default App
