import { useState, useEffect } from 'react';

const QUOTES = [
  { text: '学而不思则罔，思而不学则殆。', author: '孔子' },
  { text: '千里之行，始于足下。', author: '老子' },
  { text: '书山有路勤为径，学海无涯苦作舟。', author: '韩愈' },
  { text: '业精于勤，荒于嬉；行成于思，毁于随。', author: '韩愈' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: '知之者不如好之者，好之者不如乐之者。', author: '孔子' },
  { text: '温故而知新，可以为师矣。', author: '孔子' },
  { text: '活到老，学到老。', author: '谚语' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
];

function QuoteFooter() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % QUOTES.length);
        setFade(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[index];

  return (
    <footer className="text-center mt-10 pb-6">
      <div
        className={`transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="text-amber-800/70 italic text-base leading-relaxed">
          "{quote.text}"
        </p>
        <p className="text-amber-700/50 text-sm mt-1">— {quote.author}</p>
      </div>
    </footer>
  );
}

export default QuoteFooter;
