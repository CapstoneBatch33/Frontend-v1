"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Loader2, Leaf, Droplets, Thermometer, Upload, Sun, Cloud, Wind, Tractor } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock sensor data
const sensorData = {
  moisture: 42,
  temperature: 24,
  pH: 6.2,
  co2: 450,
  light: 850,
  humidity: 65,
}

// Mock AI responses
const mockResponses: Record<string, string> = {
  default: "I'm your Smart Farming Assistant. How can I help you today?",
  greeting:
    "Hello there, farmer! I'm your digital farming companion, ready to help your crops thrive. Ask me about soil conditions, pest management, or anything else happening in your fields! 🌱",
  moisture: `Based on your current soil moisture reading of ${sensorData.moisture}%, your soil is in the optimal range. No irrigation is needed at this time. I recommend checking again tomorrow morning. Remember: happy soil, happy plants!`,
  temperature: `The current temperature is ${sensorData.temperature}°C, which is ideal for most crops. Your plants are enjoying this weather! If temperatures rise above 28°C, consider providing some shade for your more sensitive green friends.`,
  pH: `Your soil pH is currently ${sensorData.pH}, which is slightly acidic. This is perfect for crops like potatoes, tomatoes, and blueberries. They'll be thriving in these conditions! For crops that prefer more neutral soil, consider adding a bit of agricultural lime.`,
  crops:
    "For your region and current season, I recommend planting: \n\n1. Maize/Corn - Thrives in your warm weather and will make excellent use of your soil conditions\n2. Tomatoes - Perfect match for your soil pH, and they'll love the current temperature range\n3. Leafy greens - Quick harvest cycle and great for crop rotation\n\nWould you like specific planting instructions for any of these green companions?",
  pests:
    "Based on your region and current conditions, keep your eyes peeled for these common troublemakers:\n\n1. Aphids - The tiny thieves that love to gather on the undersides of leaves\n2. Corn borers - Sneaky pests that leave small holes in stalks as their calling card\n3. Spider mites - These become more common in dry conditions, like tiny drought-loving ninjas\n\nWould you like some organic control methods to keep these visitors in check?",
  fertilizer:
    "Based on your soil data, I recommend a balanced NPK fertilizer (10-10-10) applied at 2.5kg per 100 square meters. Think of it as a nutritious feast for your soil! Apply in the early morning or evening for best results, when your plants are most ready to enjoy their meal.",
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isLoading?: boolean
  withData?: boolean
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: mockResponses.greeting,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState([
    "Best crops for this season?",
    "What's my soil moisture level?",
    "Help me with common pests?",
    "What fertilizer should I use?",
  ])
  
  // Weather forecast data for character
  const [weatherForecast, setWeatherForecast] = useState([
    { day: "Today", condition: "Sunny", temp: "24°C", icon: <Sun className="h-5 w-5 text-yellow-500" /> },
    { day: "Tomorrow", condition: "Partly Cloudy", temp: "22°C", icon: <Cloud className="h-5 w-5 text-blue-400" /> },
    { day: "Wednesday", condition: "Windy", temp: "20°C", icon: <Wind className="h-5 w-5 text-blue-500" /> },
  ])
  
  // Farm tips for added character
  const [farmTip, setFarmTip] = useState("Rotate your crops to improve soil health and reduce pest problems naturally!")
  
  const farmTips = [
    "Rotate your crops to improve soil health and reduce pest problems naturally!",
    "Companion planting can help deter pests - try planting marigolds near your tomatoes!",
    "Morning is the best time to water your plants - less evaporation and time to dry before evening.",
    "Mulching helps retain soil moisture and suppresses weeds. Less work, healthier plants!",
    "Consider planting cover crops in the off-season to prevent soil erosion.",
    "Coffee grounds make excellent compost material and many plants love the acidity!",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Change the farm tip periodically for added character
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTip = farmTips[Math.floor(Math.random() * farmTips.length)]
      setFarmTip(randomTip)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let responseContent = mockResponses.default
      let withData = false

      if (input.toLowerCase().includes("moisture") || input.toLowerCase().includes("water")) {
        responseContent = mockResponses.moisture
        withData = true
      } else if (
        input.toLowerCase().includes("temperature") ||
        input.toLowerCase().includes("hot") ||
        input.toLowerCase().includes("cold")
      ) {
        responseContent = mockResponses.temperature
        withData = true
      } else if (
        input.toLowerCase().includes("ph") ||
        input.toLowerCase().includes("acid") ||
        input.toLowerCase().includes("soil")
      ) {
        responseContent = mockResponses.pH
        withData = true
      } else if (
        input.toLowerCase().includes("crop") ||
        input.toLowerCase().includes("plant") ||
        input.toLowerCase().includes("grow")
      ) {
        responseContent = mockResponses.crops
      } else if (
        input.toLowerCase().includes("pest") ||
        input.toLowerCase().includes("bug") ||
        input.toLowerCase().includes("insect")
      ) {
        responseContent = mockResponses.pests
      } else if (input.toLowerCase().includes("fertilizer") || input.toLowerCase().includes("nutrient")) {
        responseContent = mockResponses.fertilizer
      } else if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
        responseContent = mockResponses.greeting
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: "bot",
        timestamp: new Date(),
        withData,
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)

      // Update suggestions based on context
      if (input.toLowerCase().includes("moisture")) {
        setSuggestions([
          "When should I water my crops?",
          "What's the ideal soil moisture?",
          "How to improve water retention?",
          "Show me irrigation recommendations",
        ])
      } else if (input.toLowerCase().includes("crop") || input.toLowerCase().includes("plant")) {
        setSuggestions([
          "What's the best planting depth?",
          "How far apart should I plant?",
          "When will they be ready to harvest?",
          "What nutrients do they need?",
        ])
      }
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <Tractor className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold mb-1">AI Farming Assistant</h1>
            <p className="text-muted-foreground italic">"Growing wisdom for your growing plants"</p>
          </div>
        </div>
        <div className="mt-2 p-3 bg-amber-100 rounded-lg border border-amber-200 text-amber-800 text-sm">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <p className="font-medium">Farmer's Tip of the Day:</p>
          </div>
          <p className="mt-1 pl-7">{farmTip}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[75vh] flex flex-col shadow-lg">
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="bg-primary/10 p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-green-500">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback className="bg-green-100">
                      <Bot className="h-6 w-6 text-green-700" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">Farm AI Assistant</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                      <p className="text-xs text-muted-foreground">Online • Updated with latest agricultural data</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 overflow-y-auto h-[calc(75vh-150px)]">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex mb-5 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className={`h-10 w-10 ${message.sender === "user" ? "border-2 border-primary" : "border-2 border-green-500"}`}>
                          <AvatarFallback className={message.sender === "user" ? "bg-primary/20" : "bg-green-100"}>
                            {message.sender === "user" ? 
                              <User className="h-5 w-5 text-primary" /> : 
                              <Bot className="h-5 w-5 text-green-700" />
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`rounded-lg p-4 ${
                              message.sender === "user" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted border-l-4 border-green-500"
                            }`}
                          >
                            {message.isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                              </div>
                            ) : (
                              <div className="whitespace-pre-line text-base">{message.content}</div>
                            )}
                          </div>
                          {message.withData && (
                            <div className="mt-3 bg-card rounded-lg p-4 border shadow-sm">
                              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Leaf className="h-4 w-4 text-green-600" />
                                Current Sensor Readings:
                              </p>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                                  <Droplets className="h-6 w-6 text-blue-500 mb-1" />
                                  <span className="text-lg font-semibold">{sensorData.moisture}%</span>
                                  <span className="text-xs text-muted-foreground">Moisture</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                                  <Thermometer className="h-6 w-6 text-red-500 mb-1" />
                                  <span className="text-lg font-semibold">{sensorData.temperature}°C</span>
                                  <span className="text-xs text-muted-foreground">Temperature</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                                  <Leaf className="h-6 w-6 text-green-500 mb-1" />
                                  <span className="text-lg font-semibold">pH {sensorData.pH}</span>
                                  <span className="text-xs text-muted-foreground">Soil pH</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="mt-1 text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex mb-4 justify-start"
                    >
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-10 w-10 border-2 border-green-500">
                          <AvatarFallback className="bg-green-100">
                            <Bot className="h-5 w-5 text-green-700" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="rounded-lg p-4 bg-muted border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <span className="animate-bounce text-green-600">●</span>
                                <span className="animate-bounce text-green-600" style={{ animationDelay: "0.2s" }}>
                                  ●
                                </span>
                                <span className="animate-bounce text-green-600" style={{ animationDelay: "0.4s" }}>
                                  ●
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-3"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your farm..."
                    className="flex-1 py-6 text-base"
                  />
                  <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-600" />
                Ask Me About
              </h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4 text-base border-green-200 hover:bg-green-50 hover:border-green-300"
                    onClick={() => {
                      setInput(suggestion)
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Upload className="h-5 w-5 text-amber-600" />
                Plant Analysis
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload an image of your crops for disease detection and analysis
              </p>
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-3 text-amber-600" />
                <p className="text-sm text-amber-800">Drag and drop or click to upload</p>
                <Button variant="outline" size="sm" className="mt-4 border-amber-200 hover:bg-amber-200">
                  Select Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Sun className="h-5 w-5 text-blue-600" />
                Weather Forecast
              </h3>
              <div className="space-y-3">
                {weatherForecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {day.icon}
                      <div>
                        <p className="font-medium">{day.day}</p>
                        <p className="text-xs text-muted-foreground">{day.condition}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{day.temp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className="shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Farm Status
              </h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Soil Health</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 px-3">
                      Good
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Irrigation</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 px-3">
                      Optimal
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Pest Risk</span>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 px-3">
                      Moderate
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Weather Forecast</span>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 px-3">
                      Clear
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}