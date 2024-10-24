// src/api/index.ts

import axios from 'axios'

// Define Todo type
interface Todo {
	id: number
	title: string
	completed?: boolean
}

// API base URL - replace with your actual API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com'

// Get all todos
export const getTodos = async (): Promise<Todo[]> => {
	const { data } = await axios.get(`${API_URL}/todos`)
	return data
}

// Add a new todo
export const postTodo = async (todo: Omit<Todo, 'completed'>): Promise<Todo> => {
	const { data } = await axios.post(`${API_URL}/todos`, {
		...todo,
		completed: false
	})
	return data
}

// Optional: You might also want these additional methods
export const updateTodo = async (todo: Todo): Promise<Todo> => {
	const { data } = await axios.put(`${API_URL}/todos/${todo.id}`, todo)
	return data
}

export const deleteTodo = async (id: number): Promise<void> => {
	await axios.delete(`${API_URL}/todos/${id}`)
}
