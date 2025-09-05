"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Brain, PenTool, Star, Heart, Shield, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { logout } from "@/lib/auth"

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="relative"
  >
    {children}
  </motion.div>
)

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.1 })

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
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6 }}
    >
      <Card className="h-full bg-card border-border hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-center">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const Testimonial = ({ name, role, content }: { name: string; role: string; content: string }) => (
  <Card className="h-full bg-card border-border">
    <CardHeader>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-6 leading-relaxed italic">"{content}"</p>
      <div>
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </CardContent>
  </Card>
)

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <Card className="text-center bg-card border-border hover:shadow-md transition-shadow">
    <CardContent className="pt-8 pb-6">
      <p className="text-4xl font-bold text-primary mb-2">{value}</p>
      <p className="text-muted-foreground font-medium">{label}</p>
    </CardContent>
  </Card>
)

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">MindCare</h1>
              </Link>
            </motion.div>

            <nav>
              <motion.ul
                className="flex space-x-6 items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >

                <motion.li>
                  {!user ? (
                    <Link
                      href="/login"
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                    >
                      Sign In
                    </Link>
                  ) : (
                    <button
                      onClick={async () => {
                        await logout()
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                    >
                      Logout
                    </button>
                  )}
                </motion.li>

                <motion.li>
                  {!user && (
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  )}
                </motion.li>
              </motion.ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FloatingElement>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                    Find Your Path to
                    <span className="text-violet-600 dark:text-violet-400 block">Wellness</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                    Your journey to mental wellness starts here. Connect with AI-powered support, track your progress,
                    and discover personalized strategies for better mental health.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => router.push("/evalute")}
                    size="lg"
                    className="bg-violet-600 hover:bg-violet-700 text-white text-lg px-8 py-4"
                  >
                    Start Your Journey
                  </Button>
                </div>

                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-violet-600" />
                    <span className="text-sm text-muted-foreground">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-violet-600" />
                    <span className="text-sm text-muted-foreground">10k+ Users</span>
                  </div>
                </div>
              </div>
            </FloatingElement>

            <FloatingElement delay={0.2}>
              <div className="relative">
                <img src="/nature.png" alt="Peaceful wellness journey" className="rounded-2xl shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent rounded-2xl"></div>
              </div>
            </FloatingElement>
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Comprehensive Mental Health Support
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Discover tools and resources designed to support your mental wellness journey
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MessageSquare}
              title="AI-Powered Support"
              description="Engage in meaningful conversations with our compassionate AI chatbot, available 24/7 to provide support and guidance."
            />
            <FeatureCard
              icon={Brain}
              title="Daily Wellness Check-ins"
              description="Track your mental health journey with personalized daily assessments and insights into your emotional well-being."
            />
            <FeatureCard
              icon={PenTool}
              title="Personalized Recommendations"
              description="Receive tailored exercises, coping strategies, and resources based on your unique needs and progress."
            />
          </div>
        </section>

        <section className="py-20 bg-violet-50/50 dark:bg-violet-950/20 rounded-3xl">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Trusted by Thousands
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="10k+" label="Active Users" />
            <StatCard value="500+" label="Mental Health Professionals" />
            <StatCard value="98%" label="User Satisfaction" />
            <StatCard value="24/7" label="Support Available" />
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-center text-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Stories of Transformation
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Real experiences from our community
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              name="Sarah J."
              role="Student"
              content="MindCare has been a game-changer for my mental health. The daily check-ins and personalized recommendations have helped me develop healthy coping strategies."
            />
            <Testimonial
              name="Michael R."
              role="Working Professional"
              content="The AI support feels genuinely caring and understanding. It's like having a compassionate friend available whenever I need guidance during stressful times."
            />
            <Testimonial
              name="Emily L."
              role="Parent"
              content="As a busy parent, MindCare has given me practical tools to manage stress and prioritize my mental health. The impact on my family has been incredible."
            />
          </div>
        </section>

        <section className="py-20">
          <motion.div
            className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-3xl p-12 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Begin Your Wellness Journey?</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands who have found peace and support through MindCare. Your path to better mental health starts
              with a single step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 text-white text-lg px-8 py-4"
                onClick={() => router.push("/evalute")}
              >
                Start Free Today
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="bg-violet-900 text-violet-50 py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-violet-400" />
                <h4 className="text-xl font-bold">MindCare</h4>
              </div>
              <p className="text-violet-200 leading-relaxed">
                Empowering mental wellness through compassionate technology and evidence-based support.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-violet-200 hover:text-violet-100 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-violet-200 hover:text-violet-100 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 4.041v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.407-.058-4.041-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-violet-200 hover:text-violet-100 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-violet-800 pt-8 text-center">
            <p className="text-violet-200">&copy; 2024 MindCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
