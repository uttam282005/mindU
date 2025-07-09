"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import confetti from 'canvas-confetti'
import { saveResponsesToDb } from "@/actions/actions"
import { useAuth } from "@/context/AuthContext"
import { FeedBack } from "@/components/Feedback"

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
    color: "from-pink-300 to-red-300",
    questions: [
      { id: 1, text: "How relaxed do you feel on a daily basis?" },
      { id: 2, text: "How often do you feel calm and in control?" },
      { id: 3, text: "How well do you manage stressful situations?" },
      { id: 4, text: "How peaceful is your mind throughout the day?" },
      { id: 5, text: "How often do you feel free of anxiety?" },
    ],
  },
  {
    id: 2,
    title: "Happiness and Well-being",
    color: "from-yellow-300 to-green-300",
    questions: [
      { id: 1, text: "How often do you feel genuinely happy?" },
      { id: 2, text: "How much do you enjoy your daily activities?" },
      { id: 3, text: "How often do you feel satisfied with your life?" },
      { id: 4, text: "How well do you sleep, waking up refreshed?" },
      { id: 5, text: "How often do you laugh and enjoy moments with others?" },
    ],
  },
  {
    id: 3,
    title: "Self-Esteem",
    color: "from-blue-300 to-purple-300",
    questions: [
      { id: 1, text: "How confident do you feel about yourself?" },
      { id: 2, text: "How much do you appreciate your personal strengths?" },
      { id: 3, text: "How satisfied are you with your achievements?" },
      { id: 4, text: "How positive is your self-image?" },
      { id: 5, text: "How often do you feel proud of who you are?" },
    ],
  },
  {
    id: 4,
    title: "Social Connections",
    color: "from-indigo-300 to-purple-400",
    questions: [
      { id: 1, text: "How connected do you feel to your friends or family?" },
      { id: 2, text: "How often do you spend quality time with others?" },
      { id: 3, text: "How comfortable are you in social situations?" },
      { id: 4, text: "How often do you reach out to others when you need support?" },
      { id: 5, text: "How fulfilled do your relationships make you feel?" },
    ],
   }, 
  {
    id: 5,
    title: "Productivity and Motivation",
    color: "from-teal-300 to-blue-300",
    questions: [
      { id: 1, text: "How motivated do you feel to complete your tasks?" },
      { id: 2, text: "How often do you achieve the goals you set for yourself?" },
      { id: 3, text: "How productive do you feel during your typical day?" },
      { id: 4, text: "How easily can you focus on tasks without distraction?" },
      { id: 5, text: "How satisfied are you with your daily accomplishments?" },
    ],
  }
]

const numberColors = [
  "from-red-400 to-pink-500",
  "from-orange-400 to-red-500",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-teal-500",
  "from-blue-400 to-indigo-500"
]
interface CategoryScores {
  [key: number]: number;
}
export default function Component() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Record<number, number>>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [categoryScores, setCategoryScores] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const { user, loading } = useAuth();

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

  const handleGetFeeback = () => {
    setShowDetailedFeedback(true);
  }

  const isSetComplete = () => {
    return currentSet.questions.every((q) => answers[currentSet.id]?.[q.id])
  }

  const calculateTotalScore = (answers: Record<number, Record<number, number>>): Record<number, number> => {
    const categoryScores: Record<number, number> = {};

    Object.keys(answers).forEach((categoryId) => {
      const questionScores = answers[parseInt(categoryId)];
      let totalScore = 0;

      Object.keys(questionScores).forEach((questionId) => {
        totalScore += questionScores[parseInt(questionId)];
      });

      categoryScores[parseInt(categoryId)] = Math.round((totalScore / 5) * 10) / 10;
    });

    return categoryScores;
  };

  const handleSubmit = async () => {
    setShowFeedback(true)
    const scores = calculateTotalScore(answers);
    setCategoryScores(scores);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA']
    })
    const res = await saveResponsesToDb(user?.uid!, scores);
    console.log("request send");
    setSubmitted(true);
  }

  const handleTakeMore = () => {
    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex((prev) => prev + 1)
      setShowFeedback(false)
    } else {
      handleSubmit()
    }
  }

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--background', 'hsl(210, 50%, 98%)')
    root.style.setProperty('--foreground', 'hsl(210, 50%, 10%)')
  }, [])

  if (showDetailedFeedback) return (<FeedBack scores={categoryScores} />)

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${currentSet.color} p-4`}>
      <Card className="w-full max-w-2xl shadow-2xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white bg-opacity-90 backdrop-blur-md border-b border-gray-200">
          <CardTitle className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
            How Are You Feeling Today?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-white bg-opacity-95">
          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  {currentSet.title}
                </h2>
                {currentSet.questions.map((question) => (
                  <motion.div
                    key={question.id}
                    className="mb-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: question.id * 0.1 }}
                  >
                    <Label className="text-lg mb-4 block font-medium text-gray-700">{question.text}</Label>
                    <div className="flex justify-between items-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <motion.button
                          key={value}
                          onClick={() => handleAnswer(question.id, value)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer text-xl font-bold transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${answers[currentSet.id]?.[question.id] === value
                            ? 'bg-gradient-to-br text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            } ${answers[currentSet.id]?.[question.id] === value ? numberColors[value - 1] : ''}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {value}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-500 font-medium">
                      <span>Never</span>
                      <span>Always</span>
                    </div>
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
                <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
                  Fantastic job!
                </h2>
                <p className="text-xl mb-6 text-gray-700">You've completed all sections. Here are your scores:</p>
                {questionSets.map((set) => (
                  <div key={set.id} className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{set.title}</h3>
                    <div className="flex items-center">
                      <Progress
                        value={categoryScores[set.id] * 20}
                        className="flex-grow h-4 mr-2"
                        style={{
                          background: `linear-gradient(to right, ${set.color.split(' ')[1]}, ${set.color.split(' ')[3]})`,
                        }}
                      />
                      <span className="text-lg font-medium">{categoryScores[set.id]}/5</span>
                    </div>
                  </div>
                ))}
                <p className="text-lg mt-8 text-gray-600">
                  Remember, all feelings are okay. If something's bothering you, it's great to talk to a grown-up you trust.
                </p>
                <div className="text-6xl mt-6 animate-bounce">🌟</div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between bg-white bg-opacity-90 backdrop-blur-md border-t border-gray-200">
          <div className="text-center w-full">
            <Progress
              value={(currentSetIndex + 1) / totalSets * 100}
              className="w-full mb-4 h-3 bg-gray-200 rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(to right, #4CAF50, #2196F3, #9C27B0)',
                transition: 'width 0.5s ease-in-out'
              }}
            />
            <p className="text-sm text-gray-600 mb-4">
              Set {currentSetIndex + 1} of {totalSets}
            </p>
            <div className="flex justify-center space-x-4">
              {currentSetIndex === totalSets - 1 ? submitted ? (
                <Button
                  onClick={handleGetFeeback}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get Feedback
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isSetComplete() || showFeedback}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  See Results
                </Button>
              ) : (
                <Button
                  onClick={handleTakeMore}
                  disabled={!isSetComplete()}
                  className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Next Set
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div >
  )
}
