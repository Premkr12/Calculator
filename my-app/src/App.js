import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showScientific, setShowScientific] = useState(true);
  const [history, setHistory] = useState([]);

  const evaluateExpression = (expr) => {
    try {
      let parsed = expr;

      // Convert sin30 → sin(30)
      parsed = parsed.replace(/(sin|cos|tan|log|√)(\d+(\.\d+)?)/g, (_, fn, num) => {
        return `${fn}(${num})`;
      });

      parsed = parsed.replace(/π/g, `(${Math.PI})`).replace(/e/g, `(${Math.E})`);

      parsed = parsed
        .replace(/√/g, 'Math.sqrt')
        .replace(/log/g, 'Math.log10')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/\^/g, '**');

      // Convert degrees to radians
      parsed = parsed.replace(/(Math\.(?:sin|cos|tan)\()([^)]+)(\))/g, (match, p1, p2, p3) => {
        return `${p1}(${p2} * Math.PI / 180)${p3}`;
      });

      const result = Function('"use strict"; return (' + parsed + ')')();
      const rounded = parseFloat(result.toFixed(10));
      setHistory([`${input} = ${rounded}`, ...history]);
      return rounded;
    } catch {
      return 'Error';
    }
  };

  const handleClick = (value) => {
    if (value === '=') {
      const result = evaluateExpression(input);
      setInput(result.toString());
    } else if (value === 'C') {
      setInput('');
    } else if (value === '⌫') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Escape') {
        e.preventDefault();
      }

      if (e.key === 'Enter') return handleClick('=');
      if (e.key === 'Backspace') return handleClick('⌫');
      if (e.key === 'Escape') return handleClick('C');

      const allowed = '0123456789+-*/().^';
      if (allowed.includes(e.key)) {
        setInput((prev) => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  const scientificButtons = ['sin', 'cos', 'tan', 'log', 'π', 'e', '√', '^'];
  const normalButtons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '.','0', '=', '+',
    'C','','', '⌫'
  ];

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <div className="calculator">

        {/* Top bar */}
        <div className="top-bar">
          <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="toggle-btn" onClick={() => setShowScientific(!showScientific)}>
            {showScientific ? '🧮 Standard Mode' : '🔬 Scientific Mode'}
          </button>
        </div>

        {/* Display */}
        <div className="display">{input || '0'}</div>

        {/* Scientific Buttons */}
        {showScientific && (
          <div className="buttons scientific">
            {scientificButtons.map((btn, i) => (
              <button key={i} onClick={() => handleClick(btn)}>
                {btn}
              </button>
            ))}
          </div>
        )}

        {/* Normal Buttons */}
        <div className="buttons">
          {normalButtons.map((btn, i) => (
            <button key={i} onClick={() => handleClick(btn)}>
              {btn}
            </button>
          ))}
        </div>

        {/* History */}
        <div className="history">
          <h3>History</h3>
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default App;
