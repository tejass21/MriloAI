import { Instagram, Twitter, Sparkles, User } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="w-full py-4 border-t border-[#2A2A2A] bg-[#121212]/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/20 to-[#8B5CF6]/0 blur-sm group-hover:blur-md transition-all duration-300" />
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <User className="w-4 h-4 text-white" />
                <div className="absolute inset-0 bg-[#8B5CF6]/20 group-hover:bg-[#8B5CF6]/30 transition-all duration-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]" />
            </motion.div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-400/80">© 2025</span>
              <span className="font-medium text-white">MriloAi</span>
              <span className="text-gray-400/80">•</span>
              <span className="text-gray-400/80">Built by</span>
              <span className="font-medium text-white">Tejas Bachute</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400/80 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all duration-300 p-2"
              onClick={() => window.open('https://x.com/mriloai', '_blank')}
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400/80 hover:text-[#E1306C] hover:bg-[#E1306C]/10 transition-all duration-300"
              onClick={() => window.open('https://www.instagram.com/mriloai?igsh=MTQ3d2o1Ym94c3cwOA==', '_blank')}
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}; 