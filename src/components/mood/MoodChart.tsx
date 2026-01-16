import React from 'react';
import { motion } from 'framer-motion';
import { MoodEntry, Mood } from '../../types';
import { format, subDays, startOfDay, isValid } from 'date-fns';

interface MoodChartProps {
  moodEntries: MoodEntry[];
  days?: number;
}

const moodValues: Record<Mood, number> = {
  awful: 0,
  bad: 1,
  neutral: 2,
  good: 3,
  great: 4,
};

const MoodChart: React.FC<MoodChartProps> = ({ moodEntries, days = 7 }) => {
  const getMoodByDay = () => {
    const today = startOfDay(new Date());
    const result: { date: Date; mood: Mood | null }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      result.push({ date: subDays(today, i), mood: null });
    }

    const moodMap = new Map<string, Mood>();

    moodEntries.forEach(entry => {
      const d = new Date(entry.date);
      if (!isValid(d)) return;
      moodMap.set(format(d, 'yyyy-MM-dd'), entry.mood);
    });

    result.forEach(day => {
      const key = format(day.date, 'yyyy-MM-dd');
      if (moodMap.has(key)) day.mood = moodMap.get(key)!;
    });

    return result;
  };

  const moodData = getMoodByDay();

  return (
    <div className="bg-transparent p-4">
      <div className="flex items-end h-[200px] justify-between gap-2">
        {moodData.map((day, index) => {
          const value = day.mood ? moodValues[day.mood] : 0;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <motion.div
                className="w-full rounded-t-md"
                style={{ backgroundColor: '#6E2B8A' }}
                initial={{ height: 0 }}
                animate={{ height: value * 30 }}
                transition={{ duration: 0.4 }}
              />
              <div className="text-xs mt-2 font-medium text-dark-purple-900 dark:text-dark-purple-100">{format(day.date, 'EEE')}</div>
              <div className="text-xs text-dark-purple-600 dark:text-dark-purple-400">{format(day.date, 'd')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodChart;
