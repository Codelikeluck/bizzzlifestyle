import { useState } from 'react';
import { useData } from '../context/DataContext';
import { dates } from '../utils/dates';

export default function Journal() {
  const { entries, addEntry, updateEntry, deleteEntry } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', mood: 'good' });

  const moods = [
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'okay', emoji: '😕', label: 'Okay' },
    { value: 'good', emoji: '😊', label: 'Good' },
    { value: 'great', emoji: '😄', label: 'Great' },
    { value: 'amazing', emoji: '🤩', label: 'Amazing' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateEntry(editingId, form);
    } else {
      addEntry(form);
    }
    setForm({ title: '', content: '', mood: 'good' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (entry) => {
    setForm({ title: entry.title, content: entry.content, mood: entry.mood || 'good' });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const getMoodEmoji = (mood) => {
    const m = moods.find(m => m.value === mood);
    return m ? m.emoji : '😊';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Journal</h1>
          <p className="text-sm text-gray-500">{entries.length} entries</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', content: '', mood: 'good' }); }}
          className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
        >
          +
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{editingId ? 'Edit Entry' : 'New Entry'}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              
              <textarea
                placeholder="What's on your mind today?"
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />

              <div>
                <p className="text-sm text-gray-600 mb-2">How are you feeling?</p>
                <div className="flex justify-center gap-2">
                  {moods.map(mood => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setForm({...form, mood: mood.value})}
                      className={`text-3xl p-2 rounded-full transition-all ${
                        form.mood === mood.value ? 'bg-emerald-100 scale-110' : 'hover:bg-gray-100'
                      }`}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full btn-primary">
                {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-gray-500">No journal entries yet</p>
            <p className="text-sm text-gray-400 mt-1">Start writing to track your thoughts</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="card-elevated">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{entry.title || 'Untitled'}</h4>
                    <p className="text-xs text-gray-400">{dates.format(entry.createdAt, 'datetime')}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(entry)} className="p-2 hover:bg-gray-100 rounded-lg text-sm">✏️</button>
                  <button onClick={() => { if(confirm('Delete?')) deleteEntry(entry.id); }} className="p-2 hover:bg-red-50 rounded-lg text-sm">🗑️</button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
