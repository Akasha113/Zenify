import React from 'react';
import { motion } from 'framer-motion';
import { MoodEntry, Mood } from '../types';
import storage from '../utils/storage';
import MoodSelector from '../components/mood/MoodSelector';
import MoodChart from '../components/mood/MoodChart';
import { format } from 'date-fns';

const MoodPage: React.FC = () => {
  const [moodEntries, setMoodEntries] = React.useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = React.useState<Mood>('neutral');
  const [moodNote, setMoodNote] = React.useState('');
  const [timeframe, setTimeframe] = React.useState<7 | 14 | 30>(7);

  // Load mood entries
  React.useEffect(() => {
    const loadedEntries = storage.getMoodEntries();
    const validEntries = loadedEntries.filter(entry => {
      // Make sure date exists
      const isValid = entry.date && !isNaN(new Date(entry.date).getTime());
      if (!isValid) console.error('Invalid date found:', entry.date);
      return isValid;
    });
    setMoodEntries(validEntries);
  }, []);

  // Handle tracking or updating mood
  const handleTrackMood = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const existingIndex = moodEntries.findIndex(
      entry => new Date(entry.date).setHours(0, 0, 0, 0) === today
    );

    let newEntry: MoodEntry;

    if (existingIndex !== -1) {
      // Update existing entry
      newEntry = {
        ...moodEntries[existingIndex],
        mood: currentMood,
        note: moodNote,
        date: new Date().toISOString(),
      };
      const updatedEntries = [...moodEntries];
      updatedEntries[existingIndex] = newEntry;
      setMoodEntries(updatedEntries);
      storage.updateMoodEntry(newEntry.id, { mood: currentMood, note: moodNote });
    } else {
      // Add new entry
      newEntry = storage.addMoodEntry(currentMood, moodNote);
      setMoodEntries([...moodEntries, newEntry]);
    }

    setMoodNote('');
  };

  const todayEntry = React.useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return moodEntries.find(entry => new Date(entry.date).setHours(0, 0, 0, 0) === today);
  }, [moodEntries]);

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 pt-8 bg-gradient-to-b from-dark-purple-50 via-white to-dark-purple-100 dark:from-dark-purple-950 dark:via-dark-purple-900 dark:to-dark-purple-950">
      <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-dark-purple-900 dark:text-dark-purple-100">Mood Tracker</h1>
        <p className="text-black dark:text-gray-200">Track your mood daily to see patterns over time</p>
      </div>

      {/* Today's mood section */}
      <motion.div
        className="mb-8 bg-white dark:bg-dark-purple-800 p-6 rounded-lg shadow-lg border border-dark-purple-200 dark:border-dark-purple-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-dark-purple-900 dark:text-dark-purple-100">How are you feeling today?</h2>

        <div className="mb-4">
          <MoodSelector selectedMood={currentMood} onSelectMood={setCurrentMood} size="lg" />
        </div>

        {/* Notes input */}
        <div className="mb-4">
          <textarea
            value={moodNote || todayEntry?.note || ''}
            onChange={e => setMoodNote(e.target.value)}
            placeholder="Any specific thoughts about your mood today? (optional)"
            className="w-full p-4 border border-dark-purple-300 dark:border-dark-purple-700 rounded-md bg-white dark:bg-dark-purple-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24"
          />
        </div>

        {/* Track / Update Button */}
        <button
          onClick={handleTrackMood}
          className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
          style={{ backgroundColor: '#6E2B8A' }}
        >
          {todayEntry ? "Update Today's Mood" : "Track Today's Mood"}
        </button>
      </motion.div>

      {/* Mood Chart */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-dark-purple-900 dark:text-dark-purple-100">Mood Trends</h2>
          <div className="flex space-x-2">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                onClick={() => setTimeframe(days as 7 | 14 | 30)}
                className={`px-3 py-1 text-sm rounded transition-colors text-white`}
                style={timeframe === days ? { backgroundColor: '#6E2B8A' } : { backgroundColor: '#D3C5D9' }}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        <MoodChart
          moodEntries={moodEntries.filter(entry => entry.date && !isNaN(new Date(entry.date).getTime()))}
          days={timeframe}
        />
      </motion.div>

      {/* Mood History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-semibold mb-4 text-dark-purple-900 dark:text-dark-purple-100">Mood History</h2>
        {moodEntries.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg border border-dark-purple-200 dark:border-dark-purple-700">
            <p className="text-dark-purple-600 dark:text-dark-purple-400">No mood entries yet</p>
            <p className="text-sm text-dark-purple-500 dark:text-dark-purple-400 mt-2">Start tracking your mood daily to see your history here</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg border border-dark-purple-200 dark:border-dark-purple-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-purple-100 dark:bg-dark-purple-700 text-left">
                    <th className="py-3 px-4 font-medium text-dark-purple-900 dark:text-dark-purple-100">Date</th>
                    <th className="py-3 px-4 font-medium text-dark-purple-900 dark:text-dark-purple-100">Mood</th>
                    <th className="py-3 px-4 font-medium text-dark-purple-900 dark:text-dark-purple-100">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[...moodEntries]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry, index) => (
                      <motion.tr
                        key={entry.id}
                        className={index % 2 === 0 ? 'bg-white dark:bg-dark-purple-800' : 'bg-dark-purple-50 dark:bg-dark-purple-700'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.03 }}
                      >
                        <td className="py-3 px-4 border-t border-dark-purple-200 dark:border-dark-purple-600 text-black dark:text-white">
                          {entry.date && !isNaN(new Date(entry.date).getTime())
                            ? format(new Date(entry.date), 'MMM d, yyyy')
                            : 'Invalid date'}
                        </td>
                        <td className="py-3 px-4 border-t border-dark-purple-200 dark:border-dark-purple-600">
                          <div className="flex items-center text-black dark:text-white">
                            <span className="mr-2">
                              {entry.mood === 'great'
                                ? '😁'
                                : entry.mood === 'good'
                                ? '🙂'
                                : entry.mood === 'neutral'
                                ? '😐'
                                : entry.mood === 'bad'
                                ? '🙁'
                                : '😞'}
                            </span>
                            <span className="capitalize">{entry.mood}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-t border-dark-purple-200 dark:border-dark-purple-600 italic text-black dark:text-white">{entry.note || '-'}</td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default MoodPage;
