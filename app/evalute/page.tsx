"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import confetti from 'canvas-confetti'

type Question = {
  id: number
  text: string
}

type QuestionSet = {
  id: number
  title: string
  questions: Question[]
  color: string
}

const questionSets: QuestionSet[] = [
  {
    id: 1,
    title: "Stress and Anxiety",
    color: "from-pink-300 to-purple-300",
    questions: [
      { id: 1, text: "How often do you feel stressed about school or personal life?" },
      { id: 2, text: "How well are you able to manage stress when it comes?" },
      { id: 3, text: "How often do you find it hard to relax or calm your mind?" },
      { id: 4, text: "How often do you get headaches or feel tired because of stress?" },
      { id: 5, text: "How often do you feel nervous in social situations or public places?" },
    ],
  },
  {
    id: 2,
    title: "Happiness and Well-being",
    color: "from-yellow-300 to-green-300",
    questions: [
      { id: 1, text: "How often do you feel happy and content?" },
      { id: 2, text: "How much do you enjoy your favorite activities?" },
      { id: 3, text: "How often do you feel proud of yourself?" },
      { id: 4, text: "How well do you sleep at night?" },
      { id: 5, text: "How often do you laugh and have fun with friends or family?" },
    ],
  },
  {
    id: 3,
    title: "Emotional State and Resilience",
    color: "from-blue-300 to-indigo-300",
    questions: [
      { id: 1, text: "How often do you feel overwhelmed by emotions?" },
      { id: 2, text: "How often do you experience feelings of sadness or hopelessness?" },
      { id: 3, text: "How well do you manage stress when it arises?" },
      { id: 4, text: "How often do you feel at peace or content with yourself?" },
      { id: 5, text: "How confident are you in your ability to handle challenges?" },
    ],
  },
  {
    id: 4,
    title: "Social Connections and Support",
    color: "from-purple-300 to-pink-300",
    questions: [
      { id: 1, text: "How often do you feel supported by friends or family?" },
      { id: 2, text: "How often do you feel lonely or isolated?" },
      { id: 3, text: "How comfortable are you sharing personal thoughts and feelings?" },
      { id: 4, text: "How often do you feel disconnected from those around you?" },
      { id: 5, text: "How often do you seek support when feeling stressed or down?" },
    ],
  },
  {
    id: 5,
    title: "Productivity and Motivation",
    color: "from-green-300 to-teal-300",
    questions: [
      { id: 1, text: "How often do you feel motivated to complete daily tasks?" },
      { id: 2, text: "How well do you concentrate on your work or personal projects?" },
      { id: 3, text: "How satisfied are you with what you accomplish in a day?" },
      { id: 4, text: "How often do you procrastinate or avoid tasks?" },
      { id: 5, text: "How often do you feel productive and engaged in activities?" },
    ],
  },
]

const emojis = ["😢", "😕", "😐", "🙂", "😄"]

export default function Component() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Record<number, number>>>({})
  const [showFeedback, setShowFeedback] = useState(false)

  const currentSet = questionSets[currentSetIndex]
  const totalSets = questionSets.length

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentSet.id]: {
        ...(prev[currentSet.id] || {}),
        [questionId]: value,
      },
    }))
  }

  const isSetComplete = () => {
    return currentSet.questions.every((q) => answers[currentSet.id]?.[q.id])
  }

  const handleGetFeedback = () => {
    setShowFeedback(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA']
    })
  }

  const handleTakeMore = () => {
    setCurrentSetIndex((prev) => (prev + 1) % totalSets)
    setShowFeedback(false)
  }

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--background', 'hsl(210, 50%, 98%)')
    root.style.setProperty('--foreground', 'hsl(210, 50%, 10%)')
  }, [])

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${currentSet.color} p-4`}>
      <Card className="w-full max-w-2xl shadow-lg overflow-hidden">
        <CardHeader className="bg-white bg-opacity-80 backdrop-blur-md">
          <CardTitle className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
            How Are You Feeling Today?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white bg-opacity-90">
          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                  {currentSet.title}
                </h2>
                {currentSet.questions.map((question) => (
                  <motion.div
                    key={question.id}
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: question.id * 0.1 }}
                  >
                    <Label className="text-lg mb-3 block font-medium text-gray-700">{question.text}</Label>
                    <RadioGroup
                      onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
                      value={answers[currentSet.id]?.[question.id]?.toString()}
                      className="flex justify-between"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center">
                          <RadioGroupItem value={value.toString()} id={`q${question.id}-${value}`} className="sr-only" />
                          <Label
                            htmlFor={`q${question.id}-${value}`}
                            className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-3xl transform hover:scale-110"
                          >
                            {emojis[value - 1]}
                          </Label>
                          <span className="text-xs mt-1 font-medium">
                            {value === 1 ? "Never" : value === 5 ? "Always" : ""}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  Fantastic job!
                </h2>
                <p className="text-xl mb-4 text-gray-700">You've completed the "{currentSet.title}" section.</p>
                <p className="text-lg mb-6 text-gray-600">
                  Remember, all feelings are okay. If something's bothering you, it's great to talk to a grown-up you trust.
                </p>
                <div className="text-6xl mb-4 animate-bounce">🌟</div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between bg-white bg-opacity-80 backdrop-blur-md">
          <div className="text-center w-full">
            <Progress
              value={(currentSetIndex + 1) / totalSets * 100}
              className="w-full mb-4 h-3 bg-gray-200"
              style={{
                background: 'linear-gradient(to right, #4CAF50, #2196F3, #9C27B0)',
                transition: 'width 0.5s ease-in-out'
              }}
            />
            <p className="text-sm text-gray-600 mb-4">
              Set {currentSetIndex + 1} of {totalSets}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleGetFeedback}
                disabled={!isSetComplete() || showFeedback}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Get Feedback
              </Button>
              <Button
                onClick={handleTakeMore}
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Take More
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
