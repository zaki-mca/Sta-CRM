export interface OrderItem {
  id: string
  product: {
    id: string
    name: string
    description: string
    sellPrice: number
  }
  quantity: number
  unitPrice: number
  total: number
}

export interface Order {
  id: string
  client: {
    id: string
    name: string
    email: string
    address: string
    phoneNumber: string
  }
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: Date
  expectedDelivery: Date
  notes?: string
}

export interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "orderDate">) => void
  updateOrder: (id: string, order: Omit<Order, "id" | "orderDate">) => void
  deleteOrder: (id: string) => void
  updateOrderStatus: (id: string, status: Order["status"]) => void
}
