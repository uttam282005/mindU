"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Lightbulb, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const categories = [
  "Stress and Anxiety",
  "Happiness and Well-being",
  "Self-Esteem",
  "Social Connections",
  "Productivity and Motivation"
]

interface Response {
  tag: string
  feedback: string
  action: string
}

interface CategoryScores {
  [key: string]: number
}

const categoryColors = [
  "from-red-500 to-orange-500",
  "from-green-500 to-teal-500",
  "from-purple-500 to-indigo-500",
  "from-yellow-500 to-amber-500",
  "from-blue-500 to-cyan-500"
]

export function FeedBack({ scores }: { scores: Record<number, number> }) {
  const [response, setResponse] = useState<Response>({ feedback: "", tag: "", action: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      setError(null)
      const categoryScores: CategoryScores = {}

      categories.forEach((category: string, index: number) => {
        categoryScores[category] = scores[index + 1]
      })

      const res = await fetch("/api/feedback", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryScores),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch feedback")
      }

      const data = await res.json()
      setResponse(JSON.parse(data.response))
    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Your Mental Health Insights</h2>
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className={`bg-gradient-to-r ${categoryColors[index]} p-4 rounded-t-lg`}>
                <CardTitle className="text-white text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Score</span>
                  <span className="text-lg font-bold text-gray-700">{scores[index + 1]}/5</span>
                </div>
                <Progress value={scores[index + 1] * 20} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-semibold text-gray-800">
              <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
              AI-Generated Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : error ? (
              <div className="flex items-center text-red-500">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-blue-500" />
                    Overall Assessment
                  </h3>
                  <Badge variant="outline" className="text-sm font-medium">
                    {response.tag}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Feedback
                  </h3>
                  <p className="text-gray-700">{response.feedback}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                    Suggested Actions
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {response.action.split('. ').map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.p
        className="text-center text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        Remember, this feedback is generated by AI and should not replace professional medical advice.
        If you have concerns about your mental health, please consult a healthcare professional.
      </motion.p>
    </div>
  )
}
