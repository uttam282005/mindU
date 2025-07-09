"use client"

import { useEffect, useState, useCallback } from "react"
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
// Helper function to safely parse LLM response
const safeParseLLMResponse = (responseText: string): Response => {
  try {
    // Clean common LLM response issues
    let cleanedResponse = responseText.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\n?|\n?```/g, '');
    
    // Remove any leading/trailing text that might not be JSON
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    
    // Validate the structure
    if (!parsed.feedback || !parsed.tag || !parsed.action) {
      throw new Error('Invalid response structure');
    }
    
    // Validate tag value
    if (!['normal', 'needs help', 'critical'].includes(parsed.tag)) {
      parsed.tag = 'normal'; // fallback
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse LLM response:', error);
    // Return fallback response
    return {
      feedback: "Unable to generate feedback at this time. Please try again.",
      tag: "normal",
      action: "Please review your inputs and try again."
    };
  }
};

export function FeedBack({ scores }: { scores: Record<number, number> }) {
// Main component logic
const [response, setResponse] = useState<Response>({ 
  feedback: "", 
  tag: "normal", 
  action: "" 
});
const [loading, setLoading] = useState(false); // Start with false, only set true when actually loading
const [error, setError] = useState<string | null>(null);

const fetchFeedback = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Validate inputs before making request
    if (!categories || !scores || categories.length === 0) {
      throw new Error('Invalid input data');
    }
    
    const categoryScores: CategoryScores = {};
    categories.forEach((category: string, index: number) => {
      const score = scores[index + 1];
      if (score !== undefined) {
        categoryScores[category] = score;
      }
    });
    
    // Validate that we have some scores
    if (Object.keys(categoryScores).length === 0) {
      throw new Error('No valid scores found');
    }
    
    const res = await fetch("/api/feedback", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryScores),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText || 'Failed to fetch feedback'}`);
    }
    
    const data = await res.json();
    
    // Use safe parsing
    const parsedResponse = safeParseLLMResponse(data.response);
    setResponse(parsedResponse);
    
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    setError(error.message);
    
    // Set fallback response on error
    setResponse({
      feedback: "Unable to generate feedback due to an error.",
      tag: "normal",
      action: "Please try again or contact support if the issue persists."
    });
  } finally {
    setLoading(false);
  }
}, [categories, scores]); // Proper dependencies

// Use useEffect correctly
useEffect(() => {
  // Only fetch if we have valid data
    fetchFeedback();

}, [fetchFeedback]);

// Optional: Add manual retry function
const retryFetch = () => {
  if (!loading) {
    fetchFeedback();
  }
};
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
