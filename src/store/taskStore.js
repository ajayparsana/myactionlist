import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      set({ tasks: data || [] })
    } catch (err) {
      set({ error: err.message })
      console.error('Error fetching tasks:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  createTask: async (taskData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      set(state => ({
        tasks: [...state.tasks, data[0]]
      }))
      return data[0]
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

      if (error) throw error
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? data[0] : t)
      }))
      return data[0]
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  deleteTask: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      set(state => ({
        tasks: state.tasks.filter(t => t.id !== id)
      }))
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  toggleComplete: async (task) => {
    const newStatus = task.status === 'done' ? 'pending' : 'done'
    return get().updateTask(task.id, { status: newStatus })
  },

  updateQuadrant: async (taskId, quadrant) => {
    return get().updateTask(taskId, { quadrant })
  },

  reorderTasks: async (tasks) => {
    try {
      for (let i = 0; i < tasks.length; i++) {
        await supabase
          .from('tasks')
          .update({ order_index: i })
          .eq('id', tasks[i].id)
      }
      set({ tasks })
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  incrementPomodoro: async (taskId) => {
    const task = get().tasks.find(t => t.id === taskId)
    if (!task) return

    return get().updateTask(taskId, {
      pomodoro_count: (task.pomodoro_count || 0) + 1
    })
  },
}))
