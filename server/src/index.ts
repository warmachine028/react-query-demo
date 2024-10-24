import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { cron } from '@elysiajs/cron'
import { postRoutes } from '@/routes'

const port = Bun.env.PORT || 5000

new Elysia()
	.use(
		// Create a cron job to ping the server every 14 minutes
		cron({
			name: 'Ping Server',
			pattern: '*/14 * * * *',
			async run() {
				try {
					const response = await fetch('https://react-query-demoo.vercel.app')
					if (response.ok) {
						console.log('Server pinged successfully')
					} else {
						console.error('Failed to ping server:', response.status, response.statusText)
					}
				} catch (error) {
					console.error('Error pinging server:', error)
				}
			}
		})
	)
	.use(cors())
	.use(
		swagger({
			path: '/docs',
			documentation: {
				info: {
					title: 'React Query Demo Documentation',
					version: '1.0.0'
				}
			}
		})
	)
	.get('/favicon.ico', () => Bun.file('public/favicon.ico'))
	.get('/', () => '💾 Hello from React Query Demo server')
	.use(postRoutes)
	.listen(port, () => console.log(`🦊 Elysia is running at http://localhost:${port}`))
