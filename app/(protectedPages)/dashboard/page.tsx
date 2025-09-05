"use client"

import { useEffect, useState } from "react"
import { getUserResponses } from "@/actions/actions"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, TrendingUp, Brain, Heart, Users, Zap, Star } from "lucide-react"
import Link from "next/link"

const categories = [
  "Stress and Anxiety",
  "Happiness and Well-being",
  "Self-Esteem",
  "Social Connections",
  "Productivity and Motivation",
]

const categoryIcons = [AlertCircle, Heart, Star, Users, Zap]

type Timestamp = {
  seconds: number
  nanoseconds: number
}

type DataItem = {
  answers: {
    [key: string]: number
  }
  userId: string
  timestamp: Timestamp
}

const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]

function parseTimestamp(timestamp: Timestamp): Date {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Skeleton className="h-12 w-96 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}

function getScoreInterpretation(score: number): { label: string; color: string } {
  if (score >= 4.5) return { label: "Excellent", color: "bg-green-100 text-green-800" }
  if (score >= 3.5) return { label: "Good", color: "bg-blue-100 text-blue-800" }
  if (score >= 2.5) return { label: "Fair", color: "bg-yellow-100 text-yellow-800" }
  if (score >= 1.5) return { label: "Needs Attention", color: "bg-orange-100 text-orange-800" }
  return { label: "Critical", color: "bg-red-100 text-red-800" }
}

export default function Component() {
  const { user, loading: authLoading, logout } = useAuth()
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (user?.uid) {
        try {
          setLoading(true)
          const response = await getUserResponses(user.uid)
          setData(response)
        } catch (err) {
          setError("Failed to fetch data. Please try again later.")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [user])

  if (authLoading || loading) return <DashboardSkeleton />

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <div className="text-xl text-red-600 font-semibold">{error}</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )

  if (!data.length)
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Brain className="h-16 w-16 text-violet-500" />
        <div className="text-xl text-gray-600 font-semibold">No mental health data available</div>
        <p className="text-gray-500 text-center max-w-md">
          Start tracking your mental health by completing your first assessment.
        </p>
        <Button asChild className="bg-violet-600 hover:bg-violet-700">
          <Link href="/evalute">Take Assessment</Link>
        </Button>
      </div>
    )

  const processedData = data
    .map((item) => ({
      ...item,
      timestamp: parseTimestamp(item.timestamp).toLocaleDateString(),
      averageScore: Object.values(item.answers).reduce((a, b) => a + b, 0) / categories.length,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const latestData = processedData[processedData.length - 1]
  const overallAverageScore = processedData.reduce((sum, item) => sum + item.averageScore, 0) / processedData.length
  const scoreInterpretation = getScoreInterpretation(overallAverageScore)

  const radarData = categories.map((category, index) => ({
    category,
    score: latestData.answers[(index + 1).toString()],
  }))

  const pieData = categories.map((category, index) => ({
    name: category,
    value: latestData.answers[(index + 1).toString()],
  }))

  const chartConfig = {
    ...Object.fromEntries(
      categories.map((category, index) => [
        category.toLowerCase().replace(/\s+/g, "-"),
        { label: category, color: COLORS[index] },
      ]),
    ),
    average: { label: "Average", color: "rgb(139, 92, 246)" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">

      <div className="container mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-violet-200 bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{overallAverageScore.toFixed(1)}</div>
              <div className="flex items-center justify-between">
                <span className="text-violet-100">Out of 5.0</span>
                <Badge className={`${scoreInterpretation.color} border-0`}>{scoreInterpretation.label}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-violet-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-violet-600" />
                Assessments Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 mb-2">{data.length}</div>
              <p className="text-sm text-gray-600">Total completed assessments</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-violet-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-violet-600" />
                Latest Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-600 mb-2">{latestData.timestamp}</div>
              <p className="text-sm text-gray-600">Most recent check-in</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-violet-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Latest Category Scores</CardTitle>
            <CardDescription>Your most recent mental health assessment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {categories.map((category, index) => {
                  const Icon = categoryIcons[index]
                  const score = latestData.answers[(index + 1).toString()]
                  const interpretation = getScoreInterpretation(score)
                  return (
                    <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-violet-50">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-violet-600" />
                        <span className="font-medium text-gray-700">{category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-violet-600">{score.toFixed(1)}</span>
                        <Badge className={`${interpretation.color} text-xs`}>{interpretation.label}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-center">
                <ChartContainer className="h-[300px] w-full" config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="category" className="text-xs fill-gray-600" />
                      <PolarRadiusAxis domain={[0, 5]} className="text-xs fill-gray-400" />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="rgb(139, 92, 246)"
                        fill="rgb(139, 92, 246)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-violet-100">
            <TabsTrigger value="trends" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Trends Over Time
            </TabsTrigger>
            <TabsTrigger
              value="distribution"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              Score Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card className="shadow-lg border-violet-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Mental Health Trends</CardTitle>
                <CardDescription>Track your progress across different categories over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[400px]" config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="timestamp" className="text-xs fill-gray-600" />
                      <YAxis domain={[0, 5]} className="text-xs fill-gray-600" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      {categories.map((category, index) => (
                        <Line
                          key={category}
                          type="monotone"
                          dataKey={`answers.${index + 1}`}
                          name={category}
                          stroke={COLORS[index]}
                          strokeWidth={2}
                          dot={{ fill: COLORS[index], strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: COLORS[index], strokeWidth: 2 }}
                        />
                      ))}
                      <Line
                        type="monotone"
                        dataKey="averageScore"
                        name="Average"
                        stroke="rgb(139, 92, 246)"
                        strokeWidth={3}
                        dot={{ fill: "rgb(139, 92, 246)", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: "rgb(139, 92, 246)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <Card className="shadow-lg border-violet-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Score Distribution</CardTitle>
                <CardDescription>Latest category score distribution breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[400px]" config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
