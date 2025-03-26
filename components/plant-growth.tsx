"use client"

import { motion, useTransform, type MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

interface PlantGrowthProps {
  progress: MotionValue<number>
  className?: string
  variant?: "maize" | "wheat"
}

export function PlantGrowth({ progress, className, variant = "maize" }: PlantGrowthProps) {
  // Animation sequence stages
  const seedScale = useTransform(progress, [0, 0.1], [1, 0.8])
  const seedOpacity = useTransform(progress, [0, 0.15], [1, 0])
  const sproutOpacity = useTransform(progress, [0.05, 0.2, 0.3], [0, 1, 1])
  const sproutScale = useTransform(progress, [0.05, 0.2], [0.5, 1])
  const stemHeight = useTransform(progress, [0.2, 0.7], ["0%", "100%"])
  const firstLeafOpacity = useTransform(progress, [0.3, 0.4], [0, 1])
  const secondLeafOpacity = useTransform(progress, [0.4, 0.5], [0, 1])
  const thirdLeafOpacity = useTransform(progress, [0.5, 0.6], [0, 1])
  const fourthLeafOpacity = useTransform(progress, [0.6, 0.7], [0, 1])
  const flowerOpacity = useTransform(progress, [0.7, 0.9], [0, 1])
  const flowerScale = useTransform(progress, [0.7, 0.9], [0.5, 1])

  return (
    <div className={cn("relative w-24 h-[60vh]", className)}>
      <motion.div className="absolute bottom-0 w-full h-full flex flex-col items-center justify-end">
        {/* Seed */}
        <motion.div 
          className="absolute bottom-2 w-6 h-8 bg-amber-800 rounded-full z-10"
          style={{ 
            scale: seedScale,
            opacity: seedOpacity
          }} 
        />
        
        {/* Initial sprout */}
        <motion.div 
          className="absolute bottom-2 flex flex-col items-center"
          style={{ 
            opacity: sproutOpacity,
            scale: sproutScale
          }}
        >
          <div className="w-1 h-6 bg-green-600" />
          <div className="w-4 h-1 bg-green-500 mt-1 rounded-full" />
        </motion.div>

        {/* Stem */}
        <motion.div 
          className="w-2 bg-green-700 absolute bottom-0 origin-bottom" 
          style={{ height: stemHeight }} 
        />

        {/* Leaves - different for maize and wheat */}
        {variant === "maize" ? (
          // Maize leaves
          <>
            <motion.div className="absolute bottom-[20%] left-1/2" style={{ opacity: firstLeafOpacity }}>
              <div className="w-16 h-4 -ml-2 bg-green-600 rounded-full -rotate-12" />
            </motion.div>
            <motion.div className="absolute bottom-[35%] left-1/2" style={{ opacity: secondLeafOpacity }}>
              <div className="w-20 h-4 -ml-16 bg-green-600 rounded-full rotate-12" />
            </motion.div>
            <motion.div className="absolute bottom-[50%] left-1/2" style={{ opacity: thirdLeafOpacity }}>
              <div className="w-16 h-4 -ml-2 bg-green-600 rounded-full -rotate-12" />
            </motion.div>
            <motion.div className="absolute bottom-[65%] left-1/2" style={{ opacity: fourthLeafOpacity }}>
              <div className="w-20 h-4 -ml-16 bg-green-600 rounded-full rotate-12" />
            </motion.div>

            {/* Corn cob */}
            <motion.div 
              className="absolute bottom-[40%] left-[55%]" 
              style={{ 
                opacity: flowerOpacity,
                scale: flowerScale
              }}
            >
              <div className="w-6 h-14 bg-yellow-300 rounded-full" />
              <div className="absolute top-0 right-0 w-2 h-8 bg-green-700 -rotate-45" />
            </motion.div>
          </>
        ) : (
          // Wheat leaves and spike
          <>
            <motion.div className="absolute bottom-[30%] left-1/2" style={{ opacity: firstLeafOpacity }}>
              <div className="w-14 h-3 -ml-12 bg-green-500 rounded-full rotate-12" />
            </motion.div>
            <motion.div className="absolute bottom-[45%] left-1/2" style={{ opacity: secondLeafOpacity }}>
              <div className="w-14 h-3 -ml-2 bg-green-500 rounded-full -rotate-12" />
            </motion.div>
            <motion.div className="absolute bottom-[60%] left-1/2" style={{ opacity: thirdLeafOpacity }}>
              <div className="w-14 h-3 -ml-12 bg-green-500 rounded-full rotate-12" />
            </motion.div>

            {/* Wheat head */}
            <motion.div 
              className="absolute bottom-[70%] left-[48%]" 
              style={{ 
                opacity: flowerOpacity,
                scale: flowerScale
              }}
            >
              <div className="w-4 h-16 bg-yellow-200 rounded-sm flex flex-col justify-around items-center">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-6 h-1 bg-yellow-600" />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}