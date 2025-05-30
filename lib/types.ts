export interface Provider {
  id: string
  name: string
  email: string
  address: string
  phoneNumber: string
  createdAt: Date
}

export interface Client {
  id: string
  gender: "Mr." | "Ms." | "Mrs."
  firstName: string
  lastName: string
  email: string
  address: string
  phoneNumber: string
  birthDate: Date
  professionalDomain: string
  revenue: number
  ccpAccount: string
  cle: string
  rip: string
  ripCle: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
}

export interface Brand {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  reference: string
  category: Category
  brand: Brand
  sellPrice: number
  buyPrice: number
  quantity: number
  createdAt: Date
}

export interface InvoiceItem {
  id: string
  product: Product
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  provider: Provider
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  createdAt: Date
  dueDate: Date
}

export interface ProfessionalDomain {
  id: string
  name: string
  paymentCode?: string
}

export interface CRMData {
  providers: Provider[]
  clients: Client[]
  products: Product[]
  categories: Category[]
  brands: Brand[]
  invoices: Invoice[]
  professionalDomains: ProfessionalDomain[]
}

export interface CRMContextType {
  data: CRMData
  addProvider: (provider: Omit<Provider, "id" | "createdAt">) => void
  updateProvider: (id: string, provider: Omit<Provider, "id" | "createdAt">) => void
  deleteProvider: (id: string) => void
  addClient: (client: Omit<Client, "id" | "createdAt">) => void
  updateClient: (id: string, client: Omit<Client, "id" | "createdAt">) => void
  deleteClient: (id: string) => void
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void
  updateProduct: (id: string, product: Omit<Product, "id" | "createdAt">) => void
  deleteProduct: (id: string) => void
  addCategory: (name: string) => void
  addBrand: (name: string) => void
  addProfessionalDomain: (domain: Omit<ProfessionalDomain, "id">) => void
  updateProfessionalDomain: (id: string, domain: Omit<ProfessionalDomain, "id">) => void
  deleteProfessionalDomain: (id: string) => void
  addInvoice: (invoice: Omit<Invoice, "id" | "createdAt">) => void
  updateInvoice: (id: string, invoice: Omit<Invoice, "id" | "createdAt">) => void
  deleteInvoice: (id: string) => void
}
