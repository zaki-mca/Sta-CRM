import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CRMProvider } from "@/contexts/crm-context"
import { OrderProvider } from "@/contexts/order-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CRM System",
  description: "Complete CRM system for managing products, clients, providers and invoices",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CRMProvider>
          <OrderProvider>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header onSearch={() => {}} searchPlaceholder="Search across your CRM..." />
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
            </div>
          </OrderProvider>
        </CRMProvider>
      </body>
    </html>
  )
}
