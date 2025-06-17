import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Shield,
  LineChart,
  CalendarIcon,
  MessageCircle,
  Bell,
  Lock,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Heart,
} from "lucide-react"
import { Link } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeStatus } from "@/components/theme-status"
import { HormonalChart } from "@/components/hormonal-chart"
import { SymptomsChart } from "@/components/symptoms-chart"
import { InsightsDashboard } from "@/components/insights-dashboard"
import { PeriodCalendar } from "@/components/period-calendar"
import { WaitlistButton } from "@/components/waitlist-button"
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  }

  return (
    <div className="flex flex-col min-h-screen bg-rose-50/30 dark:bg-gray-950">
      {/* Header/Navigation */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm" : "bg-transparent"
          }`}
      >
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="font-bold text-xl">CycleSync</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Features
            </Link>
            <Link to="/privacy-policy" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Terms of Service
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Home
            </Link>
            <Link to="#faq" className="text-sm font-medium hover:text-rose-500 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <Button variant="outline" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            {/* <Button className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700" asChild>
              <Link to="/signup">Get Started</Link>
            </Button> */}
            <WaitlistButton className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700" asChild>
              Get Started Free
            </WaitlistButton>
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-950 border-b"
          >
            <div className="container py-4 px-4 flex flex-col gap-4">
              <Link
                to="#features"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="#privacy"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <Link
                to="#dashboard"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="#faq"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <div className="flex justify-end mb-2">
                  <ModeToggle />
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">Log in</Link>
                </Button>
               <WaitlistButton className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700" asChild>
                  Get Started
             </WaitlistButton>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-white to-rose-100/50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              <motion.div
                className="flex flex-col gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Badge className="w-fit bg-rose-100 text-rose-800 hover:bg-rose-100">Your Health, Your Data</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Track your cycle with confidence and care
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl max-w-[600px]">
                  CycleSync helps you understand your body better with privacy-first menstrual tracking, personalized
                  insights, and comprehensive health analytics.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <WaitlistButton size="lg"
                    className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
                    asChild >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </WaitlistButton>
                  {/* <Button
                    size="lg"
                    className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
                    asChild
                  >
                    <Link to="/login">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button> */}
                  <WaitlistButton size="lg" variant="outline" />


                  {/* <WaitlistButton>Notify Me!</WaitlistButton> */}
                  {/*                   <WaitlistButton size="lg" variant="outline" apiBaseUrl="http://localhost:8000/api">
                    Join Waitlist
                  </WaitlistButton> */}
                  {/* <Button size="lg" variant="outline" asChild>
                    <Link to="#learn-more">Learn More</Link>
                  </Button> */}
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Trusted by <span className="font-medium text-foreground">100+</span> women
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-gradient-to-br from-rose-100 to-rose-50 p-1 rounded-2xl shadow-xl">
                  <div className="rounded-xl overflow-hidden shadow-sm">
                    <HormonalChart />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">End-to-end encrypted</Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute top-1/2 left-0 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-20 -z-10" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-200 rounded-full blur-3xl opacity-20 -z-10" />
        </section>

        {/* Trusted By Section
        <section className="py-12 border-y bg-white/50 dark:bg-gray-900/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-xl font-medium text-muted-foreground">
                Trusted by women's health experts and privacy advocates
              </h2>
              {/* partner section here! */}
        {/* <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 py-6 grayscale opacity-70">
                {["Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5"].map((partner, i) => (
                  <div key={i} className="flex items-center justify-center">
                    <div className="h-8 w-24 rounded bg-slate-100 text-black italic text-center" />
                    <span className="sr-only">{partner}</span>
                  </div>
                ))}
              </div> 
            </div>
          </div>
        </section> */}

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <motion.div
              className="text-center max-w-[800px] mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-100">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Comprehensive tracking with your privacy in mind
              </h2>
              <p className="text-lg text-muted-foreground">
                CycleSync offers a complete suite of tools designed specifically for women's health, all built with a
                security-first architecture.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: <CalendarIcon className="h-6 w-6 text-rose-500" />,
                  title: "Cycle Tracking",
                  description: "Track your period, symptoms, and mood with an intuitive calendar interface.",
                },
                {
                  icon: <LineChart className="h-6 w-6 text-rose-500" />,
                  title: "Hormonal Analytics",
                  description: "Visualize your hormonal patterns and receive personalized insights.",
                },
                {
                  icon: <Bell className="h-6 w-6 text-rose-500" />,
                  title: "Smart Predictions",
                  description: "Get accurate predictions for your next cycle based on your unique patterns.",
                },
                {
                  icon: <Shield className="h-6 w-6 text-rose-500" />,
                  title: "Privacy First",
                  description: "Your data never leaves your device without your explicit permission.",
                },
                {
                  icon: <MessageCircle className="h-6 w-6 text-rose-500" />,
                  title: "Community Support",
                  description: "Connect with others while maintaining your privacy and anonymity.",
                },
                {
                  icon: <Lock className="h-6 w-6 text-rose-500" />,
                  title: "End-to-End Encryption",
                  description: "All your sensitive health data is encrypted and only accessible to you.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="group relative flex flex-col gap-2 p-6 bg-white dark:bg-gray-900 rounded-xl border shadow-sm hover:shadow-md transition-all"
                  variants={fadeIn}
                >
                  <div className="p-2 w-fit rounded-lg bg-rose-50 dark:bg-rose-900/20 mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 pt-4 border-t flex items-center text-rose-500 font-medium">
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Privacy Section */}
        <section
          id="privacy"
          className="py-20 md:py-32 bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950"
        >
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-rose-100 to-purple-100 dark:from-rose-900/20 dark:to-purple-900/20 blur-3xl opacity-30 rounded-full" />
                <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30">
                        <Shield className="h-6 w-6 text-rose-500" />
                      </div>
                      <h3 className="text-xl font-semibold">Privacy Pledge</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        At CycleSync, we believe your health data belongs to you and only you. Our commitment to
                        privacy:
                      </p>
                      <ul className="space-y-2">
                        {[
                          "End-to-end encryption for all sensitive data",
                          "No data sharing with third parties without explicit consent",
                          "Local processing of sensitive information",
                          "Transparent privacy policies with plain language",
                          "Option to delete all your data permanently at any time",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Badge className="w-fit bg-rose-100 text-rose-800 hover:bg-rose-100">Privacy & Security</Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your data stays yours, always</h2>
                <p className="text-lg text-muted-foreground">
                  We've built CycleSync with a security-first architecture that ensures your most sensitive health data
                  remains private, secure, and under your control.
                </p>
                <div className="grid gap-4">
                  {[
                    {
                      title: "Local-first processing",
                      description: "Most data processing happens directly on your device, not our servers.",
                    },
                    {
                      title: "Zero-knowledge architecture",
                      description: "We can't access your encrypted data even if we wanted to.",
                    },
                    {
                      title: "Transparent data practices",
                      description: "Clear information about what data we collect and why.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="#10B981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-fit mt-4 bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
                  asChild
                >
                  <Link to="/privacy-policy">
                    Read our privacy policy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section id="dashboard" className="py-20 md:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <motion.div
              className="text-center max-w-[800px] mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-100">Dashboard</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Powerful insights at your fingertips
              </h2>
              <p className="text-lg text-muted-foreground">
                Our intuitive dashboard gives you a comprehensive view of your cycle, hormonal patterns, and
                personalized health insights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* for all those tabs */}
              <Tabs defaultValue="hormones" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="hormones" >Hormones</TabsTrigger>
                    <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  </TabsList>
                </div>

                <div className="relative mx-auto w-full max-w-2xl">
                  <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-rose-100 to-purple-100 dark:from-rose-900/20 dark:to-purple-900/20 blur-3xl opacity-30 rounded-full " />

                  <TabsContent value="hormones" className="mt-0 " >
                    <HormonalChart />
                  </TabsContent>

                  <TabsContent value="symptoms" className="mt-0">
                    <SymptomsChart />
                  </TabsContent>

                  <TabsContent value="insights" className="mt-0">
                    <InsightsDashboard />
                  </TabsContent>

                  <TabsContent value="calendar" className="mt-0">
                    <PeriodCalendar />
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 bg-rose-50/50 dark:bg-gray-900/50">
          <div className="container px-4 md:px-6">
            <motion.div
              className="text-center max-w-[800px] mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-100">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Loved by women worldwide</h2>
              <p className="text-lg text-muted-foreground">
                Hear from our users about how CycleSync has helped them understand their bodies better.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  quote:
                    "CycleSync has completely changed how I understand my body. The privacy features give me peace of mind that my data is secure.",
                  name: "Anonymized User",
                  title: "Using CycleSync for 2 months",
                },
                {
                  quote:
                    "As someone who values privacy, I appreciate that CycleSync takes data security seriously. The insights are incredibly accurate too!",
                  name: "Anonymized User",
                  title: "Using CycleSync for 5 months",
                },
                {
                  quote:
                    "The hormonal analytics have helped me identify patterns I never noticed before. It's like having a personal health assistant.",
                  name: "Anonymized User",
                  title: "Using CycleSync for 6 months",
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl border shadow-sm"
                  variants={fadeIn}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 1L13 7L19 8L14.5 12.5L16 19L10 16L4 19L5.5 12.5L1 8L7 7L10 1Z" fill="#FFC107" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <motion.div
              className="text-center max-w-[800px] mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-100">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently asked questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about CycleSync and how we protect your data.
              </p>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              {[
                {
                  question: "How does CycleSync protect my privacy?",
                  answer:
                    "CycleSync uses end-to-end encryption for all sensitive data, meaning only you can access your information. We employ a security-first architecture where most data processing happens locally on your device, and we never share your data with third parties without your explicit consent.",
                },
                {
                  question: "Can I export my data from CycleSync?",
                  answer:
                    "Yes, you can export all your data in various formats at any time. Your data belongs to you, and we make it easy for you to access and control it.",
                },
                {
                  question: "How accurate are the cycle predictions?",
                  answer:
                    "Our prediction algorithm improves over time as it learns your unique patterns. Most users report high accuracy after tracking for 2-3 cycles, with predictions becoming increasingly precise the longer you use the app.",
                },
                {
                  question: "Is CycleSync suitable for irregular cycles?",
                  answer:
                    "CycleSync is designed to adapt to your unique patterns, including irregular cycles. The more data you provide, the better our algorithm can identify patterns and provide personalized insights.",
                },
                {
                  question: "Do you offer a free trial?",
                  answer:
                    "Yes, we offer a 30-day free trial with full access to all features. After the trial period, you can continue with a free basic plan or upgrade to our premium plan for advanced features.",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  className="border-b py-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-rose-500 to-purple-600 text-white dark:from-rose-600 dark:to-purple-700">
          <div className="container px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to understand your body better?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of women who are taking control of their menstrual health with privacy and confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button
                  size="lg"
                  className="bg-white text-rose-600 hover:bg-white/90 dark:bg-gray-950 dark:text-rose-500 dark:hover:bg-gray-900"
                  asChild
                >
                  <Link to="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button> */}
                <WaitlistButton size="lg"
                  className="bg-white text-rose-600 hover:bg-white/90 dark:bg-gray-950 dark:text-rose-500 dark:hover:bg-gray-900"
                  asChild >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </WaitlistButton>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm opacity-80">No credit card required. Free 30-day trial.</p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-12 md:py-16 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-rose-500" />
                <span className="font-bold text-xl">CycleSync</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering women with privacy-first menstrual health tracking and personalized insights.
              </p>
              <div className="flex gap-4">
                {["twitter", "instagram", "facebook", "linkedin"].map((social) => (
                  <Link key={social} to={`#${social}`} className="text-muted-foreground hover:text-foreground">
                    <span className="sr-only">{social}</span>
                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                      <div className="h-4 w-4 bg-muted-foreground rounded-sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Testimonials", "FAQ", "Privacy"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`#${item.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Blog", "Careers", "Press", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Terms of Service", "Privacy Policy", "Cookie Policy", "Data Protection", "GDPR Compliance"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        to={`#${item.toLowerCase().replace(" ", "-")}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} CycleSync. All rights reserved.
              </p>
              <ThemeStatus />
            </div>
            <div className="flex gap-8">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
