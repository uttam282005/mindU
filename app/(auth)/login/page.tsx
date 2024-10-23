"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      // Handle login error (e.g., show error message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6a0dad] overflow-hidden relative">
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="bubble"
            initial={{ y: '100%' }}
            animate={{
              y: '-100%',
              x: [0, 50, -50, 0],
              transition: {
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
            style={{
              left: `${i * 20}%`,
              width: `${40 + i * 10}px`,
              height: `${40 + i * 10}px`,
            }}
          />
        ))}
      </div>
      <div className="z-10 w-[350px] p-8 bg-white bg-opacity-10 rounded-3xl backdrop-blur-md border border-white border-opacity-30">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <Input
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white"
              placeholder="Password"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-[#6a0dad] hover:bg-[#d4b0f3] transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
      <style jsx>{`
        .bubble {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
      `}</style>
    </div>
  )
}
