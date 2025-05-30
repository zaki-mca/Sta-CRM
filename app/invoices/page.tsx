"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ProductForm } from "@/components/product-form"
import { ProviderForm } from "@/components/provider-form"
import { SearchableSelect } from "@/components/searchable-select"
import { useCRM } from "@/contexts/crm-context"
import type { InvoiceItem } from "@/lib/types"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"

export default function InvoicesPage() {
  const { data, addInvoice, updateInvoice, deleteInvoice, addProduct, addCategory, addBrand, addProvider } = useCRM()
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<any>(null)
  const [newInvoice, setNewInvoice] = useState({
    providerId: "",
    items: [] as any[],
    dueDate: "",
  })

  const filteredInvoices = data.invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.provider.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Enhanced product options with category, brand, and description for better search
  const productOptions = data.products.map((product) => ({
    value: product.id,
    label: product.name,
    price: product.sellPrice,
    category: product.category.name,
    brand: product.brand.name,
    description: product.description,
  }))

  // Enhanced provider options for searchable select
  const providerOptions = data.providers.map((provider) => ({
    value: provider.id,
    label: provider.name,
    email: provider.email,
  }))

  const addItemToInvoice = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { productId: "", quantity: 1, unitPrice: 0 }],
    })
  }

  const removeItemFromInvoice = (index: number) => {
    setNewInvoice({
      ...newInvoice,
      items: newInvoice.items.filter((_, i) => i !== index),
    })
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newInvoice.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "productId") {
      const product = data.products.find((p) => p.id === value)
      if (product) {
        updatedItems[index].unitPrice = product.sellPrice
      }
    }

    setNewInvoice({ ...newInvoice, items: updatedItems })
  }

  const handleAddProduct = (productData: any) => {
    addProduct(productData)
    const newProductId = Date.now().toString()
    setNewInvoice({
      ...newInvoice,
      items: [
        ...newInvoice.items,
        {
          productId: newProductId,
          quantity: 1,
          unitPrice: productData.sellPrice,
        },
      ],
    })
  }

  const handleAddProvider = (providerData: any) => {
    addProvider(providerData)
    // Set the newly created provider as selected
    const newProviderId = Date.now().toString()
    setNewInvoice({ ...newInvoice, providerId: newProviderId })
  }

  const createInvoice = () => {
    const provider = data.providers.find((p) => p.id === newInvoice.providerId)
    if (!provider || newInvoice.items.length === 0) return

    const invoiceItems: InvoiceItem[] = newInvoice.items.map((item, index) => {
      const product = data.products.find((p) => p.id === item.productId)!
      return {
        id: index.toString(),
        product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      }
    })

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax

    const invoice = {
      provider,
      items: invoiceItems,
      subtotal,
      tax,
      total,
      status: "draft" as const,
      dueDate: new Date(newInvoice.dueDate),
    }

    addInvoice(invoice)
    setNewInvoice({ providerId: "", items: [], dueDate: "" })
    setShowCreateForm(false)
  }

  const editInvoice = (invoice: any) => {
    setEditingInvoice(invoice)
    setNewInvoice({
      providerId: invoice.provider.id,
      items: invoice.items.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      dueDate: invoice.dueDate.toISOString().split("T")[0],
    })
    setShowEditForm(true)
  }

  const updateInvoiceData = () => {
    if (!editingInvoice) return

    const provider = data.providers.find((p) => p.id === newInvoice.providerId)
    if (!provider || newInvoice.items.length === 0) return

    const invoiceItems: InvoiceItem[] = newInvoice.items.map((item, index) => {
      const product = data.products.find((p) => p.id === item.productId)!
      return {
        id: index.toString(),
        product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      }
    })

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax

    const updatedInvoice = {
      provider,
      items: invoiceItems,
      subtotal,
      tax,
      total,
      status: editingInvoice.status,
      dueDate: new Date(newInvoice.dueDate),
    }

    updateInvoice(editingInvoice.id, updatedInvoice)
    setNewInvoice({ providerId: "", items: [], dueDate: "" })
    setEditingInvoice(null)
    setShowEditForm(false)
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    deleteInvoice(invoiceId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const InvoiceForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Provider</Label>
          <div className="flex space-x-2">
            <SearchableSelect
              value={newInvoice.providerId}
              onValueChange={(value) => setNewInvoice({ ...newInvoice, providerId: value })}
              options={providerOptions}
              placeholder="Select provider"
              searchPlaceholder="Search providers by name or email..."
              className="flex-1"
            />
            <ProviderForm
              onSubmit={handleAddProvider}
              trigger={
                <Button type="button" variant="outline">
                  Add New
                </Button>
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Input
            type="date"
            value={newInvoice.dueDate}
            onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <div className="flex space-x-2">
            <Button onClick={addItemToInvoice} variant="outline">
              Add Existing Product
            </Button>
            <ProductForm
              categories={data.categories}
              brands={data.brands}
              onSubmit={handleAddProduct}
              onAddCategory={addCategory}
              onAddBrand={addBrand}
              trigger={
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              }
            />
          </div>
        </div>

        {newInvoice.items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Product</Label>
              <SearchableSelect
                value={item.productId}
                onValueChange={(value) => updateInvoiceItem(index, "productId", value)}
                options={productOptions}
                placeholder="Select product"
                searchPlaceholder="Search by name, brand, or category..."
              />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateInvoiceItem(index, "quantity", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Price</Label>
              <Input
                type="number"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateInvoiceItem(index, "unitPrice", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                <Button variant="outline" size="sm" onClick={() => removeItemFromInvoice(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {newInvoice.items.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-end space-y-2">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    ${newInvoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>
                    $
                    {(newInvoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>
                    $
                    {(newInvoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setShowEditForm(false)
              setEditingInvoice(null)
            } else {
              setShowCreateForm(false)
            }
            setNewInvoice({ providerId: "", items: [], dueDate: "" })
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={isEdit ? updateInvoiceData : createInvoice}
          disabled={!newInvoice.providerId || newInvoice.items.length === 0}
        >
          {isEdit ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-600">Manage your billing and invoices</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Invoices</CardTitle>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <InvoiceForm />
              </DialogContent>
            </Dialog>

            <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Invoice {editingInvoice?.id}</DialogTitle>
                </DialogHeader>
                <InvoiceForm isEdit />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.provider.name}</TableCell>
                  <TableCell>{invoice.items.length} items</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.dueDate.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => editInvoice(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteInvoice(invoice.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
