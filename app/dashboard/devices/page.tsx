"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Watch, Plus, Trash2, Settings, BatteryMedium, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Device {
  id: string
  name: string
  type: "smartwatch" | "smartphone" | "other"
  status: "connected" | "disconnected"
  battery: number
  lastSync: string
}

export default function DevicesPage() {
  const { toast } = useToast()
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "My Smartwatch",
      type: "smartwatch",
      status: "connected",
      battery: 78,
      lastSync: "Today, 10:30 AM",
    },
    {
      id: "2",
      name: "iPhone 13",
      type: "smartphone",
      status: "connected",
      battery: 65,
      lastSync: "Today, 11:15 AM",
    },
  ])

  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "smartwatch" as const,
  })

  const handleAddDevice = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const newDeviceObj: Device = {
      id,
      name: newDevice.name,
      type: newDevice.type,
      status: "connected",
      battery: 100,
      lastSync: "Just now",
    }

    setDevices([...devices, newDeviceObj])
    setNewDevice({ name: "", type: "smartwatch" })
    toast({
      title: "Device added",
      description: `${newDevice.name} has been added to your devices.`,
    })
  }

  const handleRemoveDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id))
    toast({
      title: "Device removed",
      description: "The device has been removed from your account.",
    })
  }

  const handleToggleStatus = (id: string) => {
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, status: device.status === "connected" ? "disconnected" : "connected" } : device,
      ),
    )

    const device = devices.find((d) => d.id === id)
    const newStatus = device?.status === "connected" ? "disconnected" : "connected"

    toast({
      title: `Device ${newStatus}`,
      description: `${device?.name} is now ${newStatus}.`,
    })
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "smartwatch":
        return <Watch className="h-10 w-10 text-purple-600" />
      case "smartphone":
        return <Smartphone className="h-10 w-10 text-purple-600" />
      default:
        return <Smartphone className="h-10 w-10 text-purple-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Devices</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Device</DialogTitle>
              <DialogDescription>Connect a new device to enhance your safety features.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="device-name">Device Name</Label>
                <Input
                  id="device-name"
                  placeholder="My Smartwatch"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type</Label>
                <select
                  id="device-type"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={newDevice.type}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      type: e.target.value as "smartwatch" | "smartphone" | "other",
                    })
                  }
                >
                  <option value="smartwatch">Smartwatch</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDevice} className="bg-purple-600 hover:bg-purple-700">
                Add Device
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex space-x-4">
                {getDeviceIcon(device.type)}
                <div>
                  <CardTitle>{device.name}</CardTitle>
                  <CardDescription>Last synced: {device.lastSync}</CardDescription>
                </div>
              </div>
              <Badge variant={device.status === "connected" ? "default" : "secondary"}>{device.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BatteryMedium className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{device.battery}% Battery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Connected</span>
                  <Switch
                    checked={device.status === "connected"}
                    onCheckedChange={() => handleToggleStatus(device.id)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">SOS Alert</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Location Tracking</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Fall Detection</span>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleRemoveDevice(device.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {devices.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No devices connected</h3>
            <p className="text-gray-500 text-center mb-6">Connect your devices to enhance your safety features.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Device</DialogTitle>
                  <DialogDescription>Connect a new device to enhance your safety features.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="device-name-empty">Device Name</Label>
                    <Input
                      id="device-name-empty"
                      placeholder="My Smartwatch"
                      value={newDevice.name}
                      onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="device-type-empty">Device Type</Label>
                    <select
                      id="device-type-empty"
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={newDevice.type}
                      onChange={(e) =>
                        setNewDevice({
                          ...newDevice,
                          type: e.target.value as "smartwatch" | "smartphone" | "other",
                        })
                      }
                    >
                      <option value="smartwatch">Smartwatch</option>
                      <option value="smartphone">Smartphone</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddDevice} className="bg-purple-600 hover:bg-purple-700">
                    Add Device
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
