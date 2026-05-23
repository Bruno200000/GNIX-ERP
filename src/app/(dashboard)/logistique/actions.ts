'use server'

import { revalidatePath } from 'next/cache'
import {
  createDeliveryNoteData,
  createProductData,
  createStockEntryData,
  getDeliveryNotesData,
  getProductsData,
  getShipmentsData,
  getWarehousesData,
  type DeliveryItem,
  type InventoryRecord,
  type ProductRecord,
  type WarehouseRecord,
} from '@/lib/erp-data'

export type Product = ProductRecord & {
  inventory: (InventoryRecord & { warehouses: WarehouseRecord | null })[]
  totalStock: number
}

export type Warehouse = WarehouseRecord

export type StockEntry = {
  id: string
  product_id: string
  warehouse_id: string
  quantity: number
  type: 'in' | 'out'
  notes?: string
}

export async function getProducts() {
  return getProductsData()
}

export async function getWarehouses() {
  return getWarehousesData()
}

export async function getDeliveryNotes() {
  return getDeliveryNotesData()
}

export async function getShipments() {
  return getShipmentsData()
}

export async function addProduct(formData: FormData) {
  await createProductData(formData)
  revalidatePath('/logistique')
  revalidatePath('/logistique/warehouses')
}

export async function addStockEntry(formData: FormData) {
  await createStockEntryData(formData)
  revalidatePath('/logistique')
  revalidatePath('/logistique/warehouses')
}

export async function createDeliveryNote(formData: FormData, items: DeliveryItem[]) {
  await createDeliveryNoteData(formData, items)
  revalidatePath('/logistique/delivery-notes')
  revalidatePath('/logistique')
}
