import React from 'react'
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { Lightbulb, Settings, Users, Home } from 'lucide-react';

const PurposeSection = () => {
    const features = [
    {
      icon: <Lightbulb className="w-8 h-8 text-indigo-600" />,
      title: "Innovation First",
      description: "We blend cutting-edge design with voice-enabled AI and smart tech for a living experience that adapts to you."
    },
    {
      icon: <Users className="w-8 h-8 text-rose-500" />,
      title: "Designed Around You",
      description: "Every space we build is personalized to fit your lifestyle, habits, and aesthetic preferences."
    },
    {
      icon: <Settings className="w-8 h-8 text-amber-500" />,
      title: "Integrated Functionality",
      description: "From Murphy beds to smart mirrors, our modular systems sync to make your room more than just a room."
    },
    {
      icon: <Home className="w-8 h-8 text-green-600" />,
      title: "Future-Proof Comfort",
      description: "With ambient lighting, voice controls, and automation, your space evolves as your needs change."
    }
  ];
  return (
    <section id="about" className="w-full bg-[#eff9fb] py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          variants={fadeIn('right', 0.2)}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-3 grid-cols-1 gap-8"
        >
          <motion.div variants={fadeIn('right', 0.3)}>
            <motion.div 
              variants={fadeIn('up', 0.4)}
              className="text-sm text-purple-600 font-medium mb-2"
            >
              WHY WE EXIST
            </motion.div>
            <motion.h2 
              variants={textVariant(0.5)}
              className="text-3xl md:w-4/5 md:text-4xl font-bold text-gray-900"
            >
              Designing Smart Spaces with Purpose
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={fadeIn('left', 0.3)}
            className="col-span-2 grid grid-cols-1 md:grid-cols-2 justify-between gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeIn('up', 0.3 * (index + 1))}
                className="flex items-start space-x-4"
              >
                <motion.div 
                  variants={fadeIn('right', 0.4 * (index + 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg"
                >
                  {feature.icon}
                </motion.div>
                <motion.div variants={fadeIn('left', 0.4 * (index + 1))}>
                  <motion.h3 
                    variants={textVariant(0.3)}
                    className="text-xl font-semibold text-gray-900 mb-2"
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    variants={fadeIn('up', 0.4)}
                    className="text-gray-600"
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default PurposeSection