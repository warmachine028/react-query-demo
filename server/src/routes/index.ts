import { Elysia, t } from 'elysia'
import { getPosts } from '@/controllers'

export const postRoutes = new Elysia({ prefix: '/posts' }).get('/', getPosts, {
	//
	query: t.Object({
		skip: t.Optional(t.String()),
		limit: t.Optional(t.Number())
	})
})
