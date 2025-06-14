
import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Heart,
  Menu,
  X,
  Shield,
  User,
  AlertTriangle,
  CheckCircle,
  Scale,
  Gavel,
  Calendar,
  BookOpen,
  Trash2,
  RefreshCw,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ModeToggle as ThemeToggle } from "@/components/mode-toggle"
import { Link } from 'react-router-dom'

export default function TermsOfServicePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for sticky header
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    })
  }

  // const fadeIn = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.6 },
  //   },
  // }

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
            <Link to="/#features" className="text-sm font-medium hover:text-rose-500 transition-colors">
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
            <Link to="/#faq" className="text-sm font-medium hover:text-rose-500 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
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
                to="/#features"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/#privacy"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <Link
                to="/#dashboard"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/#faq"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <div className="flex justify-end mb-2">
                  <ThemeToggle />
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
                  asChild
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white to-rose-100/50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-100">Legal</Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Please read these terms carefully before using CycleSync. By using our service, you agree to be bound by
                these terms.
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-0 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-20 -z-10" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-200 rounded-full blur-3xl opacity-20 -z-10" />
        </section>

        {/* Navigation Tabs */}
        <section className="py-8 bg-white dark:bg-gray-950 border-b">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="terms" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="terms">Terms of Service</TabsTrigger>
                  <TabsTrigger value="privacy">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="terms" className="space-y-12">
                {/* Introduction */}
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30">
                      <FileText className="h-6 w-6 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Terms of Service</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">Last updated: June 13, 2025</p>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      These Terms of Service ("Terms") govern your access to and use of the CycleSync application and
                      website (the "Service") operated by CycleSync Inc. ("we", "us", or "our").
                    </p>
                    <p>
                      By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any
                      part of the Terms, you may not access the Service.
                    </p>
                  </div>
                </div>

                {/* Terms Sections */}
                <div className="max-w-3xl mx-auto">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-rose-500" />
                          <span>1. Account Terms</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">1.1 Account Creation</h4>
                        <p>
                          To use certain features of the Service, you must create an account. When you create an
                          account, you must provide accurate and complete information. You are solely responsible for
                          the activity that occurs on your account, and you must keep your account password secure.
                        </p>

                        <h4 className="font-medium text-foreground">1.2 Account Requirements</h4>
                        <p>
                          You must be at least 13 years old to create an account. By creating an account, you represent
                          and warrant that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>You are at least 13 years of age</li>
                          <li>
                            If you are under 18 years of age, you have the consent of a parent or guardian to use the
                            Service
                          </li>
                          <li>
                            You will not use the Service for any purpose that is unlawful or prohibited by these Terms
                          </li>
                        </ul>

                        <h4 className="font-medium text-foreground">1.3 Account Security</h4>
                        <p>
                          You are responsible for safeguarding the password that you use to access the Service and for
                          any activities or actions under your password. We encourage you to use "strong" passwords
                          (passwords that use a combination of upper and lower case letters, numbers, and symbols) with
                          your account.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-rose-500" />
                          <span>2. Service Usage</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">2.1 License to Use</h4>
                        <p>
                          CycleSync grants you a personal, worldwide, royalty-free, non-assignable, non-exclusive
                          license to use the software provided to you as part of the Service. This license is for the
                          sole purpose of enabling you to use and enjoy the benefit of the Service as provided by
                          CycleSync, in the manner permitted by these Terms.
                        </p>

                        <h4 className="font-medium text-foreground">2.2 Usage Restrictions</h4>
                        <p>You agree not to engage in any of the following prohibited activities:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            Copying, distributing, or disclosing any part of the Service in any medium, including by any
                            automated or non-automated "scraping"
                          </li>
                          <li>
                            Using any automated system, including "robots," "spiders," "offline readers," etc., to
                            access the Service
                          </li>
                          <li>
                            Attempting to interfere with, compromise the system integrity or security, or decipher any
                            transmissions to or from the servers running the Service
                          </li>
                          <li>
                            Taking any action that imposes, or may impose, an unreasonable or disproportionately large
                            load on our infrastructure
                          </li>
                          <li>Uploading invalid data, viruses, worms, or other software agents through the Service</li>
                          <li>
                            Impersonating another person or otherwise misrepresenting your affiliation with a person or
                            entity
                          </li>
                          <li>
                            Violating any applicable law or regulation in connection with your access to or use of the
                            Service
                          </li>
                        </ul>

                        <h4 className="font-medium text-foreground">2.3 Service Modifications</h4>
                        <p>
                          We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any
                          part thereof) with or without notice. You agree that CycleSync shall not be liable to you or
                          to any third party for any modification, suspension, or discontinuance of the Service.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-rose-500" />
                          <span>3. User Content and Data</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">3.1 User Content</h4>
                        <p>
                          The Service allows you to input, store, and share certain information, including personal
                          health data ("User Content"). You retain all rights in and to your User Content. By providing
                          User Content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to
                          use, process, and store your User Content solely for the purpose of providing the Service to
                          you.
                        </p>

                        <h4 className="font-medium text-foreground">3.2 Data Privacy</h4>
                        <p>
                          Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms,
                          explains how we collect, use, and protect your personal information. By using the Service, you
                          agree to our collection, use, and disclosure practices as described in our Privacy Policy.
                        </p>

                        <h4 className="font-medium text-foreground">3.3 Data Accuracy</h4>
                        <p>
                          You are solely responsible for the accuracy and completeness of your User Content. While we
                          strive to protect your User Content, we cannot guarantee that it will always be secure or
                          error-free. You should maintain backup copies of any important User Content.
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            Important Note
                          </h4>
                          <p className="mt-2">
                            CycleSync is not intended to provide medical advice, diagnosis, or treatment. Always seek
                            the advice of your physician or other qualified health provider with any questions you may
                            have regarding a medical condition.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-rose-500" />
                          <span>4. Intellectual Property</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">4.1 CycleSync Property</h4>
                        <p>
                          The Service and its original content (excluding User Content), features, and functionality are
                          and will remain the exclusive property of CycleSync and its licensors. The Service is
                          protected by copyright, trademark, and other laws of both the United States and foreign
                          countries. Our trademarks and trade dress may not be used in connection with any product or
                          service without the prior written consent of CycleSync.
                        </p>

                        <h4 className="font-medium text-foreground">4.2 Feedback</h4>
                        <p>
                          If you provide us with any feedback or suggestions regarding the Service ("Feedback"), you
                          hereby assign to us all rights in such Feedback and agree that we shall have the right to use
                          and fully exploit such Feedback in any manner we deem appropriate. We will treat any Feedback
                          you provide to us as non-confidential and non-proprietary.
                        </p>

                        <h4 className="font-medium text-foreground">4.3 Third-Party Materials</h4>
                        <p>
                          The Service may contain links to third-party websites, services, or other content that are not
                          owned or controlled by CycleSync. We have no control over, and assume no responsibility for,
                          the content, privacy policies, or practices of any third-party websites or services. You
                          acknowledge and agree that CycleSync shall not be responsible or liable for any damage or loss
                          caused by or in connection with the use of any such third-party content.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-rose-500" />
                          <span>5. Disclaimers and Limitations</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">5.1 Disclaimer of Warranties</h4>
                        <p className="uppercase font-medium">
                          THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY
                          KIND, EITHER EXPRESS OR IMPLIED.
                        </p>
                        <p>
                          TO THE FULLEST EXTENT PERMITTED BY LAW, CYCLESYNC DISCLAIMS ALL WARRANTIES, EXPRESS OR
                          IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                          PARTICULAR PURPOSE, AND NON-INFRINGEMENT. CYCLESYNC DOES NOT WARRANT THAT THE SERVICE WILL BE
                          UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR
                          THE SERVERS THAT MAKE THE SERVICE AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                        </p>

                        <h4 className="font-medium text-foreground">5.2 Medical Disclaimer</h4>
                        <p>
                          CYCLESYNC IS NOT A MEDICAL DEVICE AND IS NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY
                          DISEASE. THE SERVICE IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR
                          TREATMENT. ALWAYS SEEK THE ADVICE OF YOUR PHYSICIAN OR OTHER QUALIFIED HEALTH PROVIDER WITH
                          ANY QUESTIONS YOU MAY HAVE REGARDING A MEDICAL CONDITION.
                        </p>

                        <h4 className="font-medium text-foreground">5.3 Limitation of Liability</h4>
                        <p>
                          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CYCLESYNC, ITS
                          AFFILIATES, DIRECTORS, EMPLOYEES, OR LICENSORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
                          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS,
                          DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE;</li>
                          <li>
                            ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE, INCLUDING WITHOUT LIMITATION, ANY
                            DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES;
                          </li>
                          <li>ANY CONTENT OBTAINED FROM THE SERVICE; OR</li>
                          <li>
                            UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON
                            WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT
                            WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
                          </li>
                        </ul>
                        <p>
                          IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT PAID BY YOU, IF
                          ANY, FOR ACCESSING OR USING THE SERVICE DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-5 w-5 text-rose-500" />
                          <span>6. Termination</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">6.1 Termination by You</h4>
                        <p>
                          You may terminate your account at any time by following the instructions in the Service or by
                          contacting us at support@cyclesync.com. Upon termination, your right to use the Service will
                          immediately cease.
                        </p>

                        <h4 className="font-medium text-foreground">6.2 Termination by CycleSync</h4>
                        <p>
                          We may terminate or suspend your account and access to the Service immediately, without prior
                          notice or liability, for any reason whatsoever, including without limitation if you breach
                          these Terms.
                        </p>

                        <h4 className="font-medium text-foreground">6.3 Effect of Termination</h4>
                        <p>
                          Upon termination, your right to use the Service will immediately cease. If you wish to
                          terminate your account, you may simply discontinue using the Service or follow the
                          instructions for account deletion within the Service.
                        </p>
                        <p>
                          All provisions of the Terms which by their nature should survive termination shall survive
                          termination, including, without limitation, ownership provisions, warranty disclaimers,
                          indemnity, and limitations of liability.
                        </p>

                        <h4 className="font-medium text-foreground">6.4 Data After Termination</h4>
                        <p>
                          After account termination, we will delete your personal data in accordance with our Privacy
                          Policy, except as required by law or for legitimate business purposes. You may request a copy
                          of your data before terminating your account.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <Scale className="h-5 w-5 text-rose-500" />
                          <span>7. Dispute Resolution</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">7.1 Governing Law</h4>
                        <p>
                          These Terms shall be governed by and construed in accordance with the laws of the State of
                          California, without regard to its conflict of law provisions.
                        </p>

                        <h4 className="font-medium text-foreground">7.2 Arbitration Agreement</h4>
                        <p>
                          For any dispute you have with CycleSync, you agree to first contact us and attempt to resolve
                          the dispute informally. If we are unable to resolve the dispute informally, we each agree to
                          resolve any claim, dispute, or controversy arising out of or in connection with or relating to
                          these Terms through binding arbitration.
                        </p>

                        <h4 className="font-medium text-foreground">7.3 Arbitration Procedures</h4>
                        <p>
                          The arbitration will be conducted by JAMS under its applicable rules. The arbitration shall
                          take place in San Francisco, California, unless you and CycleSync agree otherwise. The
                          arbitrator's award shall be binding and may be entered as a judgment in any court of competent
                          jurisdiction.
                        </p>

                        <h4 className="font-medium text-foreground">7.4 Class Action Waiver</h4>
                        <p>
                          YOU AND CYCLESYNC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS
                          INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR
                          REPRESENTATIVE PROCEEDING.
                        </p>

                        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                            Important Note
                          </h4>
                          <p className="mt-2">
                            By agreeing to these Terms, you are waiving your right to a jury trial and to participate in
                            a class action lawsuit.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-5 w-5 text-rose-500" />
                          <span>8. Changes to Terms</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <p>
                          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If
                          a revision is material, we will provide at least 30 days' notice prior to any new terms taking
                          effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                        <p>
                          By continuing to access or use our Service after those revisions become effective, you agree
                          to be bound by the revised terms. If you do not agree to the new terms, please stop using the
                          Service.
                        </p>
                        <p>
                          We will notify you of any changes to these Terms by posting the new Terms on this page,
                          sending you an email, and/or providing a notification within the Service.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-9">
                      <AccordionTrigger className="text-lg font-medium">
                        <div className="flex items-center gap-2">
                          <Gavel className="h-5 w-5 text-rose-500" />
                          <span>9. General Provisions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">9.1 Entire Agreement</h4>
                        <p>
                          These Terms, together with the Privacy Policy and any other legal notices published by
                          CycleSync on the Service, shall constitute the entire agreement between you and CycleSync
                          concerning the Service.
                        </p>

                        <h4 className="font-medium text-foreground">9.2 Severability</h4>
                        <p>
                          If any provision of these Terms is deemed invalid by a court of competent jurisdiction, the
                          invalidity of such provision shall not affect the validity of the remaining provisions of
                          these Terms, which shall remain in full force and effect.
                        </p>

                        <h4 className="font-medium text-foreground">9.3 Waiver</h4>
                        <p>
                          No waiver of any term of these Terms shall be deemed a further or continuing waiver of such
                          term or any other term, and CycleSync's failure to assert any right or provision under these
                          Terms shall not constitute a waiver of such right or provision.
                        </p>

                        <h4 className="font-medium text-foreground">9.4 Assignment</h4>
                        <p>
                          You may not assign or transfer these Terms, by operation of law or otherwise, without
                          CycleSync's prior written consent. Any attempt by you to assign or transfer these Terms
                          without such consent will be null and of no effect. CycleSync may assign or transfer these
                          Terms, at its sole discretion, without restriction.
                        </p>

                        <h4 className="font-medium text-foreground">9.5 Contact Information</h4>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <div className="bg-muted p-4 rounded-lg">
                          <p>Email: legal@cyclesync.com</p>
                          <p>Address: 123 Privacy Lane, Health City, CA 94000, USA</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-12">
                {/* Plain Language Summary */}
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30">
                      <MessageSquare className="h-6 w-6 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Terms of Service Summary</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    This is a simplified summary of our Terms of Service to help you understand the key points. Please
                    read the full Terms for complete details.
                  </p>

                  <div className="space-y-8">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <User className="h-5 w-5 text-rose-500" />
                          Your Account
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>
                              You must be at least 13 years old to use CycleSync (with parental consent if under 18)
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>You're responsible for keeping your account secure</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>You must provide accurate information when creating your account</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-rose-500" />
                          Your Data
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>You own your data and can export or delete it at any time</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>
                              We only use your data to provide the service to you, as detailed in our Privacy Policy
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>
                              CycleSync is not a medical device and should not be used for medical diagnosis or
                              treatment
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-rose-500" />
                          Our Service
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>
                              We may update the service or these terms, and will notify you of significant changes
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>
                              Don't misuse our service (no hacking, scraping, or using it for illegal purposes)
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>
                              We provide the service "as is" and can't guarantee it will always be available or
                              error-free
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Scale className="h-5 w-5 text-rose-500" />
                          Legal Matters
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>
                              Disputes will be resolved through arbitration rather than court (unless prohibited by law)
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>California law governs these terms</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span>You can contact us at legal@cyclesync.com with any questions about these terms</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold mb-4">Remember</h3>
                      <p className="text-muted-foreground">
                        This summary is just a simplified overview. The complete Terms of Service is the legally binding
                        agreement between you and CycleSync. We encourage you to read the full Terms for complete
                        details.
                      </p>
                      <Button
                        className="mt-4 bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
                        onClick={() => {
                          const el = document.querySelector<HTMLElement>('[data-value="terms"]');
                          el?.click();
                        }}

                      // onClick={() => document.querySelector('[data-value="terms"]')?.click()}
                      >
                        Read Full Terms
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Have questions about our Terms?</h2>
              <p className="text-muted-foreground mb-6">
                Our team is here to help you understand our legal policies and answer any questions you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700" asChild>
                  <Link to="/contact">Contact Our Legal Team</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/privacy-policy">View Privacy Policy</Link>
                </Button>
              </div>
            </div>
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
                      to={`/#${item.toLowerCase()}`}
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
                      to={`/#${item.toLowerCase().replace(" ", "-")}`}
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
                        to={
                          item === "Terms of Service"
                            ? "/terms-of-service"
                            : item === "Privacy Policy"
                              ? "/privacy-policy"
                              : `/#${item.toLowerCase().replace(" ", "-")}`
                        }
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
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CycleSync. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="#cookies" className="text-sm text-muted-foreground hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}