import { useData } from '../context/DataContext';
import { dates } from '../utils/dates';

export default function Insights() {
  const { entries, moods, habits } = useData();

  const weekDates = dates.getWeekDates();
  const weekDays = dates.getWeekDays();

  const getMoodStats = () => {
    const moodCounts = { sad: 0, okay: 0, good: 0, great: 0, amazing: 0 };
    moods.forEach(m => { if (m.label) moodCounts[m.label.toLowerCase()]++; });
    return moodCounts;
  };

  const moodStats = getMoodStats();
  const totalMoods = Object.values(moodStats).reduce((a, b) => a + b, 0);

  const getHabitCompletion = () => {
    if (habits.length === 0) return 0;
    const totalPossible = habits.length * 7;
    const totalCompleted = habits.reduce((acc, h) => 
      acc + (h.completedDates?.filter(d => {
        const date = new Date(d);
        return weekDates.some(wd => wd.toDateString() === date.toDateString());
      }).length || 0), 0
    );
    return Math.round((totalCompleted / totalPossible) * 100);
  };

  const moodEmojis = {
    sad: '😢',
    okay: '😕',
    good: '😊',
    great: '😄',
    amazing: '🤩'
  };

  const moodColors = {
    sad: 'bg-blue-400',
    okay: 'bg-yellow-400',
    good: 'bg-emerald-400',
    great: 'bg-green-400',
    amazing: 'bg-purple-400'
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Insights</h1>
        <p className="text-sm text-gray-500">Your wellness journey</p>
      </div>

      {/* Weekly Mood Chart */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Mood</h3>
        <div className="flex items-end justify-between h-32 px-2">
          {[3, 4, 5, 4, 5, 4, 3].map((value, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div 
                className="w-8 bg-gradient-to-t from-emerald-400 to-teal-300 rounded-t-lg transition-all"
                style={{ height: `${(value / 5) * 100}%` }}
              />
              <span className="text-xs text-gray-400">{weekDays[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Mood Distribution</h3>
        <div className="space-y-3">
          {Object.entries(moodStats).map(([mood, count]) => (
            <div key={mood} className="flex items-center gap-3">
              <span className="text-xl w-8">{moodEmojis[mood]}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 capitalize">{mood}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${moodColors[mood]}`}
                    style={{ width: totalMoods > 0 ? `${(count / totalMoods) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Completion */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Habit Completion</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="circular-progress w-32 h-32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle 
                cx="50" cy="50" r="40" fill="none" 
                stroke="url(#insightsGradient)" strokeWidth="10" 
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - getHabitCompletion() / 100)}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="insightsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-emerald-600">{getHabitCompletion()}%</span>
              <span className="text-xs text-gray-500">completed</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {habits.map(habit => {
            const completed = habit.completedDates?.some(d => 
              weekDates.some(wd => wd.toDateString() === new Date(d).toDateString())
            );
            return (
              <div key={habit.id} className="text-center">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg ${
                  completed ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  {habit.icon}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{habit.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{entries.length}</p>
            <p className="text-sm text-gray-600">Total Entries</p>
          </div>
          <div className="bg-teal-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-teal-600">{moods.length}</p>
            <p className="text-sm text-gray-600">Mood Logs</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{habits.length}</p>
            <p className="text-sm text-gray-600">Active Habits</p>
          </div>
          <div className="bg-cyan-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-cyan-600">12</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}
