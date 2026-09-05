import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Profile() {
  const { userName, saveUserName, entries, moods, habits, reminders, addHabit, deleteHabit, addReminder, deleteReminder, toggleReminder } = useData();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(userName);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [habitForm, setHabitForm] = useState({ name: '', icon: '✨' });
  const [reminderForm, setReminderForm] = useState({ title: '', time: '09:00', frequency: 'daily' });

  const icons = ['✨', '🧘', '💪', '📚', '✍️', '💧', '🏃', '🎯', '🌱', '🎵', '💤', '🍎'];

  const handleSaveName = () => {
    saveUserName(name);
    setEditingName(false);
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    addHabit(habitForm);
    setHabitForm({ name: '', icon: '✨' });
    setShowHabitForm(false);
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    addReminder(reminderForm);
    setReminderForm({ title: '', time: '09:00', frequency: 'daily' });
    setShowReminderForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-500">Manage your settings</p>
      </div>

      {/* Profile Card */}
      <div className="card-elevated text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto flex items-center justify-center text-3xl text-white mb-3">
          {userName.charAt(0).toUpperCase()}
        </div>
        {editingName ? (
          <div className="flex items-center gap-2 justify-center">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="px-3 py-1 border border-emerald-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-emerald-400"
              autoFocus
            />
            <button onClick={handleSaveName} className="text-emerald-500 font-medium">Save</button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-gray-800">{userName}</h2>
            <button onClick={() => setEditingName(true)} className="text-sm text-emerald-500">Edit Name</button>
          </div>
        )}
        <div className="flex justify-around mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-600">{entries.length}</p>
            <p className="text-xs text-gray-500">Entries</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-teal-600">{moods.length}</p>
            <p className="text-xs text-gray-500">Moods</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{habits.length}</p>
            <p className="text-xs text-gray-500">Habits</p>
          </div>
        </div>
      </div>

      {/* Habits Management */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">My Habits</h3>
          <button onClick={() => setShowHabitForm(true)} className="text-emerald-500 text-sm">+ Add</button>
        </div>
        <div className="space-y-2">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">{habit.icon}</span>
                <span className="text-sm text-gray-700">{habit.name}</span>
              </div>
              <button onClick={() => deleteHabit(habit.id)} className="text-gray-400 hover:text-red-500">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Form Modal */}
      {showHabitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">New Habit</h3>
              <button onClick={() => setShowHabitForm(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleAddHabit} className="space-y-4">
              <input
                type="text"
                placeholder="Habit name"
                value={habitForm.name}
                onChange={e => setHabitForm({...habitForm, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <div>
                <p className="text-sm text-gray-600 mb-2">Choose an icon</p>
                <div className="flex flex-wrap gap-2">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setHabitForm({...habitForm, icon})}
                      className={`text-2xl p-2 rounded-lg ${habitForm.icon === icon ? 'bg-emerald-100' : 'hover:bg-gray-100'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full btn-primary">Add Habit</button>
            </form>
          </div>
        </div>
      )}

      {/* Reminders Management */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Reminders</h3>
          <button onClick={() => setShowReminderForm(true)} className="text-emerald-500 text-sm">+ Add</button>
        </div>
        <div className="space-y-2">
          {reminders.map(reminder => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">{reminder.title}</p>
                <p className="text-xs text-gray-500">{reminder.time} • {reminder.frequency}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${reminder.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${reminder.enabled ? 'right-1' : 'left-1'}`} />
                </button>
                <button onClick={() => deleteReminder(reminder.id)} className="text-gray-400 hover:text-red-500">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder Form Modal */}
      {showReminderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">New Reminder</h3>
              <button onClick={() => setShowReminderForm(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <input
                type="text"
                placeholder="Reminder title"
                value={reminderForm.title}
                onChange={e => setReminderForm({...reminderForm, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <div className="flex gap-3">
                <input
                  type="time"
                  value={reminderForm.time}
                  onChange={e => setReminderForm({...reminderForm, time: e.target.value})}
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <select
                  value={reminderForm.frequency}
                  onChange={e => setReminderForm({...reminderForm, frequency: e.target.value})}
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="weekdays">Weekdays</option>
                </select>
              </div>
              <button type="submit" className="w-full btn-primary">Add Reminder</button>
            </form>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-3">Settings</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl text-left">
            <span className="text-sm text-gray-700">Export Data</span>
            <span className="text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl text-left">
            <span className="text-sm text-gray-700">Theme</span>
            <span className="text-gray-400">Light →</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl text-left">
            <span className="text-sm text-gray-700">About</span>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
