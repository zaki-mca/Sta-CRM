"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SearchableSelect } from "@/components/searchable-select"
import type { Client, ProfessionalDomain } from "@/lib/types"

interface ClientFormProps {
  client?: Client
  professionalDomains: ProfessionalDomain[]
  onSubmit: (data: Omit<Client, "id" | "createdAt">) => void
  onAddProfessionalDomain: (name: string) => void
  trigger: React.ReactNode
}

// CCP Class implementation based on the HTML example
class CCP {
  private ccp: string

  constructor(ccp: string) {
    this.ccp = ccp
  }

  getCle(): string {
    // Calculate and return the cle of the account
    const x = this.ccp.padStart(10, "0")
    const values = x.split("")
    let cc = 0
    let z = 9

    for (let i = 4; i <= 13; i++) {
      cc += Number.parseInt(values[z]) * i
      z -= 1
    }

    const ccc = (cc % 100).toString().padStart(2, "0")
    return ccc
  }

  calculateRip(): string {
    // Calculate the rip based on the given value x
    const ccpNum = Number.parseInt(this.ccp)
    const remainder = (ccpNum * 100) % 97
    let x: number

    if (remainder + 85 > 97) {
      x = 97 - (remainder + 85 - 97)
    } else {
      x = 97 - (remainder + 85)
    }

    return "00799999" + ccpNum.toString().padStart(10, "0") + x.toString()
  }

  getRip(onlyCle = false): string {
    // Calculate and return the rip of the account
    const rip = this.calculateRip()
    return onlyCle ? rip.slice(-2) : rip
  }

  getRipCle(): string {
    // Return only the cle of the rip
    return this.getRip(true).padStart(2, "0")
  }
}

// CCP calculation function using the proper Algeria algorithm
function calculateCCPResults(ccpNumber: string) {
  // Check if the input is empty
  if (!ccpNumber || ccpNumber.trim() === "") {
    return { cleCcp: "", rip: "", ripCle: "", isValid: false }
  }

  // Validate that the account number contains only digits
  if (!/^\d+$/.test(ccpNumber)) {
    return { cleCcp: "", rip: "", ripCle: "", isValid: false }
  }

  try {
    const ccp = new CCP(ccpNumber)

    return {
      cleCcp: ccp.getCle(),
      rip: ccp.getRip(),
      ripCle: ccp.getRipCle(),
      isValid: true,
    }
  } catch (error) {
    return { cleCcp: "", rip: "", ripCle: "", isValid: false }
  }
}

export function ClientForm({
  client,
  professionalDomains,
  onSubmit,
  onAddProfessionalDomain,
  trigger,
}: ClientFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    gender: client?.gender || ("Mr." as const),
    firstName: client?.firstName || "",
    lastName: client?.lastName || "",
    email: client?.email || "",
    address: client?.address || "",
    phoneNumber: client?.phoneNumber || "",
    birthDate: client?.birthDate ? client.birthDate.toISOString().split("T")[0] : "",
    professionalDomain: client?.professionalDomain || "",
    revenue: client?.revenue || 0,
    ccpAccount: client?.ccpAccount || "",
    cleCcp: client?.cle || "",
    rip: client?.rip || "",
    ripCle: client?.ripCle || "",
    ccpIsValid: false,
  })
  const [newDomain, setNewDomain] = useState("")
  const [showNewDomain, setShowNewDomain] = useState(false)

  // Prepare options for professional domain searchable select
  const domainOptions = professionalDomains.map((domain) => ({
    value: domain.name,
    label: domain.name,
    domain: domain.name,
  }))

  // Calculate CCP results whenever CCP account changes
  useEffect(() => {
    if (formData.ccpAccount) {
      const result = calculateCCPResults(formData.ccpAccount)
      setFormData((prev) => ({
        ...prev,
        cleCcp: result.cleCcp,
        rip: result.rip,
        ripCle: result.ripCle,
        ccpIsValid: result.isValid,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        cleCcp: "",
        rip: "",
        ripCle: "",
        ccpIsValid: false,
      }))
    }
  }, [formData.ccpAccount])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      birthDate: new Date(formData.birthDate),
      cle: formData.cleCcp, // Map cleCcp to cle for backward compatibility
      ripCle: formData.ripCle,
    })
    setOpen(false)
    if (!client) {
      setFormData({
        gender: "Mr.",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phoneNumber: "",
        birthDate: "",
        professionalDomain: "",
        revenue: 0,
        ccpAccount: "",
        cleCcp: "",
        rip: "",
        ripCle: "",
        ccpIsValid: false,
      })
    }
  }

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      onAddProfessionalDomain(newDomain.trim())
      setFormData({ ...formData, professionalDomain: newDomain.trim() })
      setNewDomain("")
      setShowNewDomain(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">Annual Revenue</Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Professional Domain</Label>
            {!showNewDomain ? (
              <div className="flex space-x-2">
                <SearchableSelect
                  value={formData.professionalDomain}
                  onValueChange={(value) => setFormData({ ...formData, professionalDomain: value })}
                  options={domainOptions}
                  placeholder="Select professional domain"
                  searchPlaceholder="Search domains..."
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={() => setShowNewDomain(true)}>
                  Add New
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  placeholder="New professional domain"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
                <Button type="button" onClick={handleAddDomain}>
                  Add
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewDomain(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* CCP Account Information Section - Updated with proper Algeria algorithm */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">🇩🇿 Algeria CCP Account Information</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ccpAccount">CCP Account Number</Label>
                <Input
                  id="ccpAccount"
                  value={formData.ccpAccount}
                  onChange={(e) => setFormData({ ...formData, ccpAccount: e.target.value })}
                  placeholder="Enter CCP account number (e.g., 1234567890)"
                  className={formData.ccpAccount && !formData.ccpIsValid ? "border-red-300" : ""}
                />
                <p className="text-sm text-gray-500">
                  Enter your Algeria CCP account number (digits only). All values will be calculated automatically.
                </p>
                {formData.ccpAccount && !formData.ccpIsValid && (
                  <p className="text-sm text-red-500">Please enter only digits (0-9) for the CCP account number.</p>
                )}
              </div>

              {/* Calculated Fields - Only show when CCP account is valid */}
              {formData.ccpAccount && formData.ccpIsValid && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3">Calculated Results</h4>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded border border-green-300">
                      <span className="font-medium text-gray-700">CCP Number:</span>
                      <span className="font-mono text-green-700">{formData.ccpAccount}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white rounded border border-green-300">
                      <span className="font-medium text-gray-700">Clé CCP:</span>
                      <span className="font-mono text-green-700 font-bold">{formData.cleCcp}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white rounded border border-green-300">
                      <span className="font-medium text-gray-700">RIP:</span>
                      <span className="font-mono text-green-700 text-sm">{formData.rip}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white rounded border border-green-300">
                      <span className="font-medium text-gray-700">RIP Clé:</span>
                      <span className="font-mono text-green-700 font-bold">{formData.ripCle}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{client ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
