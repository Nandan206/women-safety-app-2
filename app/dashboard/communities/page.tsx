"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Search, Users, MessageSquare, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Community {
  id: string
  name: string
  description: string
  members: number
  category: string
  joined: boolean
}

export default function CommunitiesPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "1",
      name: "Neighborhood Watch",
      description: "Local community focused on neighborhood safety and awareness.",
      members: 128,
      category: "Local",
      joined: true,
    },
    {
      id: "2",
      name: "Safety Tips & Advice",
      description: "Share and learn safety tips for various situations.",
      members: 356,
      category: "Education",
      joined: false,
    },
    {
      id: "3",
      name: "Self-Defense Group",
      description: "Discussion about self-defense techniques and classes.",
      members: 215,
      category: "Training",
      joined: false,
    },
    {
      id: "4",
      name: "Campus Safety",
      description: "For students to discuss and share campus safety information.",
      members: 189,
      category: "Education",
      joined: true,
    },
  ])

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    {
      id: "1",
      sender: "Sarah",
      text: "Has anyone taken the self-defense class at the community center?",
      time: "10:30 AM",
    },
    {
      id: "2",
      sender: "Emily",
      text: "Yes! It was really helpful. They're offering another session next month.",
      time: "10:32 AM",
    },
    {
      id: "3",
      sender: "Moderator",
      text: "We'll be posting the schedule for all upcoming safety classes this week.",
      time: "10:45 AM",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleJoinCommunity = (id: string) => {
    setCommunities(communities.map((community) => (community.id === id ? { ...community, joined: true } : community)))
    toast({
      title: "Community joined",
      description: "You have successfully joined this community.",
    })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg = {
      id: Math.random().toString(36).substring(2, 9),
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Community</DialogTitle>
              <DialogDescription>Start a new community to connect with others around safety topics.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Community Name</label>
                <Input id="name" placeholder="Enter community name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Input id="description" placeholder="Describe your community" />
              </div>
              <div className="space-y-2">
                <label htmlFor="category">Category</label>
                <Input id="category" placeholder="e.g., Local, Education, Support" />
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-purple-600 hover:bg-purple-700">Create Community</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search communities..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selectedCommunity ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedCommunity.name}</CardTitle>
              <CardDescription>
                {selectedCommunity.members} members · {selectedCommunity.category}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setSelectedCommunity(null)}>
              Back to Communities
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{selectedCommunity.description}</p>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto p-2">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "You" ? "bg-purple-100 text-purple-900" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-xs">{message.sender}</span>
                      <span className="text-xs text-gray-500 ml-2">{message.time}</span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCommunities.map((community) => (
            <Card key={community.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{community.name}</CardTitle>
                    <CardDescription>{community.members} members</CardDescription>
                  </div>
                  <Badge variant={community.joined ? "secondary" : "outline"}>
                    {community.joined ? "Joined" : community.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{community.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setSelectedCommunity(community)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Discussions
                </Button>
                {!community.joined && (
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
