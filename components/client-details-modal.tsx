import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useOrders } from "@/contexts/order-context"
import { Calculator, Calendar, CreditCard, FileText, Phone, Mail, MapPin, User } from "lucide-react"
import type { Client } from "@/lib/types"

interface ClientDetailsModalProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailsModal({ client, open, onOpenChange }: ClientDetailsModalProps) {
  const { orders } = useOrders()

  if (!client) return null

  const clientOrders = orders.filter((order) => order.client.id === client.id)

  const pendingOrders = clientOrders.filter((order) => order.status === "pending" || order.status === "confirmed")
  const completedOrders = clientOrders.filter((order) => order.status === "delivered")
  const cancelledOrders = clientOrders.filter((order) => order.status === "cancelled")

  const totalSpent = clientOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0)

  const calculateAge = (birthDate: Date) => {
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{client.gender}</span>
            <span>{`${client.firstName} ${client.lastName}`}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{`${client.firstName} ${client.lastName}`}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{client.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Age:</span>
                    <span>{calculateAge(client.birthDate)} years</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Address:</span>
                    <span>{client.address}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Domain:</span>
                    <Badge variant="outline">{client.professionalDomain}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Revenue:</span>
                    <span className="text-green-600 font-medium">{client.revenue.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Client Since:</span>
                    <span>{client.createdAt.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600">Total Orders</div>
                      <div className="text-2xl font-bold">{clientOrders.length}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-sm text-yellow-600">Pending Orders</div>
                      <div className="text-2xl font-bold">{pendingOrders.length}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600">Completed Orders</div>
                      <div className="text-2xl font-bold">{completedOrders.length}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-purple-600">Total Spent</div>
                      <div className="text-2xl font-bold">{totalSpent.toLocaleString()} DZD</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>All orders placed by this client</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientOrders.length > 0 ? (
                      clientOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell>{order.total.toLocaleString()} DZD</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No orders found for this client
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Situation</CardTitle>
                <CardDescription>Financial overview and payment status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600">Total Paid</div>
                    <div className="text-2xl font-bold">
                      {completedOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()} DZD
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm text-yellow-600">Pending Payment</div>
                    <div className="text-2xl font-bold">
                      {pendingOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()} DZD
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pending Payments</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingOrders.length > 0 ? (
                        pendingOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                            <TableCell>{order.total.toLocaleString()} DZD</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            No pending payments
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking">
            <Card>
              <CardHeader>
                <CardTitle>Banking Information</CardTitle>
                <CardDescription>CCP account details and RIP information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                      CCP Account Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Number:</span>
                        <span className="font-mono font-medium">{client.ccpAccount || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Clé CCP:</span>
                        <span className="font-mono font-medium bg-purple-50 px-2 py-1 rounded">
                          {client.cle || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-orange-600" />
                      RIP Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">RIP:</span>
                        <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded max-w-[200px] truncate">
                          {client.rip || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">RIP Clé:</span>
                        <span className="font-mono font-medium bg-orange-50 px-2 py-1 rounded">
                          {client.ripCle || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                    CCP Calculation
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Account Format</div>
                      <div className="font-mono font-medium">
                        {client.ccpAccount ? `${client.ccpAccount}-${client.cle}` : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">RIP Format</div>
                      <div className="font-mono font-medium">
                        {client.rip ? `${client.rip}${client.ripCle}` : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
