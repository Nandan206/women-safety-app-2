"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Map, Navigation, Clock, Shield, Car, FootprintsIcon as Walking } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Route {
  id: string
  name: string
  from: string
  to: string
  distance: string
  duration: string
  safetyRating: "high" | "medium" | "low"
  transportMode: "walking" | "driving" | "public"
}

export default function RoutesPage() {
  const { toast } = useToast()
  const mapRef = useRef<HTMLDivElement>(null)
  const [startLocation, setStartLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [transportMode, setTransportMode] = useState<"walking" | "driving" | "public">("walking")
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day")

  const [suggestedRoutes, setSuggestedRoutes] = useState<Route[]>([
    {
      id: "1",
      name: "Main Street Route",
      from: "Current Location",
      to: "Downtown",
      distance: "1.2 miles",
      duration: "25 mins",
      safetyRating: "high",
      transportMode: "walking",
    },
    {
      id: "2",
      name: "Riverside Path",
      from: "Current Location",
      to: "Downtown",
      distance: "1.5 miles",
      duration: "30 mins",
      safetyRating: "medium",
      transportMode: "walking",
    },
    {
      id: "3",
      name: "Highway Route",
      from: "Current Location",
      to: "Downtown",
      distance: "3.2 miles",
      duration: "10 mins",
      safetyRating: "high",
      transportMode: "driving",
    },
  ])

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  // Simulate finding routes
  const handleFindRoutes = () => {
    if (!startLocation || !destination) {
      toast({
        title: "Missing information",
        description: "Please enter both start and destination locations.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call a mapping API
    toast({
      title: "Finding safe routes",
      description: "Analyzing the safest routes for your journey...",
    })

    // Simulate API delay
    setTimeout(() => {
      const newRoutes: Route[] = [
        {
          id: "1",
          name: `${startLocation} to ${destination} - Route 1`,
          from: startLocation,
          to: destination,
          distance: "1.8 miles",
          duration: transportMode === "walking" ? "35 mins" : "8 mins",
          safetyRating: "high",
          transportMode,
        },
        {
          id: "2",
          name: `${startLocation} to ${destination} - Route 2`,
          from: startLocation,
          to: destination,
          distance: "2.1 miles",
          duration: transportMode === "walking" ? "40 mins" : "12 mins",
          safetyRating: "medium",
          transportMode,
        },
        {
          id: "3",
          name: `${startLocation} to ${destination} - Route 3`,
          from: startLocation,
          to: destination,
          distance: "2.5 miles",
          duration: transportMode === "walking" ? "50 mins" : "15 mins",
          safetyRating: "high",
          transportMode,
        },
      ]

      setSuggestedRoutes(newRoutes)
      setSelectedRoute(newRoutes[0])

      // Draw the route on the map
      if (mapRef.current) {
        drawRouteOnMap()
      }
    }, 1500)
  }

  const handleSelectRoute = (route: Route) => {
    setSelectedRoute(route)

    toast({
      title: "Route selected",
      description: `You've selected ${route.name}`,
    })

    // Draw the route on the map
    if (mapRef.current) {
      drawRouteOnMap()
    }
  }

  const getSafetyRatingColor = (rating: "high" | "medium" | "low") => {
    switch (rating) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTransportIcon = (mode: "walking" | "driving" | "public") => {
    switch (mode) {
      case "walking":
        return <Walking className="h-4 w-4" />
      case "driving":
        return <Car className="h-4 w-4" />
      case "public":
        return <Navigation className="h-4 w-4" />
      default:
        return <Walking className="h-4 w-4" />
    }
  }

  // Simple canvas-based map with route drawing
  const drawRouteOnMap = () => {
    if (!mapRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = mapRef.current.clientHeight

    // Clear previous content
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a simple map background
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw some "roads"
    ctx.strokeStyle = "#d0d0d0"
    ctx.lineWidth = 3

    // Horizontal roads
    for (let y = 50; y < canvas.height; y += 80) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Vertical roads
    for (let x = 50; x < canvas.width; x += 80) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw the route
    ctx.strokeStyle =
      selectedRoute?.safetyRating === "high"
        ? "#10b981"
        : selectedRoute?.safetyRating === "medium"
          ? "#f59e0b"
          : "#ef4444"
    ctx.lineWidth = 5

    // Start point
    const startX = 50
    const startY = 50

    // End point
    const endX = canvas.width - 50
    const endY = canvas.height - 50

    // Draw a curved path between start and end
    ctx.beginPath()
    ctx.moveTo(startX, startY)

    // Create a random path with control points
    const cp1x = startX + (endX - startX) * 0.3 + (Math.random() * 50 - 25)
    const cp1y = startY + (endY - startY) * 0.1 + (Math.random() * 50 - 25)
    const cp2x = startX + (endX - startX) * 0.7 + (Math.random() * 50 - 25)
    const cp2y = startY + (endY - startY) * 0.9 + (Math.random() * 50 - 25)

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
    ctx.stroke()

    // Draw start marker
    ctx.fillStyle = "#4f46e5"
    ctx.beginPath()
    ctx.arc(startX, startY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw end marker
    ctx.fillStyle = "#7c3aed"
    ctx.beginPath()
    ctx.arc(endX, endY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Add labels
    ctx.fillStyle = "#000"
    ctx.font = "12px Arial"
    ctx.fillText("Start", startX - 15, startY - 10)
    ctx.fillText("Destination", endX - 30, endY - 10)
  }

  // Initialize map on component mount
  useEffect(() => {
    if (mapRef.current) {
      drawRouteOnMap()
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Safe Routes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Finder Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Find Safe Routes</CardTitle>
            <CardDescription>Get route suggestions prioritizing your safety</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start">Starting Point</Label>
              <Input
                id="start"
                placeholder="Current location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transport">Transport Mode</Label>
              <Select
                value={transportMode}
                onValueChange={(value) => setTransportMode(value as "walking" | "driving" | "public")}
              >
                <SelectTrigger id="transport">
                  <SelectValue placeholder="Select transport mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walking">Walking</SelectItem>
                  <SelectItem value="driving">Driving</SelectItem>
                  <SelectItem value="public">Public Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time of Day</Label>
              <Select value={timeOfDay} onValueChange={(value) => setTimeOfDay(value as "day" | "night")}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time of day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daytime</SelectItem>
                  <SelectItem value="night">Night time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFindRoutes} className="w-full bg-purple-600 hover:bg-purple-700">
              <Navigation className="h-4 w-4 mr-2" />
              Find Safe Routes
            </Button>
          </CardFooter>
        </Card>

        {/* Map Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Route Map</CardTitle>
            <CardDescription>
              {selectedRoute ? selectedRoute.name : "Select a route to view on the map"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={mapRef} className="w-full h-[300px] bg-gray-100 rounded-md overflow-hidden">
              {/* Map will be rendered here */}
            </div>

            {selectedRoute && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{selectedRoute.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedRoute.from} to {selectedRoute.to}
                    </p>
                  </div>
                  <Badge className={getSafetyRatingColor(selectedRoute.safetyRating)}>
                    {selectedRoute.safetyRating === "high"
                      ? "High Safety"
                      : selectedRoute.safetyRating === "medium"
                        ? "Medium Safety"
                        : "Low Safety"}
                  </Badge>
                </div>
                <div className="flex mt-3 space-x-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm">{selectedRoute.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Map className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm">{selectedRoute.distance}</span>
                  </div>
                  <div className="flex items-center">
                    {getTransportIcon(selectedRoute.transportMode)}
                    <span className="text-sm ml-1">
                      {selectedRoute.transportMode === "walking"
                        ? "Walking"
                        : selectedRoute.transportMode === "driving"
                          ? "Driving"
                          : "Public Transport"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suggested Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Routes</CardTitle>
          <CardDescription>Routes are ranked by safety, lighting, and community feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestedRoutes.length > 0 ? (
              suggestedRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedRoute?.id === route.id
                      ? "bg-purple-50 border-purple-200"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => handleSelectRoute(route)}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        route.safetyRating === "high"
                          ? "bg-green-100"
                          : route.safetyRating === "medium"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                      }`}
                    >
                      <Shield
                        className={`h-5 w-5 ${
                          route.safetyRating === "high"
                            ? "text-green-600"
                            : route.safetyRating === "medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{route.name}</h3>
                      <div className="flex text-sm text-gray-500 space-x-3">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {route.duration}
                        </span>
                        <span className="flex items-center">
                          <Map className="h-3 w-3 mr-1" />
                          {route.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getSafetyRatingColor(route.safetyRating)}>
                    {route.safetyRating === "high"
                      ? "High Safety"
                      : route.safetyRating === "medium"
                        ? "Medium Safety"
                        : "Low Safety"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Map className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No routes found</h3>
                <p className="text-gray-500 mt-1">Enter your start and destination points to find safe routes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
