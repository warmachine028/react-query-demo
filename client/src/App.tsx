import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/components'
import { ThemeProvider } from '@/providers'

const App = () => {
	return (
		<BrowserRouter>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<AppRouter />
			</ThemeProvider>
		</BrowserRouter>
	)
}

export default App
