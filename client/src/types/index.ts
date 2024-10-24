import { ReactNode } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export type ThemeProviderProps = {
	children: ReactNode
	defaultTheme?: Theme
	storageKey?: string
}

export type ThemeContextState = {
	theme: Theme
	setTheme: (theme: Theme) => void
}

export interface Post {
	id: number
	title: string
	body: string
	userId: number
	imageUrl: string
	tags: string[]
	reactions: {
		likes: number
		dislikes: number
	}
	views: number
}

export interface PostPage {
	posts: Post[]
	nextCursor?: number
}

export interface PostsResponse {
	posts: Post[]
	total: number
	skip: number
	limit: number
}
