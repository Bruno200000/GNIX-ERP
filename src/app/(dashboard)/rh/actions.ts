'use server'

import { revalidatePath } from 'next/cache'
import {
  createEmployeeData,
  createLeaveData,
  getAttendanceData,
  getEmployeesData,
  getEvaluationsData,
  getLeavesData,
  type EmployeeRecord,
} from '@/lib/erp-data'

export type Employee = EmployeeRecord

export async function getEmployees() {
  return getEmployeesData()
}

export async function getAttendance() {
  return getAttendanceData()
}

export async function getLeaves() {
  return getLeavesData()
}

export async function getEvaluations() {
  return getEvaluationsData()
}

export async function addEmployee(formData: FormData) {
  await createEmployeeData(formData)
  revalidatePath('/rh')
  revalidatePath('/rh/attendance')
}

export async function requestLeave(formData: FormData) {
  await createLeaveData(formData)
  revalidatePath('/rh/leaves')
}
