import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle, CheckCircle, FileText } from "lucide-react"
import type { Invoice } from "@/lib/types"

interface InvoiceDetailsModalProps {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDetailsModal({ invoice, open, onOpenChange }: InvoiceDetailsModalProps) {
  if (!invoice) return null

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />
      case "sent":
        return <Clock className="h-4 w-4" />
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const isOverdue = invoice.status !== "paid" && invoice.dueDate < new Date()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Invoice {invoice.id}</span>
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Invoice Details</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="provider">Provider</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Invoice ID:</span>
                    <span>{invoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Created Date:</span>
                    <span>{invoice.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Due Date:</span>
                    <span className={isOverdue ? "text-red-600 font-bold" : ""}>
                      {invoice.dueDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invoice.status)}
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Situation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Payment Status:</span>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </div>

                      {invoice.status === "paid" ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Paid in full</span>
                        </div>
                      ) : isOverdue ? (
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>
                            Overdue by {Math.ceil((new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            Due in {Math.ceil((invoice.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-2">Payment Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{invoice.subtotal.toLocaleString()} DZD</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (10%):</span>
                          <span>{invoice.tax.toLocaleString()} DZD</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Total:</span>
                          <span>{invoice.total.toLocaleString()} DZD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-10 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Created</span>
                          <span className="text-gray-500 text-sm">{invoice.createdAt.toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 mt-1">Invoice was created</p>
                      </div>
                    </div>

                    {invoice.status !== "draft" && (
                      <div className="relative">
                        <div className="absolute -left-10 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Sent</span>
                            <span className="text-gray-500 text-sm">
                              {new Date(invoice.createdAt.getTime() + 1000 * 60 * 60 * 24).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">Invoice was sent to provider</p>
                        </div>
                      </div>
                    )}

                    {invoice.status === "paid" && (
                      <div className="relative">
                        <div className="absolute -left-10 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Paid</span>
                            <span className="text-gray-500 text-sm">
                              {new Date(invoice.dueDate.getTime() - 1000 * 60 * 60 * 24 * 2).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">Payment received in full</p>
                        </div>
                      </div>
                    )}

                    {invoice.status !== "paid" && (
                      <div className="relative">
                        <div
                          className={`absolute -left-10 w-6 h-6 rounded-full flex items-center justify-center ${
                            isOverdue ? "bg-red-100" : "bg-gray-100"
                          }`}
                        >
                          <Clock className={`h-4 w-4 ${isOverdue ? "text-red-600" : "text-gray-400"}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${isOverdue ? "text-red-600" : ""}`}>Due Date</span>
                            <span className="text-gray-500 text-sm">{invoice.dueDate.toLocaleDateString()}</span>
                          </div>
                          <p className={`mt-1 ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
                            {isOverdue ? "Payment overdue" : "Payment expected by this date"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
                \
