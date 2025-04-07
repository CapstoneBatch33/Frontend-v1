"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Loader2, Leaf, Droplets, Thermometer, Upload, Sun, Cloud, Wind, Tractor, Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { classifyImage, loadModel } from "@/lib/model-loader"

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
  image?: string
  diseaseData?: {
    class: string,
    confidence: number
  }
}

// Add this helper function at the top of your file, outside the component
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  }).toUpperCase();
};

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
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [suggestions, setSuggestions] = useState([
    "Best crops for this season?",
    "What's my soil moisture level?",
    "Help me with common pests?",
    "What fertilizer should I use?",
    "Scan a plant leaf for diseases",
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
    "Regular scanning of plant leaves can help detect diseases before they spread to the entire crop.",
  ]

  // Load the model when the component mounts
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Single useEffect for model loading
  useEffect(() => {
    const loadModelAsync = async () => {
      try {
        const { loadModel } = await import('@/lib/model-loader');
        await loadModel();
        setIsModelLoaded(true);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModelAsync();
  }, []);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a message showing the uploaded image
    const userMessage = {
      id: Date.now().toString(),
      content: "I'd like to check if this plant has any diseases.",
      sender: "user",
      timestamp: new Date(),
      image: URL.createObjectURL(file),
    };

    setMessages((prev) => [...prev, userMessage as Message]);
    setIsProcessingImage(true);

    // Add a loading message
    const loadingMessage = {
      id: Date.now().toString() + "-loading",
      content: "Analyzing your plant image...",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage as Message]);

    try {
      // Create an image element for processing
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = async () => {
        // Import and use the model
        const { classifyImage } = await import('@/lib/model-loader');
        const result = await classifyImage(img);
        
        // Remove loading message
        setMessages((prev) => prev.filter(msg => msg.id !== loadingMessage.id));
        
        // Format disease name for display
        const formattedDiseaseName = result.class
          .replace(/_/g, ' ')
          .replace(/___/g, ' - ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        
        // Add result message
        const botMessage = {
          id: Date.now().toString(),
          content: `I've analyzed the image and detected: **${formattedDiseaseName}** with ${(result.confidence * 100).toFixed(2)}% confidence.`,
          sender: "bot",
          timestamp: new Date(),
          diseaseData: result,
        };

        setMessages((prev) => [...prev, botMessage as Message]);
        
        // Add treatment recommendations
        const treatmentMessage = {
          id: Date.now().toString() + "-treatment",
          content: getTreatmentRecommendation(result.class),
          sender: "bot",
          timestamp: new Date(),
        };
        
        setTimeout(() => {
          setMessages((prev) => [...prev, treatmentMessage as Message]);
        }, 1000);

        setIsProcessingImage(false);
      };
    } catch (error) {
      console.error("Error processing image:", error);
      
      // Remove loading message and show error
      setMessages((prev) => prev.filter(msg => msg.id !== loadingMessage.id));
      
      const errorMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I couldn't analyze that image. Please try again with a clearer photo of the plant leaf.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage as Message]);
      setIsProcessingImage(false);
    }
  };

  // Add this helper function for treatment recommendations
  const getTreatmentRecommendation = (diseaseClass: string) => {
    const treatments: Record<string, string> = {
      'Apple___Apple_scab': 'For Apple Scab treatment:\n• Remove infected leaves\n• Apply fungicides in early spring\n• Improve air circulation\n• Maintain proper tree spacing',
      'Apple___Black_rot': 'To treat Black Rot:\n• Prune out dead or diseased branches\n• Remove mummified fruits\n• Apply appropriate fungicides\n• Maintain good sanitation',
      'Corn_(maize)___Common_rust_': 'For Corn Rust management:\n• Use resistant varieties\n• Apply fungicides if severe\n• Ensure proper plant spacing\n• Monitor humidity levels',
      // Add more treatments for other diseases
      'default': 'General treatment recommendations:\n• Remove affected leaves\n• Improve air circulation\n• Avoid overhead watering\n• Consider applying appropriate fungicides\n• Monitor plant health regularly'
    };
    
    return treatments[diseaseClass] || treatments['default'];
  };

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
                                : "bg-muted"
                            }`}
                          >
                            {message.isLoading ? (
                              <div className="flex items-center gap-3">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{message.content}</span>
                              </div>
                            ) : (
                              <>
                                <p className="whitespace-pre-line">{message.content}</p>
                                
                                {/* Display uploaded image if present */}
                                {message.image && (
                                  <div className="mt-2 rounded-md overflow-hidden">
                                    <img 
                                      src={message.image} 
                                      alt="Uploaded plant" 
                                      className="max-h-60 w-auto object-contain"
                                    />
                                  </div>
                                )}
                                
                                {/* Display sensor data visualization if applicable */}
                                {message.withData && (
                                  <div className="mt-3 grid grid-cols-3 gap-2">
                                    <div className="bg-background/80 p-2 rounded flex flex-col items-center">
                                      <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                                      <span className="text-xs text-muted-foreground">Moisture</span>
                                      <span className="font-medium">{sensorData.moisture}%</span>
                                    </div>
                                    <div className="bg-background/80 p-2 rounded flex flex-col items-center">
                                      <Thermometer className="h-5 w-5 text-red-500 mb-1" />
                                      <span className="text-xs text-muted-foreground">Temp</span>
                                      <span className="font-medium">{sensorData.temperature}°C</span>
                                    </div>
                                    <div className="bg-background/80 p-2 rounded flex flex-col items-center">
                                      <Leaf className="h-5 w-5 text-green-500 mb-1" />
                                      <span className="text-xs text-muted-foreground">pH</span>
                                      <span className="font-medium">{sensorData.pH}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Display disease data if present */}
                                {message.diseaseData && (
                                  <div className="mt-3 bg-background/80 p-3 rounded-md">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Leaf className="h-5 w-5 text-green-600" />
                                      <span className="font-medium">Disease Analysis</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="text-sm">
                                        <p className="text-muted-foreground">Detected:</p>
                                        <p className="font-medium">
                                          {message.diseaseData.class.replace(/_/g, ' ').replace(/___/g, ' - ')}
                                        </p>
                                      </div>
                                      <div className="text-sm">
                                        <p className="text-muted-foreground">Confidence:</p>
                                        <p className="font-medium">
                                          {(message.diseaseData.confidence * 100).toFixed(2)}%
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div
                            className={`text-xs text-muted-foreground mt-1 ${
                              message.sender === "user" ? "text-right" : ""
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImage}
                  >
                    {isProcessingImage ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isTyping || isProcessingImage}
                  />
                  <Button 
                    className="shrink-0" 
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping || isProcessingImage}
                  >
                    {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                  
                  {/* Hidden file input for image upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isProcessingImage}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar with suggestions and weather */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Suggested Questions</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => {
                      setInput(suggestion)
                      if (suggestion.toLowerCase().includes("scan")) {
                        fileInputRef.current?.click()
                      }
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Weather Forecast</h3>
              <div className="space-y-2">
                {weatherForecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      {day.icon}
                      <span>{day.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{day.condition}</span>
                      <Badge variant="outline">{day.temp}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}