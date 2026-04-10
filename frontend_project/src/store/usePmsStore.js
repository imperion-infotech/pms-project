import { create } from 'zustand'

/**
 * usePmsStore - Industrial State Management
 *
 * Zustand ka use hum poore project ke global state (Status, Data, etc.)
 * ko manage karne ke liye kar rahe hain. Yeh Redux se fast hai aur
 * performance mein behtar hai.
 */
const usePmsStore = create((set) => ({
  // Global Data
  rooms: [],
  roomStatuses: [],
  buildings: [],
  floors: [],
  roomTypes: [],

  // App States
  isLoading: false,
  error: null,

  // Actions (Mutators)
  setRooms: (rooms) => set({ rooms }),
  setRoomStatuses: (statuses) => set({ roomStatuses: statuses }),
  setMetadata: (data) =>
    set({
      buildings: data.buildings || [],
      floors: data.floors || [],
      roomTypes: data.roomTypes || [],
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))

export default usePmsStore
