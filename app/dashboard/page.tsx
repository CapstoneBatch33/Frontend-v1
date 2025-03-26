"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Droplets, Thermometer, Leaf, CloudSun, Tractor, AlertTriangle, Sun, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for sensors
const generateMockData = () => {
  const now = new Date()
  const data = []

  for (let i = 0; i < 24; i++) {
    const time = new Date(now)
    time.setHours(now.getHours() - 23 + i)

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      moisture: Math.floor(Math.random() * 20) + 30, // 30-50%
      temperature: Math.floor(Math.random() * 10) + 18, // 18-28°C
      pH: (Math.random() * 2 + 5).toFixed(1), // 5.0-7.0
      co2: Math.floor(Math.random() * 200) + 400, // 400-600 ppm
      light: Math.floor(Math.random() * 500) + 500, // 500-1000 lux
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
    })
  }

  return data
}

// Status indicators
const getStatusColor = (value: number, type: string) => {
  switch (type) {
    case "moisture":
      return value < 35 ? "destructive" : value > 45 ? "yellow" : "green"
    case "temperature":
      return value < 20 ? "blue" : value > 25 ? "destructive" : "green"
    case "pH":
      return value < 6.0 ? "yellow" : value > 6.8 ? "yellow" : "green"
    case "co2":
      return value > 550 ? "yellow" : "green"
    default:
      return "green"
  }
}

const getStatusText = (color: string) => {
  switch (color) {
    case "green":
      return "Optimal"
    case "yellow":
      return "Warning"
    case "destructive":
      return "Critical"
    case "blue":
      return "Low"
    default:
      return "Unknown"
  }
}

