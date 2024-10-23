"use client"

import { useEffect, useState } from 'react'
import { getUserResponses } from "@/actions/actions"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const categories = [
  "Stress and Anxiety",
  "Happiness and Well-being",
  "Self-Esteem",
  "Social Connections",
  "Productivity and Motivation"
]

type Timestamp = {
  seconds: number;
  nanoseconds: number;
}

type DataItem = {
  answers: {
    [key: string]: number
  },
  userId: string,
  timestamp: Timestamp
}

const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6']

function parseTimestamp(timestamp: Timestamp): Date {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
}

export default function Component() {
  const { user, loading, logout } = useAuth()
  const [data, setData] = useState<DataItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (user?.uid) {
        try {
          const response = await getUserResponses(user.uid)
          setData(response)
        } catch (err) {
          setError("Failed to fetch data. Please try again later.")
        }
      }
    }
    fetchData()
  }, [user])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  if (!data.length) return <div className="flex justify-center items-center h-screen">No data available</div>

  const processedData = data.map(item => ({
    ...item,
    timestamp: parseTimestamp(item.timestamp).toLocaleDateString(),
    averageScore: Object.values(item.answers).reduce((a, b) => a + b, 0) / categories.length
  })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const latestData = processedData[processedData.length - 1]
  const overallAverageScore = processedData.reduce((sum, item) => sum + item.averageScore, 0) / processedData.length

  const radarData = categories.map((category, index) => ({
    category,
    score: latestData.answers[(index + 1).toString()]
  }))

  const pieData = categories.map((category, index) => ({
    name: category,
    value: latestData.answers[(index + 1).toString()]
  }))

  const chartConfig = {
    ...Object.fromEntries(categories.map((category, index) => [
      category.toLowerCase().replace(/\s+/g, '-'),
      { label: category, color: COLORS[index] }
    ])),
    average: { label: 'Average', color: 'hsl(var(--primary))' }
  }

  return (
    <div className="bg-background min-h-screen">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" passHref>
            <Button variant="ghost">Home</Button>
          </Link>
          <div className="flex space-x-4">
            <Link href="/chat" passHref>
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/take-quiz" passHref>
              <Button variant="ghost">Take Quiz</Button>
            </Link>
            <Link href="/blogs" passHref>
              <Button variant="ghost">Blogs</Button>
            </Link>
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Child Mental Health Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Overall Average Mental Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-center text-primary">{overallAverageScore.toFixed(2)}</div>
              <p className="text-center text-muted-foreground mt-2">Out of 5</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Latest Category Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]" config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trends">Trends Over Time</TabsTrigger>
            <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="trends">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Mental Health Trends</CardTitle>
                <CardDescription>Category scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[400px]" config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis domain={[0, 5]} />
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
                        />
                      ))}
                      <Line
                        type="monotone"
                        dataKey="averageScore"
                        name="Average"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="distribution">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Score Distribution</CardTitle>
                <CardDescription>Latest category score distribution</CardDescription>
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
