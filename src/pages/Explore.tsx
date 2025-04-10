import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Bookmark, Share2, MoreVertical, ArrowLeft } from 'lucide-react';
import TeamWorkspace from '../components/explore/TeamWorkspace';
import { ArticlesSection } from '../components/explore/ArticlesSection';
import { useNavigate } from 'react-router-dom';

export const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(() => {
    // Initialize from localStorage or default to empty string
    return localStorage.getItem('exploreSearchQuery') || '';
  });
  const [showFilter, setShowFilter] = useState(() => {
    // Initialize from localStorage or default to false
    return localStorage.getItem('exploreShowFilter') === 'true';
  });

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('exploreSearchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('exploreShowFilter', showFilter.toString());
  }, [showFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Add your search logic here
    console.log('Searching for:', e.target.value);
  };

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
    // Add your filter logic here
    console.log('Filter clicked');
  };

  const handleBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1A1A1A] z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h1 className="text-2xl font-bold text-white">Explore</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors duration-300">
                <Bookmark className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors duration-300">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors duration-300">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-full pt-16 overflow-y-auto">
        {/* Search Section */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search articles, topics, or authors..."
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-full pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6] transition-colors duration-300"
              />
            </div>
            <button 
              onClick={handleFilterClick}
              className={`p-3 rounded-full transition-colors duration-300 ${
                showFilter ? 'bg-[#8B5CF6] text-white' : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#2A2A2A]'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
          {showFilter && (
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#2A2A2A] mb-4">
              <h3 className="text-white font-semibold mb-2">Filter Options</h3>
              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <input type="checkbox" className="mr-2" />
                  Latest Articles
                </label>
                <label className="flex items-center text-gray-300">
                  <input type="checkbox" className="mr-2" />
                  Most Popular
                </label>
                <label className="flex items-center text-gray-300">
                  <input type="checkbox" className="mr-2" />
                  Featured Content
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Team Workspace Section */}
        <section className="border-t border-[#1A1A1A] bg-[#0A0A0A]">
          <TeamWorkspace />
        </section>

        {/* Articles Section */}
        <section className="border-t border-[#1A1A1A]">
          <ArticlesSection />
        </section>
      </main>
    </div>
  );
}; 