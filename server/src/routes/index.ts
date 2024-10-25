import { Elysia, t } from 'elysia'
import { createPost, deletePost, getPost, getPosts, searchPosts, updatePost } from '@/controllers'

export const postRoutes = new Elysia({ prefix: '/posts' })
	.get('/', getPosts, {
		query: t.Object({
			skip: t.Optional(t.String()),
			limit: t.Optional(t.String())
		})
	})
	.get('/search', searchPosts, {
		query: t.Object({
			q: t.String()
		})
	})
	.get('/:id', getPost, {
		params: t.Object({
			id: t.Number()
		})
	})
	.post('/', createPost, {
		body: t.Object({
			title: t.String(),
			body: t.String(),
			tags: t.Array(t.String()),
			userId: t.Number(),
		})
	})
	.put('/:id', updatePost, {
		body: t.Object({
			title: t.String(),
			body: t.String(),
			tags: t.Array(t.String()),
			userId: t.Number()
		}),
		params: t.Object({
			id: t.Number()
		})
	})
	.delete('/:id', deletePost, {
		params: t.Object({
			id: t.Number()
		})
	})
