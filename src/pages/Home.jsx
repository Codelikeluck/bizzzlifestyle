import { useState } from 'react';
import { useData } from '../context/DataContext';
import { dates } from '../utils/dates';
import { Link } from 'react-router-dom';

export default function Home() {
  const { entries, habits, moods, userName, getStats, toggleHabit, addMood } = useData();
  const [selectedMood, setSelectedMood] = useState(null);
  const stats = getStats();

  const weekDates = dates.getWeekDates();
  const weekDays = dates.getWeekDays();
  const today = new Date();

  const moodsList = [
    { value: 1, emoji: '😢', label: 'Sad' },
    { value: 2, emoji: '😕', label: 'Okay' },
    { value: 3, emoji: '😊', label: 'Good' },
    { value: 4, emoji: '😄', label: 'Great' },
    { value: 5, emoji: '🤩', label: 'Amazing' },
  ];

  const getHabitProgress = () => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => 
      h.completedDates?.some(d => new Date(d).toDateString() === today.toDateString())
    ).length;
    return Math.round((completed / habits.length) * 100);
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.value);
    addMood({ value: mood.value, label: mood.label });
  };

  const recentEntry = entries[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{dates.getGreeting()},</p>
          <h1 className="text-xl font-bold text-gray-800">{userName} 🌿</h1>
          <p className="text-xs text-gray-400">You've got this!</p>
        </div>
        <Link to="/journal" className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
          +
        </Link>
      </div>

      {/* Weekly Overview */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-3">This Week Overview</h2>
        <div className="flex justify-between mb-4">
          {weekDates.map((date, i) => {
            const isToday = date.toDateString() === today.toDateString();
            const hasEntry = entries.some(e => new Date(e.createdAt).toDateString() === date.toDateString());
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{weekDays[i]}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isToday ? 'bg-emerald-500 text-white' : 
                  hasEntry ? 'bg-emerald-100 text-emerald-600' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  {hasEntry && !isToday ? '✓' : date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex justify-around pt-3 border-t border-gray-100">
          <div className="stat-card">
            <div className="stat-value">{stats.entries}</div>
            <div className="stat-label">Entries</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.positiveDays}%</div>
            <div className="stat-label">Positive Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Habit & Mood Trackers */}
      <div className="grid grid-cols-2 gap-4">
        {/* Habit Tracker */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Habit Tracker</h3>
          <div className="flex justify-center mb-3">
            <div className="relative w-20 h-20">
              <svg className="circular-progress w-20 h-20" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="url(#gradient)" strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - getHabitProgress() / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-600">{getHabitProgress()}%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">This Week</p>
          <p className="text-xs text-emerald-500 text-center mt-1">Keep going!</p>
          <p className="text-xs text-gray-400 text-center">
            {habits.filter(h => h.completedDates?.some(d => new Date(d).toDateString() === today.toDateString())).length} / {habits.length} habits completed
          </p>
        </div>

        {/* Mood Tracker */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Mood Tracker</h3>
          <div className="flex justify-center gap-1 mb-3">
            {moodsList.map(mood => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood)}
                className={`mood-btn ${selectedMood === mood.value ? 'selected' : ''}`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-emerald-500">4.6</span>
            <p className="text-xs text-gray-500 mt-1">Mostly Positive</p>
            <p className="text-xs text-gray-400">You had a great week!</p>
          </div>
        </div>
      </div>

      {/* Daily Journal */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Daily Journal</h3>
          <Link to="/journal" className="text-gray-400">•••</Link>
        </div>
        {recentEntry ? (
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm italic">"{recentEntry.content}"</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">
                Today, {new Date(recentEntry.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
              {recentEntry.image && (
                <div className="w-12 h-12 rounded-lg bg-emerald-200 overflow-hidden">
                  <img src={recentEntry.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/journal" className="block bg-emerald-50 rounded-xl p-4 text-center text-emerald-500 text-sm">
            Start your first journal entry ✨
          </Link>
        )}
      </div>

      {/* Reminders */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span>🔔</span> Reminders
          </h3>
          <span className="text-gray-400">•••</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-sm text-gray-800">10:00 PM</p>
              <p className="text-xs text-gray-500">Evening Reflection</p>
              <p className="text-xs text-gray-400">Daily</p>
            </div>
            <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
