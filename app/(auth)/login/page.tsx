"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/lib/auth"
import { Eye, EyeOff, Mail, Lock, Heart } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-violet-800 overflow-hidden relative">
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{
              y: "-100vh",
              x: [0, 100, -100, 0],
              opacity: [0, 0.6, 0.3, 0],
              scale: [0.5, 1, 0.8, 0.3],
              transition: {
                duration: 15 + i * 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 2,
              },
            }}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${60 + i * 15}px`,
              height: `${60 + i * 15}px`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/80 text-sm">Sign in to continue your mental wellness journey</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-100 text-sm text-center backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 pl-12 pr-4 focus:border-white/40 focus:bg-white/15 transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 pl-12 pr-12 focus:border-white/40 focus:bg-white/15 transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-white text-violet-600 hover:bg-white/90 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-white font-semibold hover:underline transition-all">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
