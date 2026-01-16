import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Book, BarChart, Brain } from 'lucide-react';
import Button from '../components/ui/Button';
import { getRandomQuote } from '../utils/quotes';
import storage from '../utils/storage';
import MoodSelector from '../components/mood/MoodSelector';
import { Mood } from '../types';

const HomePage: React.FC = () => {
  const [quote, setQuote] = React.useState(getRandomQuote());
  const [currentMood, setCurrentMood] = React.useState<Mood>('neutral');
  const [moodNote, setMoodNote] = React.useState('');
  const [hasTrackedMood, setHasTrackedMood] = React.useState(false);
  
  // Check if user already tracked mood today
  React.useEffect(() => {
    const entries = storage.getMoodEntries();
    const today = new Date().setHours(0, 0, 0, 0);
    
    const trackedToday = entries.some(entry => {
      const entryDate = new Date(entry.date).setHours(0, 0, 0, 0);
      return entryDate === today;
    });
    
    setHasTrackedMood(trackedToday);
    
    if (trackedToday) {
      // Get today's mood
      const todayEntry = entries.find(entry => {
        const entryDate = new Date(entry.date).setHours(0, 0, 0, 0);
        return entryDate === today;
      });
      
      if (todayEntry) {
        setCurrentMood(todayEntry.mood);
        setMoodNote(todayEntry.note || '');
      }
    }
  }, []);
  
  const trackMood = () => {
    storage.addMoodEntry(currentMood, moodNote);
    setHasTrackedMood(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start pt-8 px-4 bg-gradient-to-b from-dark-purple-50 via-white to-dark-purple-100 dark:from-dark-purple-950 dark:via-dark-purple-900 dark:to-dark-purple-950">
      <motion.div
        className="text-center max-w-4xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex justify-center">
            <motion.div
              className="h-24 w-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#6E2B8A' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Brain size={48} className="text-white" />
            </motion.div>
          </div>
        </motion.div>

          <motion.h1 
          className="text-6xl md:text-7xl font-semibold mb-6 text-dark-purple-900 dark:text-dark-purple-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Welcome to MindFul Journal
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-black dark:text-black mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Your personal AI companion for mental wellness and self-reflection
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link to="/chat">
            <Button size="lg" className="text-lg px-8 text-white" style={{ backgroundColor: '#6E2B8A' }}>
              Start Chatting
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {[
          {
            icon: <MessageCircle size={32} />,
            title: "AI Therapy Chat",
            description: "Have meaningful conversations with our AI therapist in a safe, judgment-free space."
          },
          {
            icon: <Book size={32} />,
            title: "Digital Journal",
            description: "Document your thoughts and feelings with our intuitive journaling system."
          },
          {
            icon: <BarChart size={32} />,
            title: "Mood Tracking",
            description: "Track your emotional well-being and discover patterns over time."
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white dark:bg-dark-purple-800 p-8 rounded-2xl shadow-md border-2"
            style={{ borderColor: '#6E2B8A' }}
            whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(110, 43, 138, 0.25)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
          >
            <div className="h-16 w-16 rounded-xl flex items-center justify-center mb-6 text-white" style={{ backgroundColor: '#6E2B8A' }}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-dark-purple-100">{feature.title}</h3>
            <p className="text-gray-700 dark:text-dark-purple-300">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-16 text-center max-w-2xl mx-auto p-10 bg-white dark:bg-dark-purple-800 rounded-3xl shadow-lg border-2 relative overflow-hidden"
        style={{ borderColor: '#6E2B8A' }}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        whileHover={{ y: -8, shadow: '0 20px 50px rgba(110, 43, 138, 0.2)' }}
      >
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 dark:opacity-20"
          style={{ backgroundColor: '#6E2B8A' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative z-10">
          <motion.div
            className="inline-block mb-4 px-4 py-2 rounded-full"
            style={{ backgroundColor: '#6E2B8A' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            <span className="text-white text-sm font-semibold">✨ Daily Inspiration</span>
          </motion.div>
          <h2 className="text-3xl font-bold mb-6 text-dark-purple-900 dark:text-dark-purple-100">Thought of the Day</h2>
          <blockquote className="text-lg italic text-dark-purple-800 dark:text-dark-purple-200 leading-relaxed mb-4">"{quote.text}"</blockquote>
          <motion.div
            className="h-1 w-12 mx-auto mb-4"
            style={{ backgroundColor: '#6E2B8A' }}
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 1.2 }}
          />
          <p className="text-dark-purple-700 dark:text-dark-purple-300 font-medium">— {quote.author}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;