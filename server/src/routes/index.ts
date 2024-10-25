import { Elysia, t } from 'elysia'
import { createPost, getPosts, updatePost } from '@/controllers'

export const postRoutes = new Elysia({ prefix: '/posts' })
	//
	.get('/', getPosts, {
		query: t.Object({
			skip: t.Optional(t.String()),
			limit: t.Optional(t.String())
		})
	})
	.post('/', createPost, {
		body: t.Object({
			title: t.String(),
			body: t.String(),
			userId: t.Number(),
			tags: t.Array(t.String())
		})
	})
	.put('/:id', updatePost, {
		body: t.Object({
			title: t.String(),
			body: t.String(),
			tags: t.Array(t.String()),
			userId: t.Number()
		})
	})
