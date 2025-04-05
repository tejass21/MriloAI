import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Brain, Target, Zap, Shield, BarChart, Plus, ArrowRight, CheckCircle2, Star, Clock, MessageSquare, Sparkles, Rocket, Lightbulb, Heart, X } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Collaborative Environment',
    description: 'Create dedicated spaces for your team to work together seamlessly. Share ideas, documents, and updates in real-time.',
    color: 'bg-blue-500/10 text-blue-500',
    benefits: ['Real-time document editing', 'Team chat and discussions', 'File sharing and storage', 'Task assignments'],
    gradient: 'from-blue-500/20 to-blue-500/5'
  },
  {
    icon: Brain,
    title: 'Knowledge Hub',
    description: 'Centralize your team\'s knowledge and resources. Access important documents, guidelines, and best practices in one place.',
    color: 'bg-purple-500/10 text-purple-500',
    benefits: ['Document version control', 'Searchable knowledge base', 'Resource library', 'Team wikis'],
    gradient: 'from-purple-500/20 to-purple-500/5'
  },
  {
    icon: Target,
    title: 'Project Management',
    description: 'Track project progress, set milestones, and manage tasks efficiently. Keep everyone aligned with project goals and deadlines.',
    color: 'bg-green-500/10 text-green-500',
    benefits: ['Kanban boards', 'Gantt charts', 'Milestone tracking', 'Task dependencies'],
    gradient: 'from-green-500/20 to-green-500/5'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Stay connected with instant notifications and updates. Never miss important announcements or changes.',
    color: 'bg-yellow-500/10 text-yellow-500',
    benefits: ['Custom notifications', 'Activity feed', 'Email alerts', 'Mobile push notifications'],
    gradient: 'from-yellow-500/20 to-yellow-500/5'
  },
  {
    icon: Shield,
    title: 'Secure Collaboration',
    description: 'Work with confidence knowing your team\'s data is protected. Advanced security features ensure your workspace remains private.',
    color: 'bg-red-500/10 text-red-500',
    benefits: ['End-to-end encryption', 'Role-based access', 'Audit logs', 'Data backup'],
    gradient: 'from-red-500/20 to-red-500/5'
  },
  {
    icon: BarChart,
    title: 'Performance Analytics',
    description: 'Monitor team productivity and project progress with detailed analytics and insights.',
    color: 'bg-indigo-500/10 text-indigo-500',
    benefits: ['Team metrics', 'Project timelines', 'Resource allocation', 'Performance reports'],
    gradient: 'from-indigo-500/20 to-indigo-500/5'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Project Manager',
    company: 'TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    text: 'Team Workspace has transformed how our remote team collaborates. The real-time features and intuitive interface make project management a breeze.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'Research Lead',
    company: 'InnovateLabs',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    text: 'The knowledge hub feature has been invaluable for our research team. We can easily share findings and maintain organized documentation.',
    rating: 5
  }
];

const TeamWorkspace: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalFeature, setModalFeature] = useState<typeof features[0] | null>(null);

  const handleFeatureClick = (feature: typeof features[0]) => {
    setModalFeature(feature);
    setShowModal(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 text-white">
      {/* Header Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 via-transparent to-[#8B5CF6]/10 blur-3xl" />
        <div className="relative">
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-[#8B5CF6] bg-clip-text text-transparent">
            Team Workspace
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your dedicated space for seamless team collaboration, project management, and knowledge sharing.
          </p>
        </div>
      </motion.div>

      {/* Features Grid with Enhanced Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div 
              className="relative bg-[#1A1A1A] rounded-xl p-6 hover:bg-[#1E1E1E] transition-all duration-300 cursor-pointer border border-[#2A2A2A] hover:border-[#8B5CF6]/30"
              onClick={() => handleFeatureClick(feature)}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#8B5CF6] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              
              {/* Feature Benefits with Animation */}
              <AnimatePresence>
                {selectedFeature === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {feature.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                        <span>{benefit}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Use Cases Section with Enhanced Visuals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 bg-[#1A1A1A] rounded-xl p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/5 via-transparent to-[#8B5CF6]/5" />
        <div className="relative">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#8B5CF6]" />
            Perfect For:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-sm">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-[#8B5CF6] transition-colors duration-300">Project Teams</h4>
                  <p className="text-gray-400">Manage projects, track progress, and collaborate effectively with your team members.</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Time tracking</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Team chat</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-sm">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-[#8B5CF6] transition-colors duration-300">Remote Teams</h4>
                  <p className="text-gray-400">Stay connected and productive with your remote team through virtual collaboration tools.</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Virtual meetings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Async communication</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-sm">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-[#8B5CF6] transition-colors duration-300">Research Groups</h4>
                  <p className="text-gray-400">Share findings, collaborate on research, and maintain organized documentation.</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Data sharing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Peer review</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-sm">4</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-[#8B5CF6] transition-colors duration-300">Creative Teams</h4>
                  <p className="text-gray-400">Collaborate on creative projects, share inspiration, and manage creative workflows.</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Asset sharing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Feedback loops</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section with Enhanced Visuals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-16"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-[#8B5CF6]" />
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#1A1A1A] rounded-xl p-6 relative group hover:bg-[#1E1E1E] transition-all duration-300 border border-[#2A2A2A] hover:border-[#8B5CF6]/30"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8B5CF6]/20 group-hover:ring-[#8B5CF6]/40 transition-all duration-300"
                />
                <div>
                  <h4 className="text-white font-semibold group-hover:text-[#8B5CF6] transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {testimonial.text}
              </p>
              <div className="flex items-center gap-1 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Modal */}
      <AnimatePresence>
        {showModal && modalFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1A1A] rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-[#2A2A2A] rounded-full transition-colors duration-300"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-xl ${modalFeature.color} flex items-center justify-center flex-shrink-0`}>
                  <modalFeature.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">{modalFeature.title}</h2>
                  <p className="text-xl text-gray-400 mb-6">{modalFeature.description}</p>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Key Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {modalFeature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-[#8B5CF6]" />
                          <span className="text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-[#8B5CF6] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#7C3AED] transition-colors duration-300 flex items-center gap-2"
                    >
                      <span>Got it</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action with Enhanced Visuals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 via-transparent to-[#8B5CF6]/10 blur-3xl" />
        <div className="relative">
          <button className="relative bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 mx-auto group border border-[#2A2A2A] hover:border-[#8B5CF6]/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#7C3AED]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#8B5CF6] group-hover:rotate-90 transition-transform duration-300" />
              <span className="bg-gradient-to-r from-white to-[#8B5CF6] bg-clip-text text-transparent">Free Space</span>
              <ArrowRight className="w-5 h-5 text-[#8B5CF6] group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamWorkspace; 