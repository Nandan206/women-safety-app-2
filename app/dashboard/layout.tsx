"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, Smartphone, Menu, X, Bell, Shield, Map } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/auth/login")
  }

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Home", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Communities", path: "/dashboard/communities", icon: <Users className="h-5 w-5" /> },
    { name: "Devices", path: "/dashboard/devices", icon: <Smartphone className="h-5 w-5" /> },
    { name: "Safe Routes", path: "/dashboard/routes", icon: <Map className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="font-bold text-xl text-purple-800">SafeGuard</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {isMobile ? (
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-white pt-16">
          <nav className="container mx-auto px-4 py-6 space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  pathname === item.path ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full mt-6 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </Button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar and main content */}
      <div className="flex pt-16 min-h-screen">
        {!isMobile && (
          <aside className="w-64 bg-white border-r border-gray-200 fixed h-full pt-6">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    pathname === item.path ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>
        )}

        <main className={`flex-1 ${!isMobile ? "ml-64" : ""} p-6`}>{children}</main>
      </div>
    </div>
  )
}
