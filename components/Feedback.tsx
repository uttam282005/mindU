"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Lightbulb, Tag, Brain, Heart, Users, Zap, Smile } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const categories = [
  "Stress and Anxiety",
  "Happiness and Well-being",
  "Self-Esteem",
  "Social Connections",
  "Productivity and Motivation",
]

const categoryIcons = [Brain, Smile, Heart, Users, Zap]
const categoryColors = [
  "from-violet-500 to-purple-600",
  "from-violet-400 to-indigo-500",
  "from-purple-500 to-violet-600",
  "from-indigo-500 to-violet-500",
  "from-violet-600 to-purple-700",
]

interface Response {
  tag: string
  feedback: string
  action: string
}

interface CategoryScores {
  [key: string]: number
}

// Helper function to safely parse LLM response
const safeParseLLMResponse = (responseText: string): Response => {
  try {
    // Clean common LLM response issues
    let cleanedResponse = responseText.trim()

    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\n?|\n?```/g, "")

    // Remove any leading/trailing text that might not be JSON
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0]
    }

    const parsed = JSON.parse(cleanedResponse)

    // Validate the structure
    if (!parsed.feedback || !parsed.tag || !parsed.action) {
      throw new Error("Invalid response structure")
    }

    // Validate tag value
    if (!["normal", "needs help", "critical"].includes(parsed.tag)) {
      parsed.tag = "normal" // fallback
    }

    return parsed
  } catch (error) {
    console.error("Failed to parse LLM response:", error)
    // Return fallback response
    return {
      feedback: "Unable to generate feedback at this time. Please try again.",
      tag: "normal",
      action: "Please review your inputs and try again.",
    }
  }
}

export function FeedBack({ scores }: { scores: Record<number, number> }) {
  // Main component logic
  const [response, setResponse] = useState<Response>({
    feedback: "",
    tag: "normal",
    action: "",
  })
  const [loading, setLoading] = useState(false) // Start with false, only set true when actually loading
  const [error, setError] = useState<string | null>(null)

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Validate inputs before making request
      if (!categories || !scores || categories.length === 0) {
        throw new Error("Invalid input data")
      }

      const categoryScores: CategoryScores = {}
      categories.forEach((category: string, index: number) => {
        const score = scores[index + 1]
        if (score !== undefined) {
          categoryScores[category] = score
        }
      })

      // Validate that we have some scores
      if (Object.keys(categoryScores).length === 0) {
        throw new Error("No valid scores found")
      }

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryScores),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errorText || "Failed to fetch feedback"}`)
      }

      const data = await res.json()

      // Use safe parsing
      const parsedResponse = safeParseLLMResponse(data.response)
      setResponse(parsedResponse)
    } catch (error: any) {
      console.error("Error fetching feedback:", error)
      setError(error.message)

      // Set fallback response on error
      setResponse({
        feedback: "Unable to generate feedback due to an error.",
        tag: "normal",
        action: "Please try again or contact support if the issue persists.",
      })
    } finally {
      setLoading(false)
    }
  }, [categories, scores]) // Proper dependencies

  // Use useEffect correctly
  useEffect(() => {
    // Only fetch if we have valid data
    fetchFeedback()
  }, [fetchFeedback])

  // Optional: Add manual retry function
  const retryFetch = () => {
    if (!loading) {
      fetchFeedback()
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Mental Health Insights
          </h2>
          <p className="text-gray-600 text-lg">Understanding your well-being across key areas</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[index]
            const score = scores[index + 1] || 0
            const percentage = score * 20

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-violet-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className={`bg-gradient-to-r ${categoryColors[index]} p-6`}>
                    <CardTitle className="text-white text-lg flex items-center gap-3">
                      <IconComponent className="w-6 h-6" />
                      <span className="text-balance">{category}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">Your Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-violet-600">{score}</span>
                        <span className="text-gray-400">/5</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-3 bg-violet-100" />
                    <div className="mt-2 text-right">
                      <Badge
                        variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}
                        className={percentage >= 80 ? "bg-violet-500" : ""}
                      >
                        {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Attention"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 border-violet-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
              <CardTitle className="flex items-center text-2xl font-semibold">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Lightbulb className="w-6 h-6" />
                </div>
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {loading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-violet-100 rounded-full animate-pulse" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center p-8 text-red-500 bg-red-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-medium">Unable to generate insights</p>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Overall Assessment</h3>
                      <Badge
                        variant={
                          response.tag === "critical"
                            ? "destructive"
                            : response.tag === "needs help"
                              ? "secondary"
                              : "default"
                        }
                        className={response.tag === "normal" ? "bg-violet-500" : ""}
                      >
                        {response.tag === "critical"
                          ? "Needs Immediate Attention"
                          : response.tag === "needs help"
                            ? "Could Use Support"
                            : "Doing Well"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-lg">
                      <Lightbulb className="w-6 h-6 mr-3 text-violet-500" />
                      Personalized Feedback
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-balance">{response.feedback}</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                      <CheckCircle2 className="w-6 h-6 mr-3 text-green-500" />
                      Recommended Actions
                    </h3>
                    <ul className="space-y-3">
                      {response.action
                        .split(". ")
                        .filter((action) => action.trim())
                        .map((action, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <span className="text-green-600 text-sm font-medium">{index + 1}</span>
                            </div>
                            <span className="text-gray-700 leading-relaxed">{action.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 border border-amber-200 rounded-full">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-amber-800 text-sm font-medium">
              AI-generated insights • Not a substitute for professional medical advice
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
