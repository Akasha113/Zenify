import React from 'react';
import { motion } from 'framer-motion';
import { JournalEntry } from '../../types';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import Button from '../ui/Button';

interface JournalCardProps {
  journal: JournalEntry;
  onEdit: (journal: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const JournalCard: React.FC<JournalCardProps> = ({ journal, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const moodColors = {
    great: 'bg-dark-purple-600 dark:bg-dark-purple-500 text-white',
    good: 'bg-dark-purple-500 dark:bg-dark-purple-400 text-white',
    neutral: 'bg-dark-purple-400 dark:bg-dark-purple-300 text-white',
    bad: 'bg-dark-purple-300 dark:bg-dark-purple-200 text-dark-purple-900',
    awful: 'bg-dark-purple-200 dark:bg-dark-purple-100 text-dark-purple-900',
  };
  
  const moodEmojis = {
    great: '😁',
    good: '🙂',
    neutral: '😐',
    bad: '🙁',
    awful: '😞',
  };

  return (
    <motion.div
      className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-md overflow-hidden border border-dark-purple-200 dark:border-dark-purple-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-dark-purple-900 dark:text-dark-purple-100 mb-1">{journal.title}</h3>
            <div className="text-xs text-dark-purple-600 dark:text-dark-purple-400">
              {format(new Date(journal.createdAt), 'MMM d, yyyy - h:mm a')}
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs ${moodColors[journal.mood]}`}>
            {moodEmojis[journal.mood]} {journal.mood.charAt(0).toUpperCase() + journal.mood.slice(1)}
          </div>
        </div>
        
        <motion.div
          className="mt-3 text-dark-purple-800 dark:text-dark-purple-200 overflow-hidden"
          animate={{ height: isExpanded ? 'auto' : '80px' }}
        >
          <p className={isExpanded ? '' : 'line-clamp-3'}>
            {journal.content}
          </p>
        </motion.div>
        
        {journal.content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-dark-purple-600 dark:text-dark-purple-400 hover:text-dark-purple-900 dark:hover:text-dark-purple-200 focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
        
        {journal.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {journal.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-dark-purple-100 dark:bg-dark-purple-700 text-dark-purple-900 dark:text-dark-purple-200 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-4 flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(journal.id)}
            icon={<Trash size={16} />}
          >
            Delete
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(journal)}
            icon={<Edit size={16} />}
          >
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalCard;