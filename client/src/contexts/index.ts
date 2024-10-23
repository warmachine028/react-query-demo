import { createContext } from 'react'
import { ThemeContextState } from '@/types'

const initialState: ThemeContextState = {
	theme: 'system',
	setTheme: () => null
}

export const ThemeContext = createContext<ThemeContextState>(initialState)
