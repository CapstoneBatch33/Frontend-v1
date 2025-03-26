"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock team data
const teamMembers = [
  {
    id: 1,
    name: "Ishaan Nene",
    role: "MLLM & Data Analytics",
    bio: "Ishaan has a robust background in machine learning and data analytics, with a focus on optimizing agricultural outputs through innovative technology.",
    image: "/placeholder.svg?height=400&width=400",
    category: "member",
    social: {
      linkedin: "https://www.linkedin.com/in/ishaan-nene-517247256/",
      github: "https://github.com/IshaanNene",
      email: "ishaannene@gmail.com",
    },
  },
  {
    id: 2,
    name: "Kabir Sahu",
    role: "IoT & FOG",
    bio: "Kabir is at the forefront of IoT deployment in agriculture, enhancing farm operations through smart, fog computing solutions.",
    image: "/placeholder.svg?height=400&width=400",
    category: "member",
    social: {
      linkedin: "https://www.linkedin.com/in/kabir-sahu-b7401b208/",
      github: "https://github.com/kabir325",
      email: "kabirsahu725@gmail.com",
    },
  },
  {
    id: 3,
    name: "Rachana K B",
    role: "Data Analytics & FrontEnd",
    bio: "Rachana integrates data analytics with user-centric designs to provide actionable insights and a seamless user experience on agricultural platforms.",
    image: "/placeholder.svg?height=400&width=400",
    category: "member",
    social: {
      linkedin: "https://www.linkedin.com/in/rachana-k-b-b062a2323/",
      github: "https://github.com/Rachana-kb77",
      email: "rachanakb77@gmail.com",
    },
  },
  {
    id: 4,
    name: "Sri Bindhu M",
    role: "FrontEnd & IoT",
    bio: "Sri Bindhu merges her expertise in frontend development with IoT innovations to craft interactive and efficient agricultural solutions.",
    image: "/placeholder.svg?height=400&width=400",
    category: "member",
    social: {
      linkedin: "https://www.linkedin.com/in/bindhu-m/",
      github: "https://github.com/Bindhhuu/",
      email: "bindhuvarsha456@gmail.com",
    },
  },
  {
    id: 5,
    name: "Dr. Gauri Rapate",
    role: "Mentor",
    bio: "Dr. Gauri guides the team with her extensive experience in agricultural technologies, focusing on sustainable and scalable farming practices.",
    image: "/placeholder.svg?height=400&width=400",
    category: "mentor",
    social: {
      linkedin: "#",
      github: "#",
      email: "david@smartfarm.com",
    },
  },
]

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [filter, setFilter] = useState("all")

  const filteredMembers = filter === "all" ? teamMembers : teamMembers.filter((member) => member.category === filter)

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Our Team</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the experts behind Smart Farming - a diverse team of agricultural scientists, engineers, and designers
          working together to revolutionize farming.
        </p>
      </motion.div>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="science" onClick={() => setFilter("member")}>
              Capstone Team
            </TabsTrigger>
            <TabsTrigger value="new" onClick={() => setFilter("mentor")}>
              Capstone Mentor
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className="overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedMember(member.id)}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm opacity-80">{member.role}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Team Member Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            {teamMembers
              .filter((m) => m.id === selectedMember)
              .map((member) => (
                <div key={member.id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-2xl font-bold">{member.name}</h2>
                      <p className="text-primary font-medium mb-4">{member.role}</p>
                      <p className="text-muted-foreground mb-6">{member.bio}</p>

                      <div className="flex gap-2 mb-6">
                        <Button variant="outline" size="icon" asChild>
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <a href={`mailto:${member.social.email}`}>
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </a>
                        </Button>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setSelectedMember(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </motion.div>
        </div>
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}

