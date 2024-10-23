import { useState } from 'react'
import { reactLogo } from '@/assets'
import { Link } from 'react-router-dom'
import { Button, Card, ModeToggle } from '@/components/ui'
import '@/App.css'

const Vite = () => {
	const [count, setCount] = useState(0)

	return (
		<Card className="p-4">
			<div className="flex items-center justify-center gap-5">
				<Link to="https://vite.dev" target="_blank">
					<img src="./vite.svg" className="logo" alt="Vite logo" />
				</Link>
				<Link to="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</Link>
				<Link to="https://react.dev" target="_blank">
					<img src="https://query.gg/favicon.png" className="logo react" alt="React Query logo" />
				</Link>
			</div>
			<h1>Vite + React</h1>
			<h6 className="text-2xl border rounded-md p-2">{count}</h6>
			<Button type="button" onClick={() => setCount(count + 1)}>
				+
			</Button>
			<ModeToggle />
			<Button type="button" onClick={() => setCount(count - 1)}>
				-
			</Button>

			<p>
				Edit <code>src/App.tsx</code> and save to test HMR
			</p>

			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</Card>
	)
}

export default Vite
