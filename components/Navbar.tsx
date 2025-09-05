"use client"

import * as React from "react"
import { Menu, X, MessageSquare, HelpCircle, LayoutDashboard, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router  = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { user } = useAuth()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Chatbox", href: "/chat", icon: MessageSquare },
    { name: "Daily Quiz", href: "/evalute", icon: HelpCircle },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-violet-50/80 to-purple-50/80 border-b border-violet-200/50 shadow-lg backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 group">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-purple-700 transition-all duration-300">
                  MindCare
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-4 py-2 rounded-xl text-sm font-medium text-violet-700 hover:text-violet-900 hover:bg-white/70 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-sm border border-transparent hover:border-violet-200/50"
              >
                <item.icon className="w-4 h-4 mr-2 group-hover:text-violet-600 transition-colors duration-200" />
                {item.name}
              </a>
            ))}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ml-4 hover:bg-white/70 border border-transparent hover:border-violet-200/50"
                  > 
                    <Avatar className="h-8 w-8">
                <AvatarImage src={"/placeholder.svg"} alt={"user"} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm">
                        {"U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white/95 backdrop-blur-md border-violet-200/50"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-violet-900">{"User"}</p>
                      <p className="text-xs leading-none text-violet-600">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-violet-200/50" />
                  <DropdownMenuItem className="hover:bg-violet-50 focus:bg-violet-50">
                    <User className="mr-2 h-4 w-4 text-violet-600" />
                    <button onClick={() =>router.push('/dashboard')} className="text-violet-700">Profile</button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-violet-200/50" />
                  <DropdownMenuItem
                    className="hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center justify-center p-2 rounded-lg text-violet-700 hover:text-violet-900 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-200 border border-transparent hover:border-violet-200/50"
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
                className="w-[280px] bg-gradient-to-b from-violet-50/95 to-purple-50/95 border-l border-violet-200/50 backdrop-blur-md"
              >
                <div className="mt-6">
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">M</span>
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        MindCare
                      </span>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group flex items-center px-4 py-3 rounded-xl text-base font-medium text-violet-700 hover:text-violet-900 hover:bg-white/70 transition-all duration-200 ease-in-out transform hover:translate-x-1 border border-transparent hover:border-violet-200/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5 mr-3 group-hover:text-violet-600 transition-colors duration-200" />
                        {item.name}
                      </a>
                    ))}

                    {user && (
                      <>
                        <div className="border-t border-violet-200/50 my-4"></div>
                        <div className="px-4 py-3">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={"/placeholder.svg"} alt={"user"} />
                              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm">
                                { user.email?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-violet-900">{"User"}</p>
                              <p className="text-xs text-violet-600">{user.email}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-violet-700 hover:bg-white/70 transition-all duration-200">
                              <User className="w-4 h-4 mr-2" />
                              Profile
                            </button>
                            <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-violet-700 hover:bg-white/70 transition-all duration-200">
                              <Settings className="w-4 h-4 mr-2" />
                              Settings
                            </button>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Log out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
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
