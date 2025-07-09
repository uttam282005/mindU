'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const Signup: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const displayName = username
      const userCredential = await signUp(email, password, displayName)
      console.log(userCredential)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5fb] px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">
        <h1 className="text-3xl font-semibold text-center text-[#805ad5] mb-6">
          Create Your Account
        </h1>
        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#805ad5]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#805ad5]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#805ad5]"
          />
          <button
            type="submit"
            className="w-full bg-[#805ad5] text-white py-2 rounded-md hover:bg-[#6b46c1] transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup
