import React from 'react';
import { motion } from 'framer-motion';
import { FlaggedContent } from '../types';
import storage from '../utils/storage';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, MessageCircle, Book } from 'lucide-react';
import Button from '../components/ui/Button';

const AdminPage: React.FC = () => {
  const [flaggedContent, setFlaggedContent] = React.useState<FlaggedContent[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'reviewed'>('all');
  const [riskFilter, setRiskFilter] = React.useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  
  React.useEffect(() => {
    const content = storage.getFlaggedContent();
    setFlaggedContent(content);
  }, []);
  
  const handleMarkReviewed = (id: string) => {
    const profile = storage.getUserProfile();
    const updated = storage.updateFlaggedContent(id, {
      reviewed: true,
      reviewedAt: Date.now(),
      reviewedBy: profile.name || 'Admin',
    });
    
    if (updated) {
      setFlaggedContent(prev => 
        prev.map(item => item.id === id ? updated : item)
      );
    }
  };
  
  const filteredContent = React.useMemo(() => {
    return flaggedContent
      .filter(item => {
        if (filter === 'pending') return !item.reviewed;
        if (filter === 'reviewed') return item.reviewed;
        return true;
      })
      .filter(item => {
        if (riskFilter === 'all') return true;
        return item.riskLevel === riskFilter;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [flaggedContent, filter, riskFilter]);

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 pt-8 bg-gradient-to-b from-dark-purple-50 via-white to-dark-purple-100 dark:from-dark-purple-950 dark:via-dark-purple-900 dark:to-dark-purple-950">
      <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-dark-purple-900 dark:text-dark-purple-100">Admin Dashboard</h1>
        <p className="text-black dark:text-gray-200">Monitor and review flagged content</p>
      </div>
      
      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {/* Status filter */}
        {(['all', 'pending', 'reviewed'] as const).map((option) => (
          <Button
            key={option}
            variant={filter === option ? 'primary' : 'outline'}
            onClick={() => setFilter(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Button>
        ))}
        {/* Risk level filter */}
        <span className="ml-4 font-medium text-gray-600">Risk Level:</span>
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map((level) => (
          <Button
            key={level}
            variant={riskFilter === level ? 'primary' : 'outline'}
            onClick={() => setRiskFilter(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Button>
        ))}
      </div>
      
      {/* Content list */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg border border-dark-purple-200 dark:border-dark-purple-700">
            <AlertTriangle size={32} className="mx-auto mb-4 text-dark-purple-400 dark:text-dark-purple-600" />
            <p className="text-dark-purple-600 dark:text-dark-purple-400">No flagged content found</p>
          </div>
        ) : (
          filteredContent.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg p-6 border border-dark-purple-200 dark:border-dark-purple-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {item.type === 'chat' ? (
                    <MessageCircle size={20} className="text-dark-purple-600 dark:text-dark-purple-400" />
                  ) : (
                    <Book size={20} className="text-dark-purple-600 dark:text-dark-purple-400" />
                  )}
                  <span className="text-sm font-medium capitalize text-black dark:text-white">{item.type}</span>
                </div>
                
                {item.reviewed ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm">Reviewed</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleMarkReviewed(item.id)}
                  >
                    Mark as Reviewed
                  </Button>
                )}
              </div>
              
              <div className="mt-4">
                <div className="bg-dark-purple-100 dark:bg-dark-purple-700 border-l-4 border-dark-purple-400 dark:border-dark-purple-500 p-4 mb-4">
                  <p className="text-dark-purple-700 dark:text-dark-purple-300 text-sm font-medium">
                    Reason for flagging:
                  </p>
                  <p className="text-dark-purple-600 dark:text-dark-purple-400">{item.reason}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Risk Level: <span className="font-semibold capitalize">{item.riskLevel}</span></p>
                </div>
                
                <div className="bg-dark-purple-100 dark:bg-dark-purple-700 p-4 rounded">
                  <p className="text-black dark:text-white whitespace-pre-wrap">{item.content}</p>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-dark-purple-600 dark:text-dark-purple-400 flex items-center justify-between">
                <span>
                  Flagged on {format(item.timestamp, 'MMM d, yyyy - h:mm a')}
                </span>
                
                {item.reviewed && (
                  <span>
                    Reviewed by {item.reviewedBy} on{' '}
                    {format(item.reviewedAt!, 'MMM d, yyyy - h:mm a')}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default AdminPage;