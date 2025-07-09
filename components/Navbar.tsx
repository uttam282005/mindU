"use client"

import * as React from "react"
import { Menu, X, MessageSquare, HelpCircle, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Chatbox", href: "/chat", icon: MessageSquare },
    { name: "Daily Quiz", href: "/evalute", icon: HelpCircle },
  ]

  return (
    <nav className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-violet-700 transition-all duration-300">
                MindCare
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-4 py-2 rounded-xl text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-white/60 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-sm"
                >
                  <item.icon className="w-4 h-4 mr-2 group-hover:text-purple-600 transition-colors duration-200" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center justify-center p-2 rounded-lg text-purple-700 hover:text-purple-900 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-5 w-5" aria-hidden="true" />
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[280px] bg-gradient-to-b from-purple-50 to-violet-50 border-l border-purple-100"
              >
                <div className="mt-6">
                  <div className="mb-6">
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                      MyDashboard
                    </span>
                  </div>

                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group flex items-center px-4 py-3 rounded-xl text-base font-medium text-purple-700 hover:text-purple-900 hover:bg-white/60 transition-all duration-200 ease-in-out transform hover:translate-x-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5 mr-3 group-hover:text-purple-600 transition-colors duration-200" />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
