import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Tag, Clock } from 'lucide-react';

interface ArticleDetailProps {
  article: {
    id: string;
    title: string;
    description: string;
    category: string;
    subCategory: string;
    readTime: string;
    imageUrl: string;
    link: string;
    content: string[];
  };
  onClose: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0A0A0A] z-50 overflow-y-auto"
    >
      {/* Back button */}
      <button
        onClick={onClose}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-full text-white hover:bg-[#2A2A2A] transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Articles</span>
      </button>

      {/* Article content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="relative h-[60vh] rounded-xl overflow-hidden mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          
          {/* Article metadata */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-[#8B5CF6] px-3 py-1 rounded-full">
                <Tag className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">{article.subCategory}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{article.readTime}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
            <p className="text-xl text-gray-300">{article.description}</p>
          </div>
        </div>

        {/* Article body */}
        <div className="prose prose-invert max-w-none">
          {article.content.map((paragraph, index) => (
            <p key={index} className="text-gray-300 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 