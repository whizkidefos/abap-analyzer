import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { NewspaperIcon } from '@heroicons/react/24/outline';

interface NewsItem {
  id: number;
  title: string;
  url: string;
  category: 'S/4HANA' | 'RPA';
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    title: "SAP S/4HANA Cloud 2302 Release Highlights",
    url: "https://news.sap.com/2023/02/sap-s-4hana-cloud-2302-release/",
    category: "S/4HANA"
  },
  {
    id: 2,
    title: "Automate Business Processes with SAP RPA",
    url: "https://www.sap.com/products/technology-platform/process-automation.html",
    category: "RPA"
  },
  {
    id: 3,
    title: "S/4HANA Migration Best Practices Guide",
    url: "https://www.sap.com/products/erp/s4hana.html",
    category: "S/4HANA"
  }
];

export default function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % NEWS_ITEMS.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  const currentNews = NEWS_ITEMS[currentIndex];
  
  return (
    <footer className={`fixed bottom-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
      <div className="container mx-auto px-4 py-3">
        <a
          href={currentNews.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-between gap-4 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
        >
          <span className="flex items-center gap-3 min-w-0">
            <NewspaperIcon className="h-5 w-5 flex-shrink-0" />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
              currentNews.category === 'S/4HANA' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {currentNews.category}
            </span>
            <span className="truncate">{currentNews.title}</span>
          </span>
          <span className="text-sm whitespace-nowrap">Click to learn more →</span>
        </a>
      </div>
    </footer>
  );
}