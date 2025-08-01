import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaUsers, FaGlobe, FaShieldAlt, FaMobile, FaHeart } from "react-icons/fa";
import Logo from "./components/Logo";
import AnimatedGlobe from "./components/AnimatedGlobe";
import FeatureList from "./components/FeatureList";
import AuthButtons from "./components/AuthButtons";
import ThemeToggle from "./components/ThemeToggle";

export default function HomePage({ onStartCall }) {
  const [theme, setTheme] = useState("dark");

  const testimonials = [
    {
      name: "Sarah Chen",
      country: "Singapore",
      text: "GlobalTalk helped me connect with my family in multiple countries. The translation feature is amazing!",
      avatar: "👩‍💼"
    },
    {
      name: "Marco Rodriguez",
      country: "Spain", 
      text: "Perfect for international business meetings. Crystal clear video quality and seamless experience.",
      avatar: "👨‍💻"
    },
    {
      name: "Aisha Kumar",
      country: "India",
      text: "Finally found a platform that truly connects cultures. Easy to use and very reliable.",
      avatar: "👩‍🎓"
    }
  ];

  const features = [
    {
      icon: <FaGlobe className="text-4xl text-blue-400" />,
      title: "Global Connectivity",
      description: "Connect with anyone, anywhere in the world instantly"
    },
    {
      icon: <FaUsers className="text-4xl text-green-400" />,
      title: "Multi-participant Calls",
      description: "Host group video calls with up to 50 participants"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-purple-400" />,
      title: "End-to-End Security",
      description: "Your conversations are protected with military-grade encryption"
    },
    {
      icon: <FaMobile className="text-4xl text-pink-400" />,
      title: "Cross-Platform",
      description: "Works seamlessly across all devices and operating systems"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-10"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <Logo size={50} />
        <div className="flex items-center gap-4">
          <AuthButtons
            onLogin={() => alert("Login feature coming soon!")}
            onSignup={() => alert("Signup feature coming soon!")}
          />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect the World
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience seamless video calling with real-time translation, 
            connecting people across languages and continents in one beautiful platform.
          </motion.p>
          
          {/* Project Description */}
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold mb-6 text-center">About GlobalTalk Connect</h2>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">Our Mission</h3>
                  <p className="text-gray-300 leading-relaxed">
                    To break down language barriers and connect people from different cultures through 
                    innovative video communication technology. We believe that every conversation has 
                    the power to build bridges and create understanding.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-purple-300">Why Choose Us?</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Free forever with premium features</li>
                    <li>• No downloads or installations required</li>
                    <li>• Real-time language translation</li>
                    <li>• Enterprise-grade security</li>
                    <li>• 99.9% uptime guarantee</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <AnimatedGlobe />
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group"
            onClick={onStartCall}
          >
            <span className="relative z-10 flex items-center gap-3">
              <FaPlay /> Start Your Journey
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          </motion.button>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group text-center"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-white">{feature.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Original Features List */}
        <FeatureList />

        {/* Testimonials */}
        <motion.div
          className="mt-16 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-blue-300 text-sm">{testimonial.country}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          className="mt-16 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Click Start Call", description: "Simply click the start button to begin your journey" },
              { step: "2", title: "Setup & Preview", description: "Configure your settings and test your camera/microphone" },
              { step: "3", title: "Connect & Talk", description: "Share your room ID and start meaningful conversations" }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-blue-200">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          {[
            { number: "10M+", label: "Connections Made" },
            { number: "150+", label: "Countries" },
            { number: "12+", label: "Languages" },
            { number: "99.9%", label: "Uptime" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.9 + index * 0.1 }}
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
              <div className="text-blue-200">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-blue-300 text-sm bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span>Made with</span>
          <FaHeart className="text-red-400" />
          <span>for connecting the world</span>
        </motion.div>
        <p>
          © {new Date().getFullYear()} GlobalTalk Connect. Bringing the world together, one conversation at a time.
        </p>
      </footer>
    </div>
  );
}
