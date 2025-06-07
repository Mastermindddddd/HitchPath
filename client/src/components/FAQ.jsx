import { motion } from "framer-motion"
import { useState } from "react"
import { HelpCircle, BookOpen, User, RefreshCw, LogIn, Briefcase, ChevronDown } from "lucide-react"

const faqData = [
  {
    question: "What is HitchPath?",
    answer:
      "HitchPath is an AI-powered platform designed to help you generate personalized career, learning, or studying paths. It also features a chatbot, GuideMate, to assist with career advice or academic guidance.",
    icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
  },
  {
    question: "How does HitchPath generate a learning or career path?",
    answer:
      "Our platform analyzes your goals, skills, and preferences to create a tailored path. Simply provide your information, and HitchPath will outline the steps and resources needed to achieve your objectives.",
    icon: <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
  },
  {
    question: "How can I create a custom learning path?",
    answer:
      "You can create a custom path by navigating to the Custom Path section. Provide details about your goals, and HitchPath will generate a personalized plan.",
    icon: <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
  },
  {
    question: "Do I need to log in to use HitchPath?",
    answer:
      "While you can explore some features without logging in, creating a personalized learning or career path requires an account. This helps save your progress and preferences for future sessions.",
    icon: <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
  },
  {
    question: "What should I do if I encounter errors while generating a path?",
    answer:
      'If you experience issues, ensure you are logged in and your internet connection is stable. You can also retry by clicking the "Retry" button. For persistent issues, contact us through the Contact Us section.',
    icon: <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
  },
  {
    question: "Is HitchPath suitable for career changers or beginners?",
    answer:
      "Whether you're just starting out or transitioning to a new field, HitchPath adapts to your specific needs and provides actionable guidance.",
    icon: <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
  },
]

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null)

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <div className="relative w-full py-8 sm:py-12 lg:py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-5 left-5 w-20 h-20 sm:top-10 sm:left-10 sm:w-40 sm:h-40 rounded-full bg-primary/30 blur-3xl"></div>
        <div className="absolute bottom-5 right-5 w-32 h-32 sm:bottom-10 sm:right-10 sm:w-60 sm:h-60 rounded-full bg-secondary/30 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8 xl:space-x-12 max-w-6xl mx-auto">
          {/* FAQ Content */}
          <div className="lg:w-3/5 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left mb-6 sm:mb-8 lg:mb-10"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gray-200 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground">
                Everything you need to know about HitchPath and how it can help you achieve your goals.
              </p>
            </motion.div>

            <div className="w-full">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="border border-border rounded-lg mb-2 sm:mb-4 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-6 hover:bg-muted/50 group transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between text-left">
                        <div className="flex items-center">
                          <span className="mr-2 sm:mr-3 flex-shrink-0 p-1.5 sm:p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            {faq.icon}
                          </span>
                          <span className="font-medium text-sm sm:text-base lg:text-lg leading-tight">{faq.question}</span>
                        </div>
                        <ChevronDown 
                          className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                            openItem === index ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4 sm:pt-2 lg:px-6">
                        <div className="pl-6 sm:pl-8 lg:pl-12 text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-2/5 w-full mt-8 sm:mt-10 lg:mt-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl transform -rotate-3"></div>
              <div className="relative bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                <img
                  src="/pixel.webp"
                  width={400}
                  height={400}
                  alt="HitchPath illustration"
                  className="w-full h-auto rounded-lg object-cover"
                />
                <div className="mt-4 sm:mt-6 text-center">
                  <h3 className="text-lg sm:text-xl font-semibold">Still have questions?</h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                    Our support team is here to help you with any questions you might have.
                  </p>
                  <button className="mt-3 sm:mt-4 px-4 py-2 sm:px-6 text-sm sm:text-base bg-blue-600 rounded-full hover:bg-primary/90 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FAQ