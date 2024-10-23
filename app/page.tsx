"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MessageSquare, Brain, PenTool, Star } from 'lucide-react'

const Bubble = ({ size, duration, delay }: { size: string, duration: number, delay: number }) => (
  <motion.div
    className="absolute rounded-full bg-white opacity-20"
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  />
)

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader>
          <Icon className="w-12 h-12 mb-4 text-[#805ad5]" />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const Testimonial = ({ name, role, content }: { name: string, role: string, content: string }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Star className="w-5 h-5 text-yellow-400 mr-2" />
        <Star className="w-5 h-5 text-yellow-400 mr-2" />
        <Star className="w-5 h-5 text-yellow-400 mr-2" />
        <Star className="w-5 h-5 text-yellow-400 mr-2" />
        <Star className="w-5 h-5 text-yellow-400" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 mb-4">{content}</p>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </CardContent>
  </Card>
)

const StatCard = ({ value, label }: { value: string, label: string }) => (
  <Card className="text-center">
    <CardContent className="pt-6">
      <p className="text-4xl font-bold text-[#805ad5] mb-2">{value}</p>
      <p className="text-gray-600">{label}</p>
    </CardContent>
  </Card>
)

interface Bubble {
  id: number;
  size: string;
  duration: number;
  delay: number;
}

export default function LandingPage() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const newBubbles: Bubble[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: `${Math.random() * 40 + 10}px`,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));
    setBubbles(newBubbles);
  }, [])

  return (
    <div className="min-h-screen bg-[#f0f8ff] relative overflow-hidden">
      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} {...bubble} />
      ))}

      {/* Background Shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[#e6f3ff] opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#e6f3ff] opacity-50"></div>
      <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-[#a78bfa] opacity-20"></div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.h1 
          className="text-3xl font-bold text-[#a78bfa]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          MindCare
        </motion.h1>
        <nav>
          <motion.ul 
            className="flex space-x-4 items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <motion.li><Button variant="ghost" className="text-gray-600 hover:text-gray-900">About Us</Button></motion.li>
            <motion.li><Button variant="outline" className="bg-[#e9d8fd] text-[#805ad5] border-[#805ad5] hover:bg-[#805ad5] hover:text-white">Sign In</Button></motion.li>
            <motion.li><Button className="bg-[#805ad5] text-white hover:bg-[#6b46c1]">Sign Up</Button></motion.li>
          </motion.ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-20">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Find Peace of Mind</h2>
          <p className="text-xl text-gray-600 mb-8">Your journey to mental wellness starts here</p>
          <Button size="lg" className="bg-[#805ad5] text-white hover:bg-[#6b46c1] text-lg px-8 py-3 rounded-full">
            Get Relief Now
          </Button>
        </motion.div>

        {/* Features Section */}
        <section className="mt-32">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MessageSquare}
              title="AI Chatbot"
              description="Engage in supportive conversations with our AI-powered mental health chatbot."
            />
            <FeatureCard
              icon={Brain}
              title="Daily Mental Health Quiz"
              description="Take daily quizzes to track and improve your mental well-being."
            />
            <FeatureCard
              icon={PenTool}
              title="Personalized AI Recommendations"
              description="Receive tailored suggestions and exercises based on your unique needs."
            />
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mt-32">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            MindCare in Numbers
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard value="10k+" label="Active Users" />
            <StatCard value="500+" label="Mental Health Professionals" />
            <StatCard value="98%" label="User Satisfaction" />
            <StatCard value="24/7" label="Support Available" />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-32">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              name="Sarah J."
              role="Student"
              content="MindCare has been a game-changer for my mental health. The daily quizzes and personalized recommendations have helped me stay on track and improve my well-being."
            />
            <Testimonial
              name="Michael R."
              role="Working Professional"
              content="The AI chatbot is like having a supportive friend available 24/7. It's been incredibly helpful during stressful times at work."
            />
            <Testimonial
              name="Emily L."
              role="Parent"
              content="As a busy parent, MindCare has given me the tools to manage my stress and be a better role model for my kids. Highly recommended!"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-32">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is MindCare suitable for everyone?</AccordionTrigger>
              <AccordionContent>
                Yes, MindCare is designed to support individuals of all ages and backgrounds. However, it's not a substitute for professional medical advice or treatment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does the AI chatbot work?</AccordionTrigger>
              <AccordionContent>
                Our AI chatbot uses advanced natural language processing to understand your concerns and provide supportive responses. It's trained on a wide range of mental health topics but does not replace human therapists.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my data kept confidential?</AccordionTrigger>
              <AccordionContent>
                Absolutely. We take your privacy seriously. All personal data is encrypted and stored securely. We never share your information with third parties without your explicit consent.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Helpful Resources Section */}
        <motion.div 
          className="mt-32 bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Helpful Resources</h3>
          <p className="text-gray-600 mb-4">Access our library of mental wellness resources</p>
          <Link href="/resources" className="text-[#805ad5] hover:underline">
            View Resources →
          </Link>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#a78bfa] rounded-full opacity-20"></div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-32 bg-[#805ad5] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">MindCare</h4>
              <p className="text-sm">Empowering mental wellness through technology and compassion.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm hover:underline">About Us</Link></li>
                <li><Link href="/features" className="text-sm hover:underline">Features</Link></li>
                <li><Link href="/pricing" className="text-sm hover:underline">Pricing</Link></li>
                <li><Link href="/contact" className="text-sm hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm hover:underline">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-sm hover:underline">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-200">
                  <span className="sr-only">Facebook</span>
                  <svg  className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-200">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8 text-center">
            <p className="text-sm">&copy; 2024 MindCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}