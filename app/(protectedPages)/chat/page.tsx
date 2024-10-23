"use client"

import { useState, useEffect, useRef } from "react"
import { CompileMdx } from "@/lib/CompileMdx"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: number
  text: string
  sender: "user" | "bot"
}

const initialQuestions = [
  "How are you feeling today?",
  "What made you smile recently?",
  "Is there something bothering you?"
]

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: Message = { id: Date.now(), text: input, sender: "user" };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setIsThinking(true);
      localStorage.setItem("messages", `${messages}`);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input }),
        });

        if (!res.ok) {
          throw new Error("Failed to get response from API");
        }

        const data = await res.json();
        const botResponse: Message = {
          id: Date.now(),
          text: data.response,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsThinking(false);
        localStorage.setItem("messages", `${messages}`)
      } catch (error) {
        console.error("Error:", error);
        const errorMessage: Message = {
          id: Date.now(),
          text: "Failed to get response from LLM",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsThinking(false);
      }
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-gradient-to-b from-blue-100 to-purple-100 overflow-hidden">
      {/* Background animations */}
      <AnimatePresence>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            initial={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              scale: 0,
            }}
            animate={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            exit={{ scale: 0 }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
            }}
          />
        ))}
      </AnimatePresence>

      <h1 className="text-2xl font-bold text-center py-4 text-blue-600">Ask Your Queries</h1>

      {messages.length === 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4 px-4">
          {initialQuestions.map((question, index) => (
            <Button
              key={index}
              onClick={() => handleSend()}
              className="bg-white text-blue-500 hover:bg-blue-100 mt-5"
            >
              {question}
            </Button>
          ))}
        </div>
      )}

      <Card className="flex-grow mx-4 mb-4 overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardContent className="h-full overflow-y-auto p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb - 4`}
              >
                <div className={`flex items - end ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender === "user" ? "/placeholder.svg?height=32&width=32" : "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback>{message.sender === "user" ? "U" : "B"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx - 2 p - 3 rounded - lg ${message.sender === "user" ? "px-1 pt-1 bg-blue-500 text-white" : "bg-white"
                      }`}
                  >
                    <CompileMdx source={message.text} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-4"
            >
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>
      <div className="flex space-x-2 mx-4 mb-4">
        <Textarea
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow resize-none bg-white/80 backdrop-blur-sm"
          rows={2}
        />
        <Button onClick={() => handleSend()} className="bg-blue-500 hover:bg-blue-600 mt-3">
          Send
        </Button>
      </div>
    </div>
  )
}
