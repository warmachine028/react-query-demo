import { PostPage } from '@/types'
import { create } from 'zustand'

// Updated store configuration
interface StoreState {
	optimisticPages: PostPage[]
	setOptimisticPages: (pages: PostPage[]) => void
}

export const useStore = create<StoreState>()((set) => ({
	optimisticPages: [],
	setOptimisticPages: (pages: PostPage[]) => set({ optimisticPages: pages })
}))
