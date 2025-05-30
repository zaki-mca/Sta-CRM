"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Order, OrderContextType } from "@/lib/order-types"

const OrderContext = createContext<OrderContextType | undefined>(undefined)

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    client: {
      id: "1",
      name: "ABC Corporation",
      email: "contact@abccorp.com",
      address: "789 Business Blvd, Corporate City, TX 75001",
      phoneNumber: "+1 (555) 234-5678",
    },
    items: [
      {
        id: "1",
        product: {
          id: "1",
          name: 'MacBook Pro 16"',
          description: "High-performance laptop with M3 Pro chip",
          sellPrice: 2499.99,
        },
        quantity: 1,
        unitPrice: 2499.99,
        total: 2499.99,
      },
    ],
    subtotal: 2499.99,
    tax: 249.99,
    total: 2749.98,
    status: "confirmed",
    orderDate: new Date("2024-03-01"),
    expectedDelivery: new Date("2024-03-15"),
    notes: "Rush order for corporate client",
  },
  {
    id: "ORD-002",
    client: {
      id: "2",
      name: "XYZ Enterprises",
      email: "info@xyzenterprises.com",
      address: "321 Enterprise Way, Commerce Town, FL 33101",
      phoneNumber: "+1 (555) 876-5432",
    },
    items: [
      {
        id: "1",
        product: {
          id: "2",
          name: "Samsung Galaxy S24",
          description: "Latest flagship smartphone",
          sellPrice: 899.99,
        },
        quantity: 2,
        unitPrice: 899.99,
        total: 1799.98,
      },
    ],
    subtotal: 1799.98,
    tax: 179.99,
    total: 1979.97,
    status: "processing",
    orderDate: new Date("2024-03-05"),
    expectedDelivery: new Date("2024-03-20"),
  },
]

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const addOrder = (orderData: Omit<Order, "id" | "orderDate">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      orderDate: new Date(),
    }
    setOrders((prev) => [...prev, newOrder])
  }

  const updateOrder = (id: string, orderData: Omit<Order, "id" | "orderDate">) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...orderData, orderDate: order.orderDate } : order)),
    )
  }

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
