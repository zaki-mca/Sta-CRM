"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type {
  CRMData,
  CRMContextType,
  Provider,
  Client,
  Product,
  Category,
  Brand,
  Invoice,
  ProfessionalDomain,
} from "@/lib/types"

const CRMContext = createContext<CRMContextType | undefined>(undefined)

const initialData: CRMData = {
  providers: [
    {
      id: "1",
      name: "Tech Supplies Co.",
      email: "contact@techsupplies.com",
      address: "123 Tech Street, Silicon Valley, CA 94000",
      phoneNumber: "+1 (555) 123-4567",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Global Electronics Ltd.",
      email: "sales@globalelectronics.com",
      address: "456 Electronics Ave, New York, NY 10001",
      phoneNumber: "+1 (555) 987-6543",
      createdAt: new Date("2024-02-20"),
    },
  ],
  clients: [
    {
      id: "1",
      gender: "Mr.",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@abccorp.com",
      address: "789 Business Blvd, Corporate City, TX 75001",
      phoneNumber: "+1 (555) 234-5678",
      birthDate: new Date("1985-03-15"),
      professionalDomain: "Technology",
      revenue: 250000,
      ccpAccount: "1234567890",
      cle: "75",
      rip: "007999990123456789012",
      ripCle: "12",
      createdAt: new Date("2024-01-10"),
    },
    {
      id: "2",
      gender: "Ms.",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@xyzenterprises.com",
      address: "321 Enterprise Way, Commerce Town, FL 33101",
      phoneNumber: "+1 (555) 876-5432",
      birthDate: new Date("1990-07-22"),
      professionalDomain: "Finance",
      revenue: 180000,
      ccpAccount: "9876543210",
      cle: "42",
      rip: "007999999876543210034",
      ripCle: "34",
      createdAt: new Date("2024-02-15"),
    },
  ],
  categories: [
    { id: "1", name: "Electronics" },
    { id: "2", name: "Computers" },
    { id: "3", name: "Accessories" },
  ],
  brands: [
    { id: "1", name: "Apple" },
    { id: "2", name: "Samsung" },
    { id: "3", name: "Dell" },
  ],
  professionalDomains: [
    { id: "1", name: "Technology", paymentCode: "TECH001" },
    { id: "2", name: "Finance", paymentCode: "FIN002" },
    { id: "3", name: "Healthcare", paymentCode: "HEALTH003" },
    { id: "4", name: "Education", paymentCode: "EDU004" },
    { id: "5", name: "Manufacturing", paymentCode: "MFG005" },
    { id: "6", name: "Retail", paymentCode: "RET006" },
    { id: "7", name: "Consulting", paymentCode: "CONS007" },
    { id: "8", name: "Real Estate", paymentCode: "RE008" },
    { id: "9", name: "Marketing", paymentCode: "MKT009" },
    { id: "10", name: "Legal", paymentCode: "LEG010" },
  ],
  products: [
    {
      id: "1",
      name: 'MacBook Pro 16"',
      description:
        "High-performance laptop with M3 Pro chip, 16GB RAM, and 512GB SSD. Perfect for professional work and creative tasks.",
      reference: "MBP16-M3PRO",
      category: { id: "2", name: "Computers" },
      brand: { id: "1", name: "Apple" },
      sellPrice: 2499.99,
      buyPrice: 2000.0,
      quantity: 15,
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      name: "Samsung Galaxy S24",
      description: "Latest flagship smartphone with advanced camera system, 5G connectivity, and all-day battery life.",
      reference: "SGS24-5G",
      category: { id: "1", name: "Electronics" },
      brand: { id: "2", name: "Samsung" },
      sellPrice: 899.99,
      buyPrice: 650.0,
      quantity: 5,
      createdAt: new Date("2024-02-10"),
    },
  ],
  invoices: [
    {
      id: "INV-001",
      provider: {
        id: "1",
        name: "Tech Supplies Co.",
        email: "contact@techsupplies.com",
        address: "123 Tech Street, Silicon Valley, CA 94000",
        phoneNumber: "+1 (555) 123-4567",
        createdAt: new Date("2024-01-15"),
      },
      items: [
        {
          id: "1",
          product: {
            id: "1",
            name: 'MacBook Pro 16"',
            description:
              "High-performance laptop with M3 Pro chip, 16GB RAM, and 512GB SSD. Perfect for professional work and creative tasks.",
            reference: "MBP16-M3PRO",
            category: { id: "2", name: "Computers" },
            brand: { id: "1", name: "Apple" },
            sellPrice: 2499.99,
            buyPrice: 2000.0,
            quantity: 15,
            createdAt: new Date("2024-01-20"),
          },
          quantity: 2,
          unitPrice: 2499.99,
          total: 4999.98,
        },
      ],
      subtotal: 4999.98,
      tax: 499.99,
      total: 5499.97,
      status: "sent",
      createdAt: new Date("2024-03-01"),
      dueDate: new Date("2024-03-31"),
    },
  ],
}

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CRMData>(initialData)

  const addProvider = (providerData: Omit<Provider, "id" | "createdAt">) => {
    const newProvider: Provider = {
      ...providerData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setData((prev) => ({ ...prev, providers: [...prev.providers, newProvider] }))
  }

  const updateProvider = (id: string, providerData: Omit<Provider, "id" | "createdAt">) => {
    setData((prev) => ({
      ...prev,
      providers: prev.providers.map((provider) => (provider.id === id ? { ...provider, ...providerData } : provider)),
    }))
  }

  const deleteProvider = (id: string) => {
    setData((prev) => ({
      ...prev,
      providers: prev.providers.filter((provider) => provider.id !== id),
    }))
  }

  const addClient = (clientData: Omit<Client, "id" | "createdAt">) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setData((prev) => ({ ...prev, clients: [...prev.clients, newClient] }))
  }

  const updateClient = (id: string, clientData: Omit<Client, "id" | "createdAt">) => {
    setData((prev) => ({
      ...prev,
      clients: prev.clients.map((client) => (client.id === id ? { ...client, ...clientData } : client)),
    }))
  }

  const deleteClient = (id: string) => {
    setData((prev) => ({
      ...prev,
      clients: prev.clients.filter((client) => client.id !== id),
    }))
  }

  const addProduct = (productData: any) => {
    const category = data.categories.find((c) => c.id === productData.categoryId)
    const brand = data.brands.find((b) => b.id === productData.brandId)

    if (!category || !brand) return

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productData.name,
      description: productData.description,
      reference: productData.reference || "",
      category,
      brand,
      sellPrice: productData.sellPrice,
      buyPrice: productData.buyPrice,
      quantity: productData.quantity,
      createdAt: new Date(),
    }
    setData((prev) => ({ ...prev, products: [...prev.products, newProduct] }))
  }

  const updateProduct = (id: string, productData: any) => {
    const category = data.categories.find((c) => c.id === productData.categoryId)
    const brand = data.brands.find((b) => b.id === productData.brandId)

    if (!category || !brand) return

    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id
          ? {
              ...product,
              name: productData.name,
              description: productData.description,
              reference: productData.reference || "",
              category,
              brand,
              sellPrice: productData.sellPrice,
              buyPrice: productData.buyPrice,
              quantity: productData.quantity,
            }
          : product,
      ),
    }))
  }

  const deleteProduct = (id: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
    }))
  }

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
    }
    setData((prev) => ({ ...prev, categories: [...prev.categories, newCategory] }))
  }

  const addBrand = (name: string) => {
    const newBrand: Brand = {
      id: Date.now().toString(),
      name,
    }
    setData((prev) => ({ ...prev, brands: [...prev.brands, newBrand] }))
  }

  const addProfessionalDomain = (domainData: Omit<ProfessionalDomain, "id">) => {
    const newDomain: ProfessionalDomain = {
      id: Date.now().toString(),
      ...domainData,
    }
    setData((prev) => ({ ...prev, professionalDomains: [...prev.professionalDomains, newDomain] }))
  }

  const updateProfessionalDomain = (id: string, domainData: Omit<ProfessionalDomain, "id">) => {
    setData((prev) => ({
      ...prev,
      professionalDomains: prev.professionalDomains.map((domain) =>
        domain.id === id ? { ...domain, ...domainData } : domain,
      ),
    }))
  }

  const deleteProfessionalDomain = (id: string) => {
    setData((prev) => ({
      ...prev,
      professionalDomains: prev.professionalDomains.filter((domain) => domain.id !== id),
    }))
  }

  const addInvoice = (invoiceData: any) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `INV-${String(data.invoices.length + 1).padStart(3, "0")}`,
      createdAt: new Date(),
    }
    setData((prev) => ({ ...prev, invoices: [...prev.invoices, newInvoice] }))
  }

  const updateInvoice = (id: string, invoiceData: any) => {
    setData((prev) => ({
      ...prev,
      invoices: prev.invoices.map((invoice) => (invoice.id === id ? { ...invoice, ...invoiceData } : invoice)),
    }))
  }

  const deleteInvoice = (id: string) => {
    setData((prev) => ({
      ...prev,
      invoices: prev.invoices.filter((invoice) => invoice.id !== id),
    }))
  }

  return (
    <CRMContext.Provider
      value={{
        data,
        addProvider,
        updateProvider,
        deleteProvider,
        addClient,
        updateClient,
        deleteClient,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        addBrand,
        addProfessionalDomain,
        updateProfessionalDomain,
        deleteProfessionalDomain,
        addInvoice,
        updateInvoice,
        deleteInvoice,
      }}
    >
      {children}
    </CRMContext.Provider>
  )
}

export function useCRM() {
  const context = useContext(CRMContext)
  if (context === undefined) {
    throw new Error("useCRM must be used within a CRMProvider")
  }
  return context
}
