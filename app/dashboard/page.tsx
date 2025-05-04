"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Phone, Plus, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relation: string
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: "0", name: "Nagaraj", phone: "+91 73391 22810", relation: "Friend" },
    { id: "1", name: "Mom", phone: "+91 98765 43210", relation: "Family" },
    { id: "2", name: "Dad", phone: "+91 98765 12345", relation: "Family" },
    { id: "3", name: "Police", phone: "100", relation: "Emergency" },
  ])

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relation: "",
  })

  const handleAddContact = () => {
    const id = Math.random().toString(36).substring(2, 9)
    setContacts([...contacts, { id, ...newContact }])
    setNewContact({ name: "", phone: "", relation: "" })
    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your emergency contacts.`,
    })
  }

  // Add this function after the handleAddContact function
  const callEmergencyContact = (index = 0) => {
    if (index >= contacts.length) {
      // All contacts have been called
      return
    }

    // Remove spaces from phone number for proper tel: URI
    const phoneNumber = contacts[index].phone.replace(/\s+/g, "")

    toast({
      title: `Calling ${contacts[index].name}`,
      description: `Dialing ${contacts[index].phone}...`,
    })

    // In a real app, you would need to handle this differently
    // This is just a demonstration that opens the phone dialer
    window.open(`tel:${phoneNumber}`, "_self")
  }

  const handleSOS = () => {
    toast({
      title: "SOS Activated",
      description: "Emergency contacts are being called. Your location is being shared.",
      variant: "destructive",
    })

    // Call the first emergency contact
    callEmergencyContact(0)

    // In a real app, you would:
    // 1. Send SMS with location data to all contacts
    // 2. Have a more sophisticated calling mechanism
    // 3. Possibly use a background service for this functionality
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SOS Button Card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Emergency SOS</CardTitle>
            <CardDescription className="text-red-100">Press the button below in case of emergency</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button
              size="lg"
              className="h-32 w-32 rounded-full bg-white text-red-600 hover:bg-red-100 border-4 border-white shadow-lg"
              onClick={handleSOS}
            >
              <AlertCircle className="h-16 w-16" />
              <span className="sr-only">SOS</span>
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Contacts Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>People to contact in case of emergency</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>Add someone who can be contacted in case of emergency.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Contact name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relation">Relation</Label>
                    <Input
                      id="relation"
                      placeholder="Family, Friend, etc."
                      value={newContact.relation}
                      onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddContact} className="bg-purple-600 hover:bg-purple-700">
                    Add Contact
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <UserPlus className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.relation}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-purple-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {contact.phone}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Features */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Features</CardTitle>
          <CardDescription>Tools and resources to help keep you safe</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="location">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="location">Location Sharing</TabsTrigger>
              <TabsTrigger value="resources">Safety Resources</TabsTrigger>
              <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="location" className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-medium mb-2">Share your location with trusted contacts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your location is currently being shared with 2 trusted contacts.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">Manage Location Sharing</Button>
              </div>
            </TabsContent>
            <TabsContent value="resources" className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-medium mb-2">Safety Resources</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Access helpful safety tips, local resources, and emergency services information.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">View Resources</Button>
              </div>
            </TabsContent>
            <TabsContent value="alerts" className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-medium mb-2">Safety Alerts</h3>
                <p className="text-sm text-gray-600 mb-4">Receive alerts about safety concerns in your area.</p>
                <Button className="bg-purple-600 hover:bg-purple-700">Configure Alerts</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