export default function Dashboard() {
  const [data, setData] = useState(generateMockData())
  const [alerts, setAlerts] = useState<string[]>([])
  const [weatherCondition, setWeatherCondition] = useState("sunny")
  const [tractorPosition, setTractorPosition] = useState(0)
  const [activeSensor, setActiveSensor] = useState<string | null>(null)

  // Current values (last data point)
  const currentValues = data[data.length - 1]

  // Update data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [
        ...data.slice(1),
        {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          moisture: Math.floor(Math.random() * 20) + 30,
          temperature: Math.floor(Math.random() * 10) + 18,
          pH: (Math.random() * 2 + 5).toFixed(1),
          co2: Math.floor(Math.random() * 200) + 400,
          light: Math.floor(Math.random() * 500) + 500,
          humidity: Math.floor(Math.random() * 30) + 40,
        },
      ]

      setData(newData)

      // Check for alerts
      const latest = newData[newData.length - 1]
      if (latest.moisture < 35) {
        setAlerts((prev) => [...prev, `Low soil moisture detected: ${latest.moisture}%`])
      }
      if (latest.temperature > 25) {
        setAlerts((prev) => [...prev, `High temperature detected: ${latest.temperature}°C`])
      }

      // Limit alerts to last 5
      if (alerts.length > 5) {
        setAlerts(alerts.slice(-5))
      }

      // Update weather condition randomly
      if (Math.random() > 0.9) {
        const conditions = ["sunny", "cloudy", "rainy"]
        setWeatherCondition(conditions[Math.floor(Math.random() * conditions.length)])
      }

      // Move tractor
      setTractorPosition((prev) => (prev + 5) % 100)
    }, 5000)

    return () => clearInterval(interval)
  }, [data, alerts])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-2">Farm Sensor Dashboard</h1>
        <p className="text-muted-foreground mb-8">Real-time monitoring of your farm's vital statistics</p>
      </motion.div>

      {/* Weather and Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-blue-500" />
              Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">{currentValues.temperature}°C</p>
                <p className="text-muted-foreground">Humidity: {currentValues.humidity}%</p>
              </div>
              <div className="text-4xl">
                {weatherCondition === "sunny" && <Sun className="h-12 w-12 text-yellow-500 animate-pulse-slow" />}
                {weatherCondition === "cloudy" && <CloudSun className="h-12 w-12 text-blue-300 animate-pulse-slow" />}
                {weatherCondition === "rainy" && <Droplets className="h-12 w-12 text-blue-500 animate-pulse-slow" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Wind: {Math.floor(Math.random() * 10) + 5} km/h</p>
              <div className="flex items-center gap-2 mt-1">
                <Wind className="h-4 w-4" />
                <div className="bg-secondary/20 h-2 rounded-full w-full">
                  <div
                    className="bg-secondary h-2 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 50) + 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <ul className="space-y-2">
                {alerts.map((alert, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 text-sm p-2 bg-destructive/10 rounded-md"
                  >
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    {alert}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No alerts at this time</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Sensor Data */}
      <Tabs defaultValue="charts" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="gauges">Gauges</TabsTrigger>
          <TabsTrigger value="field">Field View</TabsTrigger>
        </TabsList>

        <TabsContent value="charts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Soil Moisture</CardTitle>
                <CardDescription>24-hour history (%)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[20, 60]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="moisture"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temperature</CardTitle>
                <CardDescription>24-hour history (°C)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[15, 30]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Soil pH</CardTitle>
                <CardDescription>24-hour history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[5, 7.5]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="pH"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CO₂ Levels</CardTitle>
                <CardDescription>24-hour history (ppm)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[350, 650]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="co2"
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gauges">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Soil Moisture",
                value: currentValues.moisture,
                unit: "%",
                icon: <Droplets className="h-6 w-6" />,
                type: "moisture",
                min: 0,
                max: 100,
                optimal: [35, 45],
              },
              {
                name: "Temperature",
                value: currentValues.temperature,
                unit: "°C",
                icon: <Thermometer className="h-6 w-6" />,
                type: "temperature",
                min: 0,
                max: 40,
                optimal: [20, 25],
              },
              {
                name: "Soil pH",
                value: Number.parseFloat(currentValues.pH),
                unit: "",
                icon: <Leaf className="h-6 w-6" />,
                type: "pH",
                min: 0,
                max: 14,
                optimal: [6.0, 6.8],
              },
              {
                name: "CO₂ Level",
                value: currentValues.co2,
                unit: "ppm",
                icon: (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8,8 A4,4 0 1,1 8,16 A4,4 0 1,1 8,8" />
                    <path d="M16,8 A4,4 0 1,1 16,16 A4,4 0 1,1 16,8" />
                    <path d="M12,4 L12,20" />
                  </svg>
                ),
                type: "co2",
                min: 300,
                max: 800,
                optimal: [400, 550],
              },
            ].map((sensor) => {
              const statusColor = getStatusColor(sensor.value, sensor.type)
              const percentage = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100

              return (
                <Card key={sensor.name} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {sensor.icon}
                        {sensor.name}
                      </span>
                      <Badge variant={statusColor as "default" | "destructive" | "secondary" | "outline"}>
                        {getStatusText(statusColor)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold">{sensor.value}</span>
                      <span className="text-xl">{sensor.unit}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-${statusColor}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, percentage))}%`,
                            backgroundColor:
                              statusColor === "green"
                                ? "hsl(var(--primary))"
                                : statusColor === "yellow"
                                  ? "hsl(var(--accent))"
                                  : statusColor === "destructive"
                                    ? "hsl(var(--destructive))"
                                    : statusColor === "blue"
                                      ? "hsl(var(--secondary))"
                                      : "",
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{sensor.min}</span>
                        <span>{sensor.max}</span>
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        Optimal range: {sensor.optimal[0]} - {sensor.optimal[1]} {sensor.unit}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="field">
          <Card>
            <CardHeader>
              <CardTitle>Field View</CardTitle>
              <CardDescription>Visual representation of your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[500px] bg-gradient-to-b from-blue-50 to-green-100 rounded-lg overflow-hidden border border-border">
                {/* Sky */}
                <div className="absolute inset-0 h-1/3 bg-gradient-to-b from-blue-300 to-blue-100">
                  {/* Sun */}
                  <div className="absolute top-10 right-20">
                    <Sun className="h-16 w-16 text-yellow-400 animate-pulse-slow" />
                  </div>

                  {/* Clouds */}
                  <motion.div
                    className="absolute top-16 left-10"
                    animate={{ x: [0, 100, 0] }}
                    transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <svg className="h-12 w-24 text-white" viewBox="0 0 100 50" fill="currentColor">
                      <path d="M10,30 Q25,10 40,30 T70,30 Q85,10 100,30 T130,30 Q145,10 160,30 V50 H10 Z" />
                    </svg>
                  </motion.div>
                </div>

                {/* Field */}
                <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-b from-green-300 to-green-500">
                  {/* Crops */}
                  <div className="absolute inset-0 flex items-end">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="flex-1 flex justify-center">
                        <div
                          className="w-4 bg-green-700"
                          style={{
                            height: `${Math.random() * 30 + 50}px`,
                            marginBottom: "0px",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Tractor */}
                  <motion.div className="absolute bottom-10" style={{ left: `${tractorPosition}%` }}>
                    <Tractor className="h-16 w-16 text-accent" />
                  </motion.div>

                  {/* Sensor Nodes */}
                  {[
                    { x: 20, y: 70, type: "moisture" },
                    { x: 50, y: 60, type: "temperature" },
                    { x: 80, y: 65, type: "pH" },
                  ].map((sensor, i) => (
                    <div
                      key={i}
                      className="absolute w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                      style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
                      onClick={() => setActiveSensor(activeSensor === sensor.type ? null : sensor.type)}
                    >
                      {sensor.type === "moisture" && <Droplets className="h-4 w-4 text-blue-500" />}
                      {sensor.type === "temperature" && <Thermometer className="h-4 w-4 text-red-500" />}
                      {sensor.type === "pH" && <Leaf className="h-4 w-4 text-green-500" />}

                      {/* Popup */}
                      {activeSensor === sensor.type && (
                        <div className="absolute bottom-full mb-2 w-48 bg-white p-3 rounded-lg shadow-lg z-10">
                          <div className="font-medium mb-1">
                            {sensor.type === "moisture" && "Soil Moisture"}
                            {sensor.type === "temperature" && "Temperature"}
                            {sensor.type === "pH" && "Soil pH"}
                          </div>
                          <div className="text-sm mb-2">
                            {sensor.type === "moisture" && `${currentValues.moisture}%`}
                            {sensor.type === "temperature" && `${currentValues.temperature}°C`}
                            {sensor.type === "pH" && currentValues.pH}
                          </div>
                          <Progress
                            value={
                              sensor.type === "moisture"
                                ? (currentValues.moisture - 30) * 5
                                : sensor.type === "temperature"
                                  ? (currentValues.temperature - 18) * 10
                                  : (Number.parseFloat(currentValues.pH) - 5) * 50
                            }
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-4">
                <Button variant="outline" size="sm">
                  Zoom In
                </Button>
                <Button variant="outline" size="sm">
                  Zoom Out
                </Button>
                <Button variant="outline" size="sm">
                  Reset View
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

