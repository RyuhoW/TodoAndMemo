import React, { memo, useState, useCallback } from 'react';

const Calculator: React.FC = memo(() => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = useCallback((num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  }, [display, isNewNumber]);

  const handleOperator = useCallback((operator: string) => {
    setEquation(display + ' ' + operator + ' ');
    setIsNewNumber(true);
  }, [display]);

  const calculateResult = useCallback((eq: string, current: string) => {
    try {
      // 安全な計算方法を使用
      const sanitizedEq = eq.replace(/[^0-9+\-*/.() ]/g, '');
      const sanitizedCurrent = current.replace(/[^0-9+\-*/.() ]/g, '');
      const expression = sanitizedEq + sanitizedCurrent;
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + expression)();
      return String(result);
    } catch (error) {
      return 'Error';
    }
  }, []);

  const handleEqual = useCallback(() => {
    const result = calculateResult(equation, display);
    setDisplay(result);
    setEquation('');
    setIsNewNumber(true);
  }, [equation, display, calculateResult]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  }, []);

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="equation">{equation}</div>
        <div className="result">{display}</div>
      </div>
      <div className="calculator-buttons">
        <button onClick={handleClear} className="button clear">C</button>
        <button onClick={() => handleOperator('/')} className="button operator">÷</button>
        <button onClick={() => handleNumber('7')} className="button number">7</button>
        <button onClick={() => handleNumber('8')} className="button number">8</button>
        <button onClick={() => handleNumber('9')} className="button number">9</button>
        <button onClick={() => handleOperator('*')} className="button operator">×</button>
        <button onClick={() => handleNumber('4')} className="button number">4</button>
        <button onClick={() => handleNumber('5')} className="button number">5</button>
        <button onClick={() => handleNumber('6')} className="button number">6</button>
        <button onClick={() => handleOperator('-')} className="button operator">-</button>
        <button onClick={() => handleNumber('1')} className="button number">1</button>
        <button onClick={() => handleNumber('2')} className="button number">2</button>
        <button onClick={() => handleNumber('3')} className="button number">3</button>
        <button onClick={() => handleOperator('+')} className="button operator">+</button>
        <button onClick={() => handleNumber('0')} className="button number zero">0</button>
        <button onClick={() => handleNumber('.')} className="button number">.</button>
        <button onClick={handleEqual} className="button equal">=</button>
      </div>
    </div>
  );
});

Calculator.displayName = 'Calculator';

export default Calculator; 