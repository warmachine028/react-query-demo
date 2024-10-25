import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTodos, postTodo, updateTodo, deleteTodo } from '@/api'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button, Input, Checkbox, ScrollArea, Badge } from '@/components/ui'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Trash2, Plus } from 'lucide-react'

interface Todo {
	id: number
	title: string
	completed?: boolean
}

export default function Todos() {
	const queryClient = useQueryClient()
	const [newTodoTitle, setNewTodoTitle] = useState('')
	const { ref, inView } = useInView()

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: ['todos'],
		queryFn: async ({ pageParam = 1 }) => {
			const allTodos = await getTodos()
			const start = (pageParam - 1) * 10
			const end = start + 10
			return {
				todos: allTodos.slice(start, end),
				nextCursor: end < allTodos.length ? pageParam + 1 : undefined
			}
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		initialPageParam: 1
	})

	const addMutation = useMutation({
		mutationFn: postTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] })
			setNewTodoTitle('')
		}
	})

	const updateMutation = useMutation({
		mutationFn: updateTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] })
		}
	})

	const deleteMutation = useMutation({
		mutationFn: deleteTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] })
		}
	})

	if (inView && hasNextPage) {
		fetchNextPage()
	}

	const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (newTodoTitle.trim()) {
			addMutation.mutate({
				id: Date.now(),
				title: newTodoTitle.trim()
			})
		}
	}

	const handleToggleTodo = (todo: Todo) => {
		updateMutation.mutate({
			...todo,
			completed: !todo.completed
		})
	}

	const handleDeleteTodo = (id: number) => {
		deleteMutation.mutate(id)
	}

	return (
		<div className="container mx-auto">
			<Card className="w-full shadow-lg">
				<CardHeader className="bg-primary text-primary-foreground">
					<CardTitle className="text-2xl font-bold">Todo List</CardTitle>
					<Badge variant="secondary" className="ml-2">
						{data?.pages.flatMap((page) => page.todos).length || 0} tasks
					</Badge>
				</CardHeader>
				<CardContent className="p-6">
					<ScrollArea className="h-[400px] pr-4">
						{status === 'pending' ? (
							<div className="flex h-full items-center justify-center">
								<Loader2 className="text-primary size-8 animate-spin" />
							</div>
						) : status === 'error' ? (
							<p className="text-destructive text-center">Error fetching todos</p>
						) : (
							<ul className="space-y-3">
								{data.pages.map((page, i) => (
									<ul key={i} className="space-y-3">
										{page.todos.map((todo) => (
											<li
												key={todo.id}
												className="bg-muted flex items-center justify-between rounded-lg p-3 transition-all duration-200 hover:shadow-md"
											>
												<div className="flex flex-grow items-center space-x-3">
													<Checkbox
														id={`todo-${todo.id}`}
														checked={todo.completed}
														onCheckedChange={() => handleToggleTodo(todo)}
														className="border-primary"
													/>
													<label
														htmlFor={`todo-${todo.id}`}
														className={`flex-grow cursor-pointer ${
															todo.completed ? 'text-muted-foreground line-through' : ''
														}`}
													>
														{todo.title}
													</label>
												</div>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteTodo(todo.id)}
													className="text-destructive hover:text-destructive hover:bg-destructive/10"
												>
													<Trash2 className="size-4" />
												</Button>
											</li>
										))}
									</ul>
								))}
							</ul>
						)}
						{isFetchingNextPage && (
							<div className="mt-4 flex justify-center">
								<Loader2 className="text-primary size-6 animate-spin" />
							</div>
						)}
						<div ref={ref} className="h-1" />
					</ScrollArea>
				</CardContent>
				<CardFooter className="bg-muted p-4">
					<form onSubmit={handleAddTodo} className="flex w-full space-x-2">
						<Input
							type="text"
							value={newTodoTitle}
							onChange={(e) => setNewTodoTitle(e.target.value)}
							placeholder="Add a new todo"
							className="flex-grow"
						/>
						<Button
							type="submit"
							disabled={addMutation.isPending}
							className="bg-primary text-primary-foreground *:mr-2 *:size-4"
							size="icon"
						>
							{addMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
							Add
						</Button>
					</form>
				</CardFooter>
			</Card>
		</div>
	)
}
