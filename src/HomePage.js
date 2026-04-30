import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlay, FaUsers, FaGlobe, FaShieldAlt, FaMobile, FaHeart, 
  FaLanguage, FaVideo, FaStar, FaArrowRight, FaCheckCircle,
  FaRocket, FaBolt, FaCrown, FaInfinity
} from "react-icons/fa";

// Modern Logo Component
const Logo = ({ size = 40 }) => (
  <motion.div 
    className="flex items-center gap-3"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400 }}
  >
    <motion.div 
      className="relative"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
        <FaGlobe size={20} className="text-white" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
    </motion.div>
    <div className="flex flex-col">
      <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
        CogniTalk
      </span>
      <span className="text-xs text-gray-500 font-medium -mt-1">Connect</span>
    </div>
  </motion.div>
);

// Modern Floating Elements
const FloatingElements = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 blur-sm"></div>
      </motion.div>
    ))}
  </>
);

// Modern Hero Globe - Smaller for side placement
const ModernGlobe = () => {
  return (
    <div className="relative w-72 h-72">
      {/* Main Globe */}
      <motion.div
        className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-2xl"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity }
        }}
      >
        {/* Globe Inner Glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-80">
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700">
            {/* Connection Points */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Orbital Rings */}
      {[180, 210, 240].map((size, index) => (
        <motion.div
          key={index}
          className="absolute border border-white/20 rounded-full"
          style={{
            width: size,
            height: size,
            left: `calc(50% - ${size/2}px)`,
            top: `calc(50% - ${size/2}px)`,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 15 + index * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Satellites */}
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
              style={{
                left: `${50 + 45 * Math.cos(i * 180 * Math.PI / 180)}%`,
                top: `${50 + 45 * Math.sin(i * 180 * Math.PI / 180)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

// Modern Feature Cards
const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative z-10">
      <motion.div 
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
        whileHover={{ rotate: [0, -5, 5, 0] }}
      >
        {feature.icon}
      </motion.div>
      
      <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
      
      <motion.div 
        className="mt-6 flex items-center text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ x: 5 }}
      >
        Learn more <FaArrowRight className="ml-2" />
      </motion.div>
    </div>
  </motion.div>
);

// Modern Stats Component
const ModernStats = () => {
  const stats = [
    { number: "10M+", label: "Active Users", icon: <FaUsers />, color: "from-blue-500 to-cyan-500" },
    { number: "150+", label: "Countries", icon: <FaGlobe />, color: "from-green-500 to-emerald-500" },
    { number: "12+", label: "Languages", icon: <FaLanguage />, color: "from-purple-500 to-pink-500" },
    { number: "99.9%", label: "Uptime", icon: <FaBolt />, color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity duration-300" 
               style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}>
          </div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center group-hover:bg-white/10 transition-all duration-300">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} mb-4 text-white`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
            <div className="text-sm text-gray-300">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Modern Testimonial Card
const TestimonialCard = ({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl mr-4">
          {testimonial.avatar}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
          <p className="text-purple-300 text-sm">{testimonial.country}</p>
          <div className="flex mt-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="w-4 h-4 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>
      <blockquote className="text-gray-300 italic leading-relaxed">
        "{testimonial.text}"
      </blockquote>
    </div>
  </motion.div>
);

export default function HomePage({ onStartCall }) {
  const [theme, setTheme] = useState("dark");

  const features = [
    {
      icon: <FaGlobe className="text-2xl text-white" />,
      title: "Global Connectivity",
      description: "Connect instantly with anyone, anywhere in the world with zero latency"
    },
    {
      icon: <FaUsers className="text-2xl text-white" />,
      title: "HD Group Calls",
      description: "Host crystal-clear video calls with up to 100 participants simultaneously"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-white" />,
      title: "Bank-Level Security",
      description: "Your conversations are protected with end-to-end encryption technology"
    },
    {
      icon: <FaLanguage className="text-2xl text-white" />,
      title: "Real-time Translation",
      description: "Break language barriers with AI-powered live translation in 50+ languages"
    },
    {
      icon: <FaMobile className="text-2xl text-white" />,
      title: "Cross-Platform",
      description: "Works flawlessly on all devices - desktop, mobile, tablet, anywhere"
    },
    {
      icon: <FaRocket className="text-2xl text-white" />,
      title: "Lightning Fast",
      description: "Ultra-low latency with our global network of edge servers worldwide"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      country: "Tech Lead, Singapore",
      text: "CogniTalk revolutionized our remote team meetings. The translation feature is absolutely game-changing!",
      avatar: "👩‍💼"
    },
    {
      name: "Marco Rodriguez", 
      country: "CEO, Barcelona",
      text: "Perfect for international business. The video quality is stunning and it never drops connection.",
      avatar: "👨‍💻"
    },
    {
      name: "Aisha Kumar",
      country: "Designer, Mumbai", 
      text: "Finally found a platform that connects cultures seamlessly. Beautiful interface and rock-solid reliability.",
      avatar: "👩‍🎓"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">
      
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <FloatingElements />
        
        {/* Gradient Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Modern Header */}
      <header className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors font-medium">Pricing</a>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors font-medium">About</a>
              </nav>
              <div className="flex items-center gap-3">
                <motion.button
  whileHover={{ scale: 1.05 }}
  onClick={() => alert("Login feature coming soon")}
  className="px-6 py-2.5 rounded-2xl border border-white/20 text-white hover:bg-white/10 transition-all font-medium"
>
  Sign In
</motion.button>

<motion.button
  whileHover={{ scale: 1.05 }}
  onClick={onStartCall}
  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-2xl hover:shadow-purple-500/30 transition-all font-medium"
>
  Get Started
</motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Hero Section with Side-by-Side Layout */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left">
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
            >
              <FaCrown className="text-yellow-400" />
              <span className="text-sm font-medium">Trusted by 10M+ users worldwide</span>
            </motion.div>

            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-8 leading-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Connect
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Beyond Borders
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Experience the future of video communication with AI-powered translation, 
              ultra-HD quality, and connections that span the globe in real-time.
            </motion.p>
            
            {/* Modern CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden"
                onClick={onStartCall}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                  <FaPlay />
                  Start Video Call
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button
  whileHover={{ scale: 1.05, y: -2 }}
onClick={() => onStartCall("DEMO123")}
  className="px-8 py-4 rounded-2xl border border-white/20 backdrop-blur-xl bg-white/5 font-bold text-lg hover:bg-white/10 transition-all"
>
  <FaVideo className="inline mr-3" />
  Watch Demo
</motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                No downloads required
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-blue-400" />
                End-to-end encrypted
              </div>
              <div className="flex items-center gap-2">
                <FaInfinity className="text-purple-400" />
                Unlimited calls
              </div>
            </motion.div>
          </div>

          {/* Right Side - Globe */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ModernGlobe />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Stats */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <ModernStats />
      </section>

      {/* Modern Features Grid */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Everything you need for seamless global communication
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>
      {/* pricing */}
      <section id="pricing" className="relative z-10 container mx-auto px-6 py-20">
  <div className="text-center mb-12">
    <h2 className="text-5xl font-bold text-white mb-4">Pricing</h2>
    <p className="text-gray-300">Choose a plan that suits you</p>
  </div>

  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    
    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
      <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
      <ul className="text-gray-300 space-y-2">
        <li>✔ One-to-one calls</li>
        <li>✔ Basic translation</li>
        <li>✔ Captions</li>
      </ul>
    </div>

    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-3xl text-white">
      <h3 className="text-2xl font-bold mb-4">Premium</h3>
      <ul className="space-y-2">
        <li>✔ HD video</li>
        <li>✔ Multi-language translation</li>
        <li>✔ Future group calls</li>
      </ul>
    </div>

  </div>
</section>
{/* About*/}
<section id="about" className="relative z-10 container mx-auto px-6 py-20 text-center">
  <h2 className="text-5xl font-bold text-white mb-6">About CogniTalk</h2>

  <p className="text-gray-300 max-w-3xl mx-auto">
    CogniTalk is a real-time multilingual video calling platform that uses 
    WebRTC, AI-based speech recognition, translation, and text-to-speech 
    technologies to enable seamless global communication.
  </p>
</section>

      {/* Modern Testimonials */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <motion.h2 
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Loved by Teams Worldwide
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <Logo />
              <p className="text-gray-400 mt-6 max-w-md leading-relaxed">
                Connecting the world through seamless video communication. 
                Breaking barriers, building bridges, one conversation at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CogniTalk Connect. All rights reserved.
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-gray-400 text-sm">
              Made with <FaHeart className="text-red-400 mx-1" /> for global connection
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
