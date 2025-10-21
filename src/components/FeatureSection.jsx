import React from 'react'
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { Ruler, Paintbrush2, Lightbulb, Rocket, Layers3, Smile } from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: <Ruler className="w-8 h-8 text-indigo-600" />,
      title: "Step 1: Visualize & Plan",
      description: "We collaborate with you to define your vision, layout preferences, and smart features you'd love to include."
    },
    {
      icon: <Paintbrush2 className="w-8 h-8 text-rose-500" />,
      title: "Step 2: Customize Your Space",
      description: "From colors to cabinetry to lighting — you choose it all. We tailor every detail to your lifestyle and aesthetic."
    },
    {
      icon: <Layers3 className="w-8 h-8 text-sky-600" />,
      title: "Step 3: Prepare & Design",
      description: "We model your space, draft blueprints, and engineer how smart elements fit into your living area."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
      title: "Step 4: Integrate Smart Tech",
      description: "We embed voice-enabled mirrors, mood lighting, and automation seamlessly into your environment."
    },
    {
      icon: <Rocket className="w-8 h-8 text-green-600" />,
      title: "Step 5: Build & Install",
      description: "Our skilled team assembles everything with minimal disruption, maximum efficiency, and beautiful precision."
    },
    {
      icon: <Smile className="w-8 h-8 text-purple-600" />,
      title: "Step 6: Enjoy Your Smart Space",
      description: "We walk you through how to control and personalize your room — and leave you with a space you'll love."
    }
  ]
  return (
    <motion.section 
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      whileInView="show"
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <motion.div 
        variants={fadeIn('up', 0.3)}
        className="text-center mb-12"
      >
        <motion.h2 
          variants={textVariant(0.2)}
          className="text-3xl font-bold mb-4"
        >
          How We Bring Your Smart Space to Life
        </motion.h2>
        <motion.p 
          variants={fadeIn('up', 0.4)}
          className="text-gray-600"
        >
          Every step is designed to bring ease, comfort, and intelligence into your room — from ideation to transformation.
        </motion.p>
      </motion.div>
      
      <motion.div 
        variants={fadeIn('up', 0.5)}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            variants={fadeIn('up', 0.3 * (index + 1))}
            className="flex flex-col items-center p-6"
          >
            <motion.div 
              variants={fadeIn('down', 0.4 * (index + 1))}
              className="w-24 h-24 rounded-full mb-6 flex items-center justify-center" 
              style={{ 
                backgroundColor: index === 0 ? '#F1EFFD' : 
                               index === 1 ? '#FFE7E7' : 
                               '#FFF3E4'
              }}
            >
              <motion.div 
                variants={fadeIn('up', 0.5 * (index + 1))}
                className="text-3xl"
              >
                {feature.icon}
              </motion.div>
            </motion.div>
            <motion.h3 
              variants={textVariant(0.3)}
              className="text-2xl font-medium mb-3"
            >
              {feature.title}
            </motion.h3>
            <motion.p 
              variants={fadeIn('up', 0.6 * (index + 1))}
              className="text-gray-500 text-center"
            >
              {feature.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={fadeIn('up', 0.7)}
        className="text-center mt-12"
      >
        <motion.button 
          variants={fadeIn('up', 0.8)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white cursor-pointer px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors relative"
        >
          Book Now!
          <div className="absolute -z-10 w-full h-full rounded-full bg-blue-600/30 blur-xl top-0 left-0"></div>
        </motion.button>
      </motion.div>
    </motion.section>
  )
}

export default FeatureSection