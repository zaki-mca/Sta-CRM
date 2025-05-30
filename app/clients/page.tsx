"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientForm } from "@/components/client-form"
import { useCRM } from "@/contexts/crm-context"
import { Plus, Search, Edit, Trash2, Calendar, DollarSign, CreditCard, Calculator, FileText } from "lucide-react"

export default function ClientsPage() {
  const { data, addClient, updateClient, deleteClient, addProfessionalDomain } = useCRM()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = data.clients.filter(
    (client) =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.professionalDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ccpAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.rip.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const calculateAge = (birthDate: Date) => {
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🇩🇿 Clients</h1>
        <p className="text-gray-600">Manage your customers and Algeria CCP accounts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Clients</CardTitle>
            <ClientForm
              professionalDomains={data.professionalDomains}
              onSubmit={addClient}
              onAddProfessionalDomain={addProfessionalDomain}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Professional Domain</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>CCP Account</TableHead>
                <TableHead>Clé CCP</TableHead>
                <TableHead>RIP</TableHead>
                <TableHead>RIP Clé</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{client.gender}</span>
                      <span>{`${client.firstName} ${client.lastName}`}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phoneNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{calculateAge(client.birthDate)} years</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.professionalDomain}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">{client.revenue.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span className="font-mono text-sm">{client.ccpAccount || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calculator className="h-4 w-4 text-purple-600" />
                      <span className="font-mono text-sm bg-purple-50 px-2 py-1 rounded font-bold">
                        {client.cle || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs bg-gray-50 px-2 py-1 rounded max-w-[140px] truncate">
                      {client.rip || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-orange-600" />
                      <span className="font-mono text-sm bg-orange-50 px-2 py-1 rounded font-bold">
                        {client.ripCle || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{client.address}</TableCell>
                  <TableCell>{client.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <ClientForm
                        client={client}
                        professionalDomains={data.professionalDomains}
                        onSubmit={(data) => updateClient(client.id, data)}
                        onAddProfessionalDomain={addProfessionalDomain}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button variant="outline" size="sm" onClick={() => deleteClient(client.id)}>
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
