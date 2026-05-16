import { useState, useEffect } from 'react';
import { storage, generateId } from './storage';

const DEFAULT_QUOTES = [
  { id: 'default1', text: '学而不思则罔，思而不学则殆。', author: '孔子', createdAt: Date.now() },
  { id: 'default2', text: '千里之行，始于足下。', author: '老子', createdAt: Date.now() },
  { id: 'default3', text: '书山有路勤为径，学海无涯苦作舟。', author: '韩愈', createdAt: Date.now() },
  { id: 'default4', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', createdAt: Date.now() },
  { id: 'default5', text: 'Stay hungry, stay foolish.', author: 'Steve Jobs', createdAt: Date.now() }
];

function QuoteModule() {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let savedQuotes = storage.getQuotes();
    if (savedQuotes.length === 0) {
      storage.saveQuotes(DEFAULT_QUOTES);
      savedQuotes = DEFAULT_QUOTES;
    }
    setQuotes(savedQuotes);
  }, []);

  const addQuote = () => {
    if (!newQuote.trim()) return;
    const quote = {
      id: generateId(),
      text: newQuote.trim(),
      author: newAuthor.trim() || '佚名',
      createdAt: Date.now()
    };
    const updatedQuotes = [quote, ...quotes];
    setQuotes(updatedQuotes);
    storage.saveQuotes(updatedQuotes);
    setNewQuote('');
    setNewAuthor('');
    setShowForm(false);
  };

  const deleteQuote = (id) => {
    const updatedQuotes = quotes.filter(q => q.id !== id);
    setQuotes(updatedQuotes);
    storage.saveQuotes(updatedQuotes);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">💡</span>
          名言管理
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          {showForm ? '取消' : '+ 添加名言'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <textarea
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="输入名言内容..."
            className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2 resize-none"
            rows="2"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="作者（可选）"
              className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={addQuote}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              添加
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {quotes.map(quote => (
          <div
            key={quote.id}
            className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 relative group hover:shadow-md transition-shadow"
          >
            <p className="text-gray-700 italic mb-2">"{quote.text}"</p>
            <div className="flex justify-between items-center">
              <span className="text-amber-600 font-medium">— {quote.author}</span>
              <button
                onClick={() => deleteQuote(quote.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {quotes.length === 0 && (
        <p className="text-gray-500 text-center py-8">暂无名言，添加一些激励自己的话吧！</p>
      )}
    </div>
  );
}

export default QuoteModule;
