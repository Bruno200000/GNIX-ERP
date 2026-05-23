'use server'

import { revalidatePath } from 'next/cache'
import {
  createMeetingData,
  createProjectData,
  createTaskData,
  getMeetingsData,
  getProjectsData,
  getTasksData,
  type ProjectRecord,
  type TaskRecord,
} from '@/lib/erp-data'

export type Task = TaskRecord

export type Project = ProjectRecord & {
  tasks: Task[]
}

export async function getProjects() {
  return getProjectsData()
}

export async function getTasks() {
  return getTasksData()
}

export async function getMeetings() {
  return getMeetingsData()
}

export async function addProject(formData: FormData) {
  await createProjectData(formData)
  revalidatePath('/projets')
  revalidatePath('/projets/tasks')
}

export async function addTask(formData: FormData) {
  await createTaskData(formData)
  revalidatePath('/projets')
  revalidatePath('/projets/tasks')
}

export async function addMeeting(formData: FormData) {
  await createMeetingData(formData)
  revalidatePath('/projets/meetings')
}
