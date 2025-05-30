import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCRM } from "@/contexts/crm-context"
import { useOrders } from "@/contexts/order-context"
import { ArrowDownCircle, ArrowUpCircle, BarChart3, Package, ShoppingCart, TrendingUp } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductDetailsModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailsModal({ product, open, onOpenChange }: ProductDetailsModalProps) {
  const { data } = useCRM()
  const { orders } = useOrders()

  if (!product) return null

  // Find invoices that include this product
  const relatedInvoices = data.invoices.filter((invoice) =>
    invoice.items.some((item) => item.product.id === product.id),
  )

  // Find orders that include this product
  const relatedOrders = orders.filter((order) => order.items.some((item) => item.product.id === product.id))

  // Calculate total units sold
  const totalUnitsSold = relatedOrders.reduce((sum, order) => {
    const orderItem = order.items.find((item) => item.product.id === product.id)
    return sum + (orderItem ? orderItem.quantity : 0)
  }, 0)

  // Calculate total revenue
  const totalRevenue = relatedOrders.reduce((sum, order) => {
    const orderItem = order.items.find((item) => item.product.id === product.id)
    return sum + (orderItem ? orderItem.total : 0)
  }, 0)

  // Calculate total cost
  const totalCost = relatedInvoices.reduce((sum, invoice) => {
    const invoiceItem = invoice.items.find((item) => item.product.id === product.id)
    return sum + (invoiceItem ? invoiceItem.total : 0)
  }, 0)

  // Calculate profit margin
  const profitMargin = totalRevenue - totalCost
  const profitMarginPercentage = totalCost > 0 ? ((profitMargin / totalCost) * 100).toFixed(2) : "0"

  // Mock stock movement data (in a real app, this would come from a database)
  const stockMovements = [
    {
      id: "1",
      date: new Date(2023, 5, 15),
      type: "in",
      quantity: 50,
      source: "Invoice #INV-001",
      balance: 50,
    },
    {
      id: "2",
      date: new Date(2023, 5, 20),
      type: "out",
      quantity: 5,
      source: "Order #ORD-001",
      balance: 45,
    },
    {
      id: "3",
      date: new Date(2023, 6, 1),
      type: "in",
      quantity: 25,
      source: "Invoice #INV-002",
      balance: 70,
    },
    {
      id: "4",
      date: new Date(2023, 6, 10),
      type: "out",
      quantity: 15,
      source: "Order #ORD-002",
      balance: 55,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{product.name}</span>
            <Badge variant="secondary">{product.category.name}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stock">Stock Movement</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="related">Related Items</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Reference:</span>
                    <span>{product.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <Badge variant="secondary">{product.category.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Brand:</span>
                    <span>{product.brand.name}</span>
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 text-gray-600">{product.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Current Stock:</span>
                    <span className={product.quantity < 10 ? "text-red-600 font-bold" : "font-bold"}>
                      {product.quantity} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Buy Price:</span>
                    <span>{product.buyPrice.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sell Price:</span>
                    <span>{product.sellPrice.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Margin:</span>
                    <span
                      className={
                        (product.sellPrice - product.buyPrice) / product.buyPrice > 0.2
                          ? "text-green-600 font-bold"
                          : "text-orange-600 font-bold"
                      }
                    >
                      {(((product.sellPrice - product.buyPrice) / product.buyPrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600">Units Sold</div>
                      <div className="text-2xl font-bold">{totalUnitsSold}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600">Total Revenue</div>
                      <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} DZD</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-sm text-orange-600">Total Cost</div>
                      <div className="text-2xl font-bold">{totalCost.toLocaleString()} DZD</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-purple-600">Profit Margin</div>
                      <div className="text-2xl font-bold">{profitMarginPercentage}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement History</CardTitle>
                <CardDescription>Track inventory changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{movement.date.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {movement.type === "in" ? (
                              <ArrowDownCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowUpCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={
                                movement.type === "in" ? "text-green-600 font-medium" : "text-red-600 font-medium"
                              }
                            >
                              {movement.type === "in" ? "Stock In" : "Stock Out"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {movement.type === "in" ? "+" : "-"}
                          {movement.quantity}
                        </TableCell>
                        <TableCell>{movement.source}</TableCell>
                        <TableCell className="font-bold">{movement.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Financial Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Buy Price:</span>
                      <span>{product.buyPrice.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sell Price:</span>
                      <span>{product.sellPrice.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Unit Profit:</span>
                      <span className="text-green-600 font-medium">
                        {(product.sellPrice - product.buyPrice).toLocaleString()} DZD
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Margin Percentage:</span>
                      <span
                        className={
                          (product.sellPrice - product.buyPrice) / product.buyPrice > 0.2
                            ? "text-green-600 font-bold"
                            : "text-orange-600 font-bold"
                        }
                      >
                        {(((product.sellPrice - product.buyPrice) / product.buyPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-green-800">Revenue Analysis</h3>
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-bold">{totalRevenue.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-bold">{totalCost.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Net Profit:</span>
                      <span className="font-bold text-green-600">{profitMargin.toLocaleString()} DZD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Sales Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-blue-800">Sales Summary</h3>
                    <div className="flex justify-between">
                      <span>Units Sold:</span>
                      <span className="font-bold">{totalUnitsSold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Price:</span>
                      <span className="font-bold">
                        {totalUnitsSold > 0 ? (totalRevenue / totalUnitsSold).toLocaleString() : 0} DZD
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue per Unit:</span>
                      <span className="font-bold text-green-600">
                        {totalUnitsSold > 0 ? (profitMargin / totalUnitsSold).toLocaleString() : 0} DZD
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-purple-800">Inventory Value</h3>
                    <div className="flex justify-between">
                      <span>Current Stock:</span>
                      <span className="font-bold">{product.quantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock Value (Cost):</span>
                      <span className="font-bold">{(product.quantity * product.buyPrice).toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock Value (Retail):</span>
                      <span className="font-bold">{(product.quantity * product.sellPrice).toLocaleString()} DZD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="related">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Related Invoices
                  </CardTitle>
                  <CardDescription>Invoices that include this product</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedInvoices.length > 0 ? (
                        relatedInvoices.map((invoice) => {
                          const invoiceItem = invoice.items.find((item) => item.product.id === product.id)
                          return (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-medium">{invoice.id}</TableCell>
                              <TableCell>{invoice.provider.name}</TableCell>
                              <TableCell>{invoiceItem?.quantity || 0}</TableCell>
                              <TableCell>{invoice.createdAt.toLocaleDateString()}</TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            No related invoices found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                    Related Orders
                  </CardTitle>
                  <CardDescription>Orders that include this product</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedOrders.length > 0 ? (
                        relatedOrders.map((order) => {
                          const orderItem = order.items.find((item) => item.product.id === product.id)
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.client.name}</TableCell>
                              <TableCell>{orderItem?.quantity || 0}</TableCell>
                              <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            No related orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
