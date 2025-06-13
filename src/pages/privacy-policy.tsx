import { useState } from "react"
import {Link} from "react-router-dom"
import { motion } from "framer-motion"
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Server,
  UserCog,
  Globe,
  AlertTriangle,
  CheckCircle,
  Heart,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ModeToggle as ThemeToggle } from "@/components/mode-toggle"

export default function PrivacyPolicyPage() {
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-rose-50/30 dark:bg-gray-950">
      {/* Header/Navigation */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="font-bold text-xl">CycleSync</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Features
            </Link>
            <Link href="/#privacy" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Privacy
            </Link>
            <Link href="/#dashboard" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/#faq" className="text-sm font-medium hover:text-rose-500 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700" asChild>
              <Link href="/signup">Get Started</Link>
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
                href="/#features"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#privacy"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <Link
                href="/#dashboard"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/#faq"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <div className="flex justify-end mb-2">
                  <ThemeToggle variant="toggle" />
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
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
              <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-100">Privacy & Security</Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Your privacy is our top priority</h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                At CycleSync, we believe your health data belongs to you and only you. We've built our platform with
                privacy and security at its core.
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
            <Tabs defaultValue="privacy-policy" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="privacy-policy">Privacy Policy</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="privacy-policy" className="space-y-12">
                {/* Introduction */}
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30">
                      <FileText className="h-6 w-6 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Privacy Policy</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">Last updated: June 13, 2025</p>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      This Privacy Policy describes how CycleSync ("we", "us", or "our") collects, uses, and discloses
                      your information when you use our menstrual health tracking application (the "Service"). We take
                      your privacy seriously and are committed to protecting your personal data.
                    </p>
                    <p>
                      Please read this Privacy Policy carefully to understand our policies and practices regarding your
                      information and how we will treat it. If you do not agree with our policies and practices, your
                      choice is not to use our Service.
                    </p>
                  </div>
                </div>

                {/* Policy Sections */}
                <div className="max-w-3xl mx-auto">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-medium">Information We Collect</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">Personal Data</h4>
                        <p>When you use our Service, we may collect the following types of personal information:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            <span className="font-medium">Account Information:</span> Email address, password, and
                            optional profile information such as name and date of birth.
                          </li>
                          <li>
                            <span className="font-medium">Health Data:</span> Menstrual cycle information, symptoms,
                            mood, and other health metrics you choose to track.
                          </li>
                          <li>
                            <span className="font-medium">Usage Data:</span> Information about how you interact with our
                            Service, including access times, app features used, and app crashes.
                          </li>
                          <li>
                            <span className="font-medium">Device Information:</span> Information about your mobile
                            device such as device type, operating system, and unique device identifiers.
                          </li>
                        </ul>

                        <h4 className="font-medium text-foreground mt-6">Sensitive Health Information</h4>
                        <p>
                          We understand that menstrual and reproductive health data is sensitive information. This data
                          is:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>End-to-end encrypted</li>
                          <li>Processed locally on your device whenever possible</li>
                          <li>Never shared with third parties without your explicit consent</li>
                          <li>Never used for advertising purposes</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-medium">How We Use Your Information</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <p>We use the information we collect for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            <span className="font-medium">Provide the Service:</span> To operate, maintain, and provide
                            you with the features and functionality of the Service, including cycle predictions and
                            health insights.
                          </li>
                          <li>
                            <span className="font-medium">Improve the Service:</span> To understand how users interact
                            with our Service, identify bugs, and develop new features. This analysis is done using
                            aggregated, anonymized data.
                          </li>
                          <li>
                            <span className="font-medium">Communicate with You:</span> To respond to your inquiries,
                            provide customer support, and send important service updates.
                          </li>
                          <li>
                            <span className="font-medium">Ensure Security:</span> To protect the security and integrity
                            of our Service and your account.
                          </li>
                        </ul>

                        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            Our Commitment
                          </h4>
                          <p className="mt-2">
                            We will never sell your personal data or health information to third parties. Your health
                            data is yours and will only be used to provide you with the Service you've requested.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-medium">Data Storage and Security</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">Local-First Approach</h4>
                        <p>CycleSync uses a local-first approach to data processing. This means:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Most of your health data is processed directly on your device</li>
                          <li>
                            Your sensitive health information is stored locally and only synchronized to our servers in
                            encrypted form
                          </li>
                          <li>
                            You can use most features of the app even when offline, as your data is available on your
                            device
                          </li>
                        </ul>

                        <h4 className="font-medium text-foreground mt-6">End-to-End Encryption</h4>
                        <p>All sensitive health data is encrypted end-to-end, meaning:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Data is encrypted before it leaves your device</li>
                          <li>Only you can decrypt your data with your encryption keys</li>
                          <li>
                            Even in the unlikely event of a data breach, your health information would remain encrypted
                            and unreadable
                          </li>
                        </ul>

                        <h4 className="font-medium text-foreground mt-6">Data Retention</h4>
                        <p>
                          We retain your personal information only for as long as necessary to fulfill the purposes for
                          which we collected it. You can delete your account and all associated data at any time through
                          the app settings.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-medium">Your Rights and Choices</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <p>You have several rights regarding your personal information:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            <span className="font-medium">Access:</span> You can access all your health data directly in
                            the app at any time.
                          </li>
                          <li>
                            <span className="font-medium">Export:</span> You can export all your data in common formats
                            (CSV, JSON) through the app settings.
                          </li>
                          <li>
                            <span className="font-medium">Correction:</span> You can edit or update your information
                            directly in the app.
                          </li>
                          <li>
                            <span className="font-medium">Deletion:</span> You can delete specific data points or your
                            entire account at any time.
                          </li>
                          <li>
                            <span className="font-medium">Restriction:</span> You can choose which data to track and
                            which features to use.
                          </li>
                        </ul>

                        <h4 className="font-medium text-foreground mt-6">Data Sharing Controls</h4>
                        <p>CycleSync gives you complete control over your data sharing preferences:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            You can choose whether to contribute anonymized data to improve our algorithms (opt-in only)
                          </li>
                          <li>You can enable or disable cloud backup of your encrypted data</li>
                          <li>
                            You can generate shareable reports for healthcare providers without giving us access to your
                            unencrypted data
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-lg font-medium">Third-Party Sharing</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <h4 className="font-medium text-foreground">Limited Sharing</h4>
                        <p>We limit sharing of your information to the following circumstances:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            <span className="font-medium">Service Providers:</span> We may share information with
                            third-party vendors who help us operate our Service (e.g., cloud storage providers). These
                            providers are contractually obligated to protect your information and can only use it to
                            provide services to us.
                          </li>
                          <li>
                            <span className="font-medium">Legal Requirements:</span> We may disclose information if
                            required by law, such as to comply with a subpoena or similar legal process.
                          </li>
                          <li>
                            <span className="font-medium">With Your Consent:</span> We will share your information with
                            third parties only when you have given explicit consent.
                          </li>
                        </ul>

                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            Important Note
                          </h4>
                          <p className="mt-2">
                            We never share your health data with advertisers, data brokers, or other third parties for
                            marketing or advertising purposes. Your health data is never sold or rented to anyone.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-lg font-medium">Regulatory Compliance</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <p>CycleSync is committed to complying with applicable data protection laws worldwide:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            <span className="font-medium">GDPR Compliance:</span> For users in the European Economic
                            Area, we comply with the General Data Protection Regulation (GDPR). This includes providing
                            data portability, the right to be forgotten, and other rights.
                          </li>
                          <li>
                            <span className="font-medium">CCPA/CPRA Compliance:</span> For California residents, we
                            comply with the California Consumer Privacy Act (CCPA) and California Privacy Rights Act
                            (CPRA), providing specific rights regarding your personal information.
                          </li>
                          <li>
                            <span className="font-medium">HIPAA Considerations:</span> While CycleSync is not a covered
                            entity under HIPAA, we implement security measures that align with HIPAA standards for
                            protecting health information.
                          </li>
                        </ul>

                        <h4 className="font-medium text-foreground mt-6">International Data Transfers</h4>
                        <p>
                          If we transfer your data across international borders, we ensure appropriate safeguards are in
                          place to protect your information, including using standard contractual clauses and ensuring
                          compliance with local data protection laws.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                      <AccordionTrigger className="text-lg font-medium">Changes to This Policy</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <p>
                          We may update this Privacy Policy from time to time to reflect changes in our practices or for
                          other operational, legal, or regulatory reasons.
                        </p>
                        <p>If we make material changes to this Privacy Policy, we will notify you through:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>A notice on our website</li>
                          <li>An email to the address associated with your account</li>
                          <li>A notification within the app</li>
                        </ul>
                        <p>
                          We encourage you to review this Privacy Policy periodically to stay informed about how we
                          protect your information.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                      <AccordionTrigger className="text-lg font-medium">Contact Us</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <p>
                          If you have any questions or concerns about this Privacy Policy or our data practices, please
                          contact us at:
                        </p>
                        <div className="bg-muted p-4 rounded-lg">
                          <p>Email: privacy@cyclesync.com</p>
                          <p>Address: 123 Privacy Lane, Health City, CA 94000, USA</p>
                          <p>Data Protection Officer: dpo@cyclesync.com</p>
                        </div>
                        <p>
                          We are committed to working with you to resolve any concerns you may have about our privacy
                          practices.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-12">
                {/* Security Introduction */}
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30">
                      <Shield className="h-6 w-6 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Security Practices</h2>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      At CycleSync, security isn't just a feature—it's the foundation of everything we build. We've
                      designed our platform with a security-first architecture to ensure your most sensitive health data
                      remains private, secure, and under your control.
                    </p>
                    <p>
                      Our team includes security experts with backgrounds in healthcare data protection, and we
                      regularly conduct security audits and penetration testing to maintain the highest standards of
                      data protection.
                    </p>
                  </div>
                </div>

                {/* Security Features */}
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-xl font-semibold mb-6">Our Security Architecture</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Lock className="h-5 w-5 text-rose-500" />
                          <CardTitle>End-to-End Encryption</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          All sensitive health data is encrypted on your device before being transmitted or stored. Only
                          you hold the encryption keys, meaning even we cannot access your unencrypted data.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Server className="h-5 w-5 text-rose-500" />
                          <CardTitle>Local-First Processing</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Most data processing happens directly on your device, not our servers. This minimizes data
                          transmission and ensures your information stays with you.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-rose-500" />
                          <CardTitle>Zero-Knowledge Architecture</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Our systems are designed so that we have zero knowledge of your sensitive health data. We
                          cannot access, view, or analyze your unencrypted health information.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <UserCog className="h-5 w-5 text-rose-500" />
                          <CardTitle>User Control</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          You have complete control over your data, including the ability to export, delete, or modify
                          your information at any time through the app settings.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Technical Security Measures */}
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-xl font-semibold mb-6">Technical Security Measures</h3>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border">
                      <h4 className="font-medium text-lg mb-4">Data Encryption</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">AES-256 encryption</span> for all stored
                            health data
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">TLS 1.3</span> for all data in transit
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">Client-side encryption</span> ensures data is
                            encrypted before leaving your device
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">Secure key management</span> with keys stored
                            in your device's secure enclave when available
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border">
                      <h4 className="font-medium text-lg mb-4">Authentication & Access</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">Multi-factor authentication</span> options for
                            account access
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">Biometric authentication</span> support
                            (FaceID, TouchID, fingerprint)
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">App lock</span> with configurable timeout
                            settings
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">Role-based access control</span> for our
                            internal systems
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border">
                      <h4 className="font-medium text-lg mb-4">Infrastructure Security</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">SOC 2 Type II compliant</span> cloud
                            infrastructure
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">Regular security audits</span> and penetration
                            testing
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">24/7 monitoring</span> for suspicious activity
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">Automated vulnerability scanning</span> of our
                            codebase and dependencies
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Security Certifications */}
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-xl font-semibold mb-6">Security Certifications & Compliance</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                        <Shield className="h-8 w-8 text-rose-500" />
                      </div>
                      <h4 className="font-medium text-lg mb-2">SOC 2 Type II</h4>
                      <p className="text-muted-foreground">
                        Our systems and processes have been audited and certified for security, availability, and
                        confidentiality.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                        <Globe className="h-8 w-8 text-rose-500" />
                      </div>
                      <h4 className="font-medium text-lg mb-2">GDPR Compliant</h4>
                      <p className="text-muted-foreground">
                        Our practices meet or exceed the requirements of the General Data Protection Regulation for all
                        users worldwide.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security FAQ */}
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-xl font-semibold mb-6">Security FAQ</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="security-1">
                      <AccordionTrigger className="text-lg font-medium">
                        What happens if I lose my device?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p>
                          If you lose your device, your data remains protected by encryption and your account password.
                          You can log in on a new device to access your data if you've enabled cloud backup. You can
                          also remotely log out of all devices through our website.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="security-2">
                      <AccordionTrigger className="text-lg font-medium">
                        Can CycleSync employees see my health data?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p>
                          No. Due to our end-to-end encryption and zero-knowledge architecture, CycleSync employees
                          cannot access your unencrypted health data. Your encryption keys are stored only on your
                          devices, making it technically impossible for us to view your sensitive information.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="security-3">
                      <AccordionTrigger className="text-lg font-medium">
                        How do you handle security vulnerabilities?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p>
                          We maintain a responsible disclosure program and work with security researchers to identify
                          and address vulnerabilities. We conduct regular security audits and penetration testing. When
                          vulnerabilities are discovered, we follow a strict protocol to patch them quickly and notify
                          affected users if necessary.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="security-4">
                      <AccordionTrigger className="text-lg font-medium">
                        What happens if there's a data breach?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p>
                          In the unlikely event of a data breach, your health data would remain protected by encryption.
                          We have an incident response plan that includes promptly notifying affected users,
                          investigating the cause, remedying the issue, and reporting to relevant authorities as
                          required by law.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="security-5">
                      <AccordionTrigger className="text-lg font-medium">
                        How can I enhance the security of my account?
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4">
                        <p>We recommend the following steps to enhance your account security:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Enable two-factor authentication</li>
                          <li>Use a strong, unique password</li>
                          <li>Enable biometric authentication on your device</li>
                          <li>Keep your app and device updated</li>
                          <li>Enable app lock with a short timeout period</li>
                          <li>Review your account activity regularly</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Security Reporting */}
                <div className="max-w-3xl mx-auto bg-rose-50 dark:bg-rose-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4">Report a Security Concern</h3>
                  <p className="text-muted-foreground mb-4">
                    We take security seriously and appreciate reports of potential vulnerabilities. If you believe
                    you've found a security issue, please contact us immediately.
                  </p>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                    <p className="font-medium">Email: security@cyclesync.com</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Please include detailed information about the potential vulnerability. We'll respond promptly to
                      your report.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
                  <Link key={social} href={`#${social}`} className="text-muted-foreground hover:text-foreground">
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
                      href={`/#${item.toLowerCase()}`}
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
                      href={`/#${item.toLowerCase().replace(" ", "-")}`}
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
                        href={`/#${item.toLowerCase().replace(" ", "-")}`}
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
              <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#cookies" className="text-sm text-muted-foreground hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}