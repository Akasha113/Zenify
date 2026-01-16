import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalEntry } from '../types';
import storage from '../utils/storage';
import JournalCard from '../components/journal/JournalCard';
import JournalForm from '../components/journal/JournalForm';
import Button from '../components/ui/Button';
import { Plus, Search, Filter } from 'lucide-react';

const JournalPage: React.FC = () => {
  const [journals, setJournals] = React.useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingJournal, setEditingJournal] = React.useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  
  // Load journals
  React.useEffect(() => {
    const loadedJournals = storage.getJournalEntries();
    setJournals(loadedJournals);
  }, []);
  
  const handleCreateJournal = () => {
    setEditingJournal(null);
    setShowForm(true);
  };
  
  const handleEditJournal = (journal: JournalEntry) => {
    setEditingJournal(journal);
    setShowForm(true);
  };
  
  const handleDeleteJournal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      const success = storage.deleteJournalEntry(id);
      if (success) {
        setJournals(journals.filter(journal => journal.id !== id));
      }
    }
  };
  
  const handleSubmitJournal = (journalData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingJournal) {
      const updatedJournal = storage.updateJournalEntry(editingJournal.id, journalData);
      if (updatedJournal) {
        setJournals(journals.map(journal => 
          journal.id === updatedJournal.id ? updatedJournal : journal
        ));
      }
    } else {
      const newJournal = storage.addJournalEntry(journalData);
      setJournals([...journals, newJournal]);
    }
    
    setShowForm(false);
    setEditingJournal(null);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingJournal(null);
  };
  
  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    journals.forEach(journal => {
      journal.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [journals]);
  
  // Filter journals based on search and tags
  const filteredJournals = React.useMemo(() => {
    return journals
      .filter(journal => {
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
          journal.title.toLowerCase().includes(searchLower) ||
          journal.content.toLowerCase().includes(searchLower);
        
        // Tag filter
        const matchesTag = !activeTag || journal.tags.includes(activeTag);
        
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
  }, [journals, searchQuery, activeTag]);

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 pt-8 bg-gradient-to-b from-dark-purple-50 via-white to-dark-purple-100 dark:from-dark-purple-950 dark:via-dark-purple-900 dark:to-dark-purple-950">
      <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <JournalForm
              onSubmit={handleSubmitJournal}
              onCancel={handleCancelForm}
              initialValues={editingJournal || undefined}
              isEditing={!!editingJournal}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-semibold text-dark-purple-900 dark:text-dark-purple-100">Journal</h1>
              <Button
                onClick={handleCreateJournal}
                icon={<Plus size={18} />}
                style={{ backgroundColor: '#6E2B8A' }}
                className="text-white"
              >
                New Entry
              </Button>
            </div>
            
            {/* Search and filter */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-dark-purple-500 dark:text-dark-purple-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search journals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full p-2 border border-dark-purple-300 dark:border-dark-purple-700 rounded-md bg-white dark:bg-dark-purple-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {allTags.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <Filter size={18} className="text-dark-purple-600 dark:text-dark-purple-400 flex-shrink-0" />
                  
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`
                      px-2 py-1 rounded-full text-sm whitespace-nowrap
                      ${!activeTag 
                        ? 'text-white' 
                        : 'bg-dark-purple-100 dark:bg-dark-purple-700 text-dark-purple-900 dark:text-dark-purple-100 hover:bg-dark-purple-200 dark:hover:bg-dark-purple-600'
                      }
                    `}
                    style={!activeTag ? { backgroundColor: '#6E2B8A' } : {}}
                  >
                    All
                  </button>
                  
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className={`
                        px-2 py-1 rounded-full text-sm whitespace-nowrap
                        ${activeTag === tag 
                          ? 'text-white' 
                          : 'bg-dark-purple-100 dark:bg-dark-purple-700 text-dark-purple-900 dark:text-dark-purple-100 hover:bg-dark-purple-200 dark:hover:bg-dark-purple-600'
                        }
                      `}
                      style={activeTag === tag ? { backgroundColor: '#6E2B8A' } : {}}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Journal list */}
            {filteredJournals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-dark-purple-600 dark:text-dark-purple-400 mb-4">No journal entries found</p>
                <Button
                  onClick={handleCreateJournal}
                  icon={<Plus size={18} />}
                  style={{ backgroundColor: '#6E2B8A' }}
                  className="text-white"
                >
                  Create your first entry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {filteredJournals.map(journal => (
                    <JournalCard
                      key={journal.id}
                      journal={journal}
                      onEdit={handleEditJournal}
                      onDelete={handleDeleteJournal}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default JournalPage;