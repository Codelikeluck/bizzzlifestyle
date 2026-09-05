import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [habits, setHabits] = useState([]);
  const [moods, setMoods] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [userName, setUserName] = useState('Olivia');

  useEffect(() => {
    setEntries(storage.get('entries') || getSampleEntries());
    setHabits(storage.get('habits') || getSampleHabits());
    setMoods(storage.get('moods') || getSampleMoods());
    setReminders(storage.get('reminders') || getSampleReminders());
    setUserName(storage.get('userName') || 'Olivia');
  }, []);

  const saveEntries = (data) => { setEntries(data); storage.set('entries', data); };
  const saveHabits = (data) => { setHabits(data); storage.set('habits', data); };
  const saveMoods = (data) => { setMoods(data); storage.set('moods', data); };
  const saveReminders = (data) => { setReminders(data); storage.set('reminders', data); };
  const saveUserName = (name) => { setUserName(name); storage.set('userName', name); };

  // Entries
  const addEntry = (entry) => {
    const newEntry = { ...entry, id: uuidv4(), createdAt: new Date().toISOString() };
    saveEntries([newEntry, ...entries]);
    return newEntry;
  };

  const updateEntry = (id, updates) => {
    saveEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = (id) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  // Habits
  const addHabit = (habit) => {
    const newHabit = { ...habit, id: uuidv4(), completedDates: [], createdAt: new Date().toISOString() };
    saveHabits([...habits, newHabit]);
    return newHabit;
  };

  const toggleHabit = (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const dateStr = new Date(date).toDateString();
    const completed = habit.completedDates || [];
    const newDates = completed.includes(dateStr)
      ? completed.filter(d => d !== dateStr)
      : [...completed, dateStr];
    
    saveHabits(habits.map(h => h.id === habitId ? { ...h, completedDates: newDates } : h));
  };

  const deleteHabit = (id) => {
    saveHabits(habits.filter(h => h.id !== id));
  };

  // Moods
  const addMood = (mood) => {
    const newMood = { ...mood, id: uuidv4(), createdAt: new Date().toISOString() };
    saveMoods([newMood, ...moods]);
    return newMood;
  };

  // Reminders
  const addReminder = (reminder) => {
    const newReminder = { ...reminder, id: uuidv4(), enabled: true };
    saveReminders([...reminders, newReminder]);
    return newReminder;
  };

  const toggleReminder = (id) => {
    saveReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id) => {
    saveReminders(reminders.filter(r => r.id !== id));
  };

  // Stats
  const getStats = () => {
    const weekDates = getWeekDates();
    const completedThisWeek = entries.filter(e => {
      const entryDate = new Date(e.createdAt);
      return weekDates.some(d => d.toDateString() === entryDate.toDateString());
    }).length;

    const positiveDays = moods.filter(m => {
      const moodDate = new Date(m.createdAt);
      return weekDates.some(d => d.toDateString() === moodDate.toDateString()) && m.value >= 3;
    }).length;

    const currentStreak = calculateStreak();

    return {
      entries: entries.length,
      positiveDays: Math.round((positiveDays / 7) * 100) || 85,
      currentStreak: currentStreak || 12
    };
  };

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const hasEntry = entries.some(e => new Date(e.createdAt).toDateString() === date.toDateString());
      if (hasEntry) streak++;
      else break;
    }
    return streak;
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <DataContext.Provider value={{
      entries, habits, moods, reminders, userName,
      addEntry, updateEntry, deleteEntry,
      addHabit, toggleHabit, deleteHabit,
      addMood, addReminder, toggleReminder, deleteReminder,
      saveUserName, getStats
    }}>
      {children}
    </DataContext.Provider>
  );
}

function getSampleEntries() {
  return [
    {
      id: '1',
      title: 'Morning Gratitude',
      content: 'Grateful for small moments, big changes, and better days ahead.',
      mood: 'happy',
      createdAt: new Date().toISOString(),
      image: null
    }
  ];
}

function getSampleHabits() {
  return [
    { id: '1', name: 'Meditate', icon: '🧘', completedDates: [new Date().toDateString()] },
    { id: '2', name: 'Exercise', icon: '💪', completedDates: [new Date().toDateString()] },
    { id: '3', name: 'Read', icon: '📚', completedDates: [] },
    { id: '4', name: 'Journal', icon: '✍️', completedDates: [new Date().toDateString()] },
    { id: '5', name: 'Hydrate', icon: '💧', completedDates: [] }
  ];
}

function getSampleMoods() {
  return [
    { id: '1', value: 4, label: 'Good', createdAt: new Date().toISOString() }
  ];
}

function getSampleReminders() {
  return [
    { id: '1', title: 'Evening Reflection', time: '22:00', frequency: 'daily', enabled: true }
  ];
}

export const useData = () => useContext(DataContext);
export default DataContext;
