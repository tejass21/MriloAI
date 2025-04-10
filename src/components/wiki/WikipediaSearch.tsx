import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";

interface WikiResult {
  title: string;
  snippet: string;
  pageid: number;
  timestamp: string;
  size: number;
  wordcount: number;
  ns: number;
}

export const WikipediaSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WikiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setTotalHits(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            searchQuery
          )}&format=json&origin=*&srlimit=10&srinfo=totalhits`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from Wikipedia');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.info || 'An error occurred while searching');
        }

        setResults(data.query.search);
        setTotalHits(data.query.searchinfo.totalhits);
      } catch (error) {
        console.error("Error fetching Wikipedia data:", error);
        setError(error instanceof Error ? error.message : 'An error occurred while searching');
        setResults([]);
        setTotalHits(0);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Function to clean and format the snippet HTML
  const formatSnippet = (snippet: string) => {
    // Replace search match spans with highlighted text
    const cleanSnippet = snippet.replace(
      /<span class="searchmatch">([^<]+)<\/span>/g,
      '<span class="bg-[#8B5CF6]/20 text-[#8B5CF6] px-1 rounded">$1</span>'
    );
    return cleanSnippet;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Search <span className="text-[#8B5CF6]">Wikipedia</span>
          </h2>
          <p className="text-gray-400">Get instant access to Wikipedia articles with real-time search</p>
        </div>

        {/* Search Container */}
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4 sm:p-6">
          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any topic..."
              className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Results */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <div className="w-8 h-8 border-3 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Searching Wikipedia...</p>
            </div>
          ) : results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#1A1A1A]/50 rounded-lg border border-[#2A2A2A] overflow-hidden"
            >
              <div className="p-3 border-b border-[#2A2A2A] bg-[#1A1A1A]">
                <p className="text-sm text-gray-400">
                  Found <span className="text-white font-medium">{totalHits.toLocaleString()}</span> results
                  {totalHits > 10 && " (showing top 10)"}
                </p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {results.map((result) => (
                  <motion.a
                    key={result.pageid}
                    href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 hover:bg-[#2A2A2A] transition-colors border-b border-[#2A2A2A] last:border-b-0"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1 hover:text-[#8B5CF6] transition-colors">
                          {result.title}
                        </h3>
                        <p
                          className="text-sm text-gray-400 mb-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatSnippet(result.snippet) }}
                        />
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(result.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            {formatSize(result.size)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {result.wordcount.toLocaleString()} words
                          </span>
                        </div>
                      </div>
                      <motion.div
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ) : query.trim() !== "" && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <p className="text-gray-400">No results found for "{query}"</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <p className="text-gray-400">Type something to search Wikipedia</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WikipediaSearch; 