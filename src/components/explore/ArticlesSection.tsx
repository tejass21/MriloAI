import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Tag, ArrowRight, Sparkles, Cpu, DollarSign, Palette, Trophy, Film } from 'lucide-react';
import { ArticleDetail } from './ArticleDetail';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  readTime: string;
  imageUrl: string;
  link: string;
  content: string[];
}

const articles: Article[] = [
  // For You Articles
  {
    id: '1',
    title: 'Personal AI Assistants: Your Digital Companion',
    description: 'How AI is becoming your personal assistant for daily tasks and productivity.',
    category: 'For You',
    subCategory: 'AI Tools',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Personal AI assistants have evolved from simple task managers to sophisticated digital companions that understand context, learn from interactions, and adapt to individual needs. These AI-powered tools are revolutionizing how we manage our daily lives, from scheduling appointments to handling complex work tasks.',
      'The latest generation of AI assistants combines natural language processing with machine learning to provide more human-like interactions. They can understand context, maintain conversation history, and even anticipate user needs based on past behavior and preferences.',
      'Key features of modern AI assistants include voice recognition, natural language understanding, and the ability to integrate with various apps and services. They can help with everything from setting reminders and managing emails to providing personalized recommendations and automating routine tasks.',
      'As AI technology continues to advance, personal assistants are becoming increasingly proactive. They can now predict user needs, suggest relevant actions, and even make decisions on behalf of users while maintaining transparency and user control.',
      'The future of personal AI assistants looks promising, with developments in emotional intelligence, better context understanding, and more natural interactions. These tools are set to become even more integral to our daily lives, helping us work smarter and live better.'
    ]
  },
  {
    id: '2',
    title: 'Smart Home Automation Guide',
    description: 'Transform your home with the latest smart home technologies and automation.',
    category: 'For You',
    subCategory: 'Smart Living',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Smart home automation has transformed from a luxury to a practical necessity in modern living. With the integration of IoT devices and AI-powered systems, homeowners can now control and monitor their homes with unprecedented ease and efficiency.',
      'The foundation of a smart home lies in its connected devices. From smart thermostats that learn your preferences to security cameras that provide real-time monitoring, these devices work together to create a seamless living experience.',
      'Voice assistants like Amazon Alexa and Google Home have become central to smart home control, allowing users to manage their devices through simple voice commands. This hands-free approach to home management is particularly valuable for accessibility and convenience.',
      'Energy efficiency is a major benefit of smart home automation. Smart thermostats and lighting systems can automatically adjust based on occupancy and natural light, significantly reducing energy consumption and utility costs.',
      'Security has also been enhanced through smart home technology. Modern systems can detect unusual activity, send alerts to your phone, and even integrate with emergency services when needed. This provides peace of mind whether you\'re at home or away.'
    ]
  },
  {
    id: '3',
    title: 'Digital Wellness: Finding Balance',
    description: 'Tips and tools for maintaining digital wellness in our connected world.',
    category: 'For You',
    subCategory: 'Wellness',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'In our increasingly connected world, digital wellness has become crucial for maintaining mental and physical health. The constant presence of technology in our lives requires conscious effort to maintain a healthy balance.',
      'Digital wellness involves creating healthy boundaries with technology. This includes setting specific times for checking emails and social media, using app timers to limit screen time, and creating tech-free zones in your home.',
      'Mindfulness apps and digital wellness tools can help track and improve your relationship with technology. These tools provide insights into your digital habits and suggest ways to develop healthier patterns.',
      'Physical health is also impacted by our digital habits. Simple practices like taking regular screen breaks, maintaining good posture while using devices, and using blue light filters can significantly improve your digital wellness.',
      'Building a sustainable digital wellness routine requires consistency and self-awareness. Start with small changes and gradually build habits that support your overall well-being in the digital age.'
    ]
  },

  // Tech & Science Articles
  {
    id: '4',
    title: 'The Future of AI in Healthcare',
    description: 'Exploring how artificial intelligence is revolutionizing medical diagnosis and treatment.',
    category: 'Tech & Science',
    subCategory: 'Healthcare',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Artificial Intelligence is transforming healthcare in unprecedented ways, from improving diagnostic accuracy to accelerating drug discovery. The integration of AI in medical practice is revolutionizing how healthcare providers deliver care.',
      'One of the most significant applications of AI in healthcare is in medical imaging analysis. AI algorithms can now detect abnormalities in X-rays, MRIs, and CT scans with accuracy rates that match or exceed human experts.',
      'AI-powered predictive analytics are helping healthcare providers identify potential health issues before they become serious. By analyzing patient data and medical history, these systems can forecast health risks and recommend preventive measures.',
      'Drug discovery and development have been significantly accelerated by AI. Machine learning algorithms can analyze vast amounts of data to identify potential drug candidates and predict their effectiveness, reducing the time and cost of drug development.',
      'The future of AI in healthcare looks promising, with developments in personalized medicine, automated surgery assistance, and improved patient care coordination. However, it\'s crucial to maintain a balance between technological advancement and human touch in healthcare delivery.'
    ]
  },
  {
    id: '5',
    title: 'Quantum Computing Breakthrough',
    description: 'Scientists achieve major milestone in quantum computing stability and error correction.',
    category: 'Tech & Science',
    subCategory: 'Computing',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1510751007277-36932aac9ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'A groundbreaking achievement in quantum computing has brought us closer to practical quantum applications. Researchers have successfully demonstrated improved stability and error correction in quantum systems, addressing one of the major challenges in quantum computing.',
      'The new approach to quantum error correction involves a novel method of protecting quantum information from environmental interference. This breakthrough could significantly extend the coherence time of quantum bits, making quantum computers more reliable and practical.',
      'The research team implemented a new architecture that combines multiple quantum error correction techniques. This hybrid approach provides better protection against both systematic and random errors, which are common in quantum systems.',
      'This development has important implications for various fields, including cryptography, drug discovery, and climate modeling. Quantum computers could now potentially solve complex problems that are currently impossible for classical computers.',
      'While there are still challenges to overcome before quantum computing becomes mainstream, this breakthrough represents a significant step forward in making quantum computers more practical and accessible for real-world applications.'
    ]
  },
  {
    id: '6',
    title: 'Space Exploration: Mars Mission',
    description: 'Latest developments in Mars colonization and the challenges of interplanetary travel.',
    category: 'Tech & Science',
    subCategory: 'Space',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Mars colonization efforts have reached new heights with recent technological advancements and successful missions. The red planet has become the primary target for human expansion beyond Earth, with multiple space agencies and private companies working towards this goal.',
      'One of the most significant challenges in Mars colonization is the development of sustainable life support systems. Recent breakthroughs in closed-loop life support technology have shown promising results in maintaining oxygen levels and recycling water in simulated Mars environments.',
      'The development of Mars-specific construction materials has also made progress. Scientists have discovered ways to create building materials using Martian soil, which could significantly reduce the cost and complexity of establishing permanent settlements.',
      'Radiation protection remains a critical concern for Mars missions. New shielding technologies and habitat designs are being developed to protect astronauts from harmful cosmic radiation during both the journey and their stay on Mars.',
      'The psychological aspects of long-duration space missions are being carefully studied. Research into crew dynamics, isolation effects, and countermeasures is helping prepare astronauts for the challenges of living on Mars.'
    ]
  },

  // Finance Articles
  {
    id: '7',
    title: 'Cryptocurrency Market Trends',
    description: 'Analysis of current cryptocurrency market trends and future predictions.',
    category: 'Finance',
    subCategory: 'Crypto',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'The cryptocurrency market continues to evolve, with new trends emerging that are reshaping the landscape of digital assets. Recent developments in blockchain technology and regulatory frameworks are influencing market dynamics.',
      'DeFi (Decentralized Finance) has emerged as a major trend, offering traditional financial services through blockchain technology. This innovation is creating new opportunities for lending, borrowing, and trading without traditional intermediaries.',
      'NFTs (Non-Fungible Tokens) have expanded beyond digital art to include real estate, intellectual property, and even physical assets. This tokenization of real-world assets is creating new investment opportunities and market dynamics.',
      'Environmental concerns have led to the rise of green cryptocurrencies and sustainable mining practices. Investors are increasingly considering the environmental impact of their crypto investments.',
      'Regulatory developments worldwide are bringing more structure to the crypto market. While this may create short-term uncertainty, it\'s expected to lead to greater institutional adoption and market stability.'
    ]
  },
  {
    id: '8',
    title: 'Sustainable Investing Guide',
    description: 'How to build a portfolio focused on environmental and social responsibility.',
    category: 'Finance',
    subCategory: 'Investment',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Sustainable investing has grown from a niche strategy to a mainstream approach that considers environmental, social, and governance (ESG) factors alongside financial returns. This comprehensive guide explores how to build a portfolio that aligns with your values.',
      'The first step in sustainable investing is understanding the various approaches available. These include ESG integration, impact investing, and socially responsible investing (SRI), each with its own focus and methodology.',
      'Research and due diligence are crucial in sustainable investing. Investors need to evaluate companies\' environmental impact, social practices, and corporate governance structures. This involves analyzing sustainability reports, carbon footprints, and social impact metrics.',
      'Diversification remains important in sustainable investing. The market now offers a wide range of ESG-focused mutual funds, ETFs, and individual stocks across different sectors and regions.',
      'Measuring impact is becoming increasingly sophisticated. New tools and metrics are helping investors track both financial performance and environmental/social impact, making it easier to align investments with sustainability goals.'
    ]
  },
  {
    id: '9',
    title: 'Global Economic Outlook',
    description: 'Expert analysis of global economic trends and their impact on markets.',
    category: 'Finance',
    subCategory: 'Economy',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'The global economy is navigating through a complex landscape of challenges and opportunities. Recent developments in technology, climate change, and geopolitical relations are reshaping economic patterns worldwide.',
      'Digital transformation continues to drive economic growth, with emerging technologies creating new industries and disrupting traditional business models. The rise of artificial intelligence and automation is particularly significant.',
      'Climate change is increasingly influencing economic policy and business decisions. The transition to a low-carbon economy is creating both challenges and opportunities for businesses and investors.',
      'Global trade patterns are evolving, with supply chain resilience becoming a key focus. Companies are diversifying their supply chains and exploring local manufacturing options to reduce risks.',
      'The future of work is being redefined by remote work and digital collaboration. This shift is affecting everything from office real estate to urban development patterns.'
    ]
  },

  // Arts & Culture Articles
  {
    id: '10',
    title: 'Digital Art Revolution',
    description: 'How NFTs and digital art are transforming the traditional art world.',
    category: 'Arts & Culture',
    subCategory: 'Digital Art',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'The art world is experiencing a revolutionary transformation through digital technology and blockchain. NFTs (Non-Fungible Tokens) have created new ways for artists to monetize their work and reach global audiences.',
      'Digital art platforms are democratizing art creation and distribution. Artists can now create, showcase, and sell their work without traditional gatekeepers, while collectors can easily verify authenticity and ownership.',
      'The intersection of art and technology is creating new forms of expression. From AI-generated art to interactive digital installations, artists are exploring innovative ways to create and present their work.',
      'Traditional art institutions are adapting to the digital revolution. Museums and galleries are incorporating digital art into their collections and creating virtual exhibitions to reach broader audiences.',
      'The future of art is increasingly digital, with virtual reality and augmented reality offering new possibilities for immersive artistic experiences. This evolution is changing how we create, collect, and experience art.'
    ]
  },
  {
    id: '11',
    title: 'Modern Architecture Trends',
    description: 'Exploring the latest trends in sustainable and innovative architecture.',
    category: 'Arts & Culture',
    subCategory: 'Architecture',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Contemporary architecture is embracing sustainability and innovation in unprecedented ways. Modern buildings are not just structures but living, breathing entities that interact with their environment.',
      'Biophilic design is gaining prominence, incorporating natural elements and patterns into built environments. This approach has been shown to improve occupant well-being and productivity while reducing environmental impact.',
      'Smart building technology is revolutionizing how buildings operate. From automated climate control to energy management systems, buildings are becoming more efficient and responsive to user needs.',
      'Sustainable materials are at the forefront of architectural innovation. Architects are exploring new materials and construction methods that reduce carbon footprint and improve building performance.',
      'The future of architecture is increasingly focused on adaptability and resilience. Buildings are being designed to withstand climate change impacts while maintaining aesthetic appeal and functionality.'
    ]
  },
  {
    id: '12',
    title: 'Cultural Heritage Preservation',
    description: 'How technology is helping preserve and restore cultural heritage sites.',
    category: 'Arts & Culture',
    subCategory: 'Heritage',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Technology is playing a crucial role in preserving and restoring cultural heritage sites worldwide. Advanced imaging and scanning techniques are helping document and protect historical structures.',
      '3D scanning and modeling have revolutionized heritage preservation. These technologies allow for detailed documentation of historical sites and artifacts, creating digital archives for future generations.',
      'Artificial intelligence is being used to analyze and predict potential threats to heritage sites. Machine learning algorithms can identify patterns of deterioration and suggest preventive measures.',
      'Virtual reality is making cultural heritage more accessible. Digital reconstructions allow people to explore historical sites that may be too fragile for physical visits or too remote to access.',
      'The combination of traditional preservation methods with modern technology is creating new possibilities for heritage conservation. This hybrid approach ensures both physical protection and digital accessibility.'
    ]
  },

  // Sports Articles
  {
    id: '13',
    title: 'Esports Evolution',
    description: 'The rise of competitive gaming and its impact on traditional sports.',
    category: 'Sports',
    subCategory: 'Esports',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Esports has evolved from a niche hobby to a global phenomenon, challenging traditional sports in terms of viewership and revenue. The industry continues to grow with increasing professionalization and mainstream acceptance.',
      'Professional esports organizations are now structured similarly to traditional sports teams, with dedicated training facilities, coaching staff, and support systems. This professionalization has led to improved performance and higher production values.',
      'The integration of technology in esports is creating new opportunities for fan engagement. Virtual reality, augmented reality, and interactive streaming platforms are enhancing the viewing experience.',
      'Esports is becoming increasingly inclusive, with more opportunities for players from diverse backgrounds. Initiatives to support women in esports and promote diversity are gaining momentum.',
      'The future of esports looks promising, with developments in mobile gaming, cloud gaming, and cross-platform competition. These innovations are making esports more accessible and engaging for a broader audience.'
    ]
  },
  {
    id: '14',
    title: 'Sports Technology',
    description: 'How technology is enhancing athletic performance and training methods.',
    category: 'Sports',
    subCategory: 'Technology',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Technology is revolutionizing how athletes train and perform. From wearable devices to advanced analytics, sports technology is providing unprecedented insights into athletic performance.',
      'Wearable technology has become essential in sports training. Devices tracking heart rate, movement patterns, and biometric data help athletes optimize their performance and prevent injuries.',
      'Artificial intelligence and machine learning are transforming sports analytics. These technologies can analyze vast amounts of data to identify patterns and provide personalized training recommendations.',
      'Virtual reality and augmented reality are creating new training possibilities. Athletes can now practice in simulated environments and receive real-time feedback on their technique.',
      'The integration of technology in sports is not just about performance enhancement. It\'s also improving safety, accessibility, and fan engagement, making sports more inclusive and engaging for everyone.'
    ]
  },
  {
    id: '15',
    title: 'Women in Sports',
    description: 'Breaking barriers and celebrating achievements of women in sports.',
    category: 'Sports',
    subCategory: 'Women',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Women\'s sports have seen remarkable growth and progress in recent years, with increasing recognition, support, and opportunities for female athletes across all levels of competition.',
      'Professional women\'s leagues are gaining more visibility and commercial success. From soccer to basketball, women\'s sports are attracting larger audiences and securing better sponsorship deals.',
      'Equal pay and treatment remain important focus areas. Recent victories in this space have set precedents for fair compensation and professional treatment of female athletes.',
      'Youth programs are expanding to provide more opportunities for girls in sports. These initiatives are creating pathways for the next generation of female athletes and leaders in sports.',
      'Media coverage of women\'s sports is improving, with more dedicated coverage and in-depth analysis. This increased visibility is helping to break down stereotypes and inspire young athletes.'
    ]
  },

  // Entertainment Articles
  {
    id: '16',
    title: 'Streaming Wars',
    description: 'The battle for dominance in the streaming entertainment industry.',
    category: 'Entertainment',
    subCategory: 'Streaming',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'The streaming entertainment landscape is becoming increasingly competitive as major players vie for subscribers. Content quality, exclusivity, and user experience are key battlegrounds in this digital entertainment war.',
      'Original content production has become a crucial differentiator. Streaming services are investing billions in creating exclusive shows and movies to attract and retain subscribers.',
      'Technology plays a vital role in the streaming wars. Advanced features like 4K streaming, offline downloads, and personalized recommendations are becoming standard offerings.',
      'The global nature of streaming is changing content creation and distribution. International markets are driving growth, leading to more diverse and multilingual content offerings.',
      'The future of streaming may see consolidation and new business models. Services are exploring options like ad-supported tiers and bundled offerings to remain competitive.'
    ]
  },
  {
    id: '17',
    title: 'Virtual Reality Gaming',
    description: 'The future of gaming with virtual and augmented reality technologies.',
    category: 'Entertainment',
    subCategory: 'Gaming',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'Virtual Reality (VR) gaming is transforming the gaming industry by offering unprecedented levels of immersion and interactivity. The technology continues to evolve with more sophisticated hardware and software solutions.',
      'New VR technologies are making gaming more accessible and comfortable. Improvements in headset design, motion tracking, and haptic feedback are creating more natural and enjoyable gaming experiences.',
      'Game developers are creating innovative VR-specific content. From action-packed adventures to social gaming spaces, VR is enabling new types of gaming experiences.',
      'The social aspects of VR gaming are expanding. Virtual spaces allow players to interact and play together in ways that weren\'t possible before.',
      'As VR technology becomes more affordable and widespread, it\'s expected to become a mainstream gaming platform, potentially revolutionizing how we play and interact with games.'
    ]
  },
  {
    id: '18',
    title: 'Music Industry Evolution',
    description: 'How digital platforms are reshaping the music industry landscape.',
    category: 'Entertainment',
    subCategory: 'Music',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    link: '#',
    content: [
      'The music industry continues to undergo significant transformation in the digital age. Streaming platforms have become the primary way people consume music, changing how artists create, distribute, and monetize their work.',
      'Digital platforms are democratizing music production and distribution. Independent artists can now reach global audiences without traditional record label support.',
      'Artificial intelligence is influencing music creation and discovery. AI tools are being used for everything from music composition to personalized playlist curation.',
      'Live streaming and virtual concerts have emerged as new revenue streams. These digital performances are creating new ways for artists to connect with fans and generate income.',
      'The future of music consumption may include more interactive and immersive experiences. Technologies like virtual reality and augmented reality are opening new possibilities for music experiences.'
    ]
  }
];

const categories = [
  { id: 'for-you', name: 'For You', icon: Sparkles },
  { id: 'tech-science', name: 'Tech & Science', icon: Cpu },
  { id: 'finance', name: 'Finance', icon: DollarSign },
  { id: 'arts-culture', name: 'Arts & Culture', icon: Palette },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'entertainment', name: 'Entertainment', icon: Film },
];

export const ArticlesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('for-you');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = articles.filter(article => 
    selectedCategory === 'for-you' ? true : article.category === categories.find(c => c.id === selectedCategory)?.name
  );

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        {/* Categories Navigation */}
        <div className="mb-8 overflow-x-auto">
          <motion.div 
            className="flex space-x-2 min-w-max pb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                      : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-[#1A1A1A] rounded-xl overflow-hidden hover:bg-[#1E1E1E] transition-all duration-300 hover:shadow-lg hover:shadow-[#8B5CF6]/10 cursor-pointer"
              onClick={() => handleArticleClick(article)}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/10 to-[#8B5CF6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Enhanced gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/70 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                  
                  {/* Glowing effect on hover */}
                  <div className="absolute inset-0 bg-[#8B5CF6]/0 group-hover:bg-[#8B5CF6]/10 transition-colors duration-300" />
                  
                  {/* Text content with improved styling */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100">
                        <div className="bg-[#8B5CF6] rounded-full p-1">
                          <Tag className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium tracking-wide">
                            {article.subCategory}
                          </span>
                          <span className="text-[#8B5CF6]">•</span>
                          <span className="text-sm text-gray-400 font-medium">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#8B5CF6] transition-colors duration-300 drop-shadow-lg">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={handleCloseArticle}
          />
        )}
      </AnimatePresence>
    </>
  );
}; 