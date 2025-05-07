import React, { useState, useCallback } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = useCallback((num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(prev => prev + num);
    }
  }, [isNewNumber]);

  const handleOperator = useCallback((op: string) => {
    setExpression(prev => prev + display + op);
    setIsNewNumber(true);
  }, [display]);

  const handleEqual = useCallback(() => {
    try {
      const result = new Function('return ' + expression + display)();
      setDisplay(String(result));
      setExpression('');
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setExpression('');
      setIsNewNumber(true);
    }
  }, [display, expression]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setIsNewNumber(true);
  }, []);

  const renderButton = useCallback((content: string, onClick: () => void, className: string = '') => (
    <button
      onClick={onClick}
      className={`calculator-button ${className}`}
    >
      {content}
    </button>
  ), []);

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="expression">{expression}</div>
        <div className="result" data-testid="calculator-result">{display}</div>
      </div>
      <div className="calculator-buttons">
        <div className="button-row">
          {renderButton('7', () => handleNumber('7'))}
          {renderButton('8', () => handleNumber('8'))}
          {renderButton('9', () => handleNumber('9'))}
          {renderButton('÷', () => handleOperator('/'), 'operator')}
        </div>
        <div className="button-row">
          {renderButton('4', () => handleNumber('4'))}
          {renderButton('5', () => handleNumber('5'))}
          {renderButton('6', () => handleNumber('6'))}
          {renderButton('×', () => handleOperator('*'), 'operator')}
        </div>
        <div className="button-row">
          {renderButton('1', () => handleNumber('1'))}
          {renderButton('2', () => handleNumber('2'))}
          {renderButton('3', () => handleNumber('3'))}
          {renderButton('-', () => handleOperator('-'), 'operator')}
        </div>
        <div className="button-row">
          {renderButton('0', () => handleNumber('0'))}
          {renderButton('.', () => handleNumber('.'))}
          {renderButton('=', handleEqual, 'equal')}
          {renderButton('+', () => handleOperator('+'), 'operator')}
        </div>
        <div className="button-row">
          {renderButton('C', handleClear, 'clear')}
        </div>
      </div>
    </div>
  );
};

export default Calculator; 