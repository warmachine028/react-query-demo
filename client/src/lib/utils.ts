import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const handleApiError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		const message = error.response?.data?.message || error.message
		console.error('API Error:', {
			status: error.response?.status,
			message,
			details: error.response?.data
		})
		throw new Error(`API Error: ${message}`)
	}
	console.error('Unexpected error:', error)
	throw error
}
