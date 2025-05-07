import React, { memo, useState, useCallback } from 'react';

interface CalculatorButtonProps {
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = memo(({ onClick, className, children }) => (
  <button onClick={onClick} className={`button ${className}`}>
    {children}
  </button>
));

CalculatorButton.displayName = 'CalculatorButton';

interface NumberPadProps {
  onNumberClick: (num: string) => void;
}

const NumberPad: React.FC<NumberPadProps> = memo(({ onNumberClick }) => {
  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];
  
  return (
    <div className="number-pad">
      {numbers.map((num) => (
        <CalculatorButton
          key={num}
          onClick={() => onNumberClick(num)}
          className={`number ${num === '0' ? 'zero' : ''}`}
        >
          {num}
        </CalculatorButton>
      ))}
    </div>
  );
});

NumberPad.displayName = 'NumberPad';

interface OperatorPadProps {
  onOperatorClick: (operator: string) => void;
  onClear: () => void;
  onEqual: () => void;
}

const OperatorPad: React.FC<OperatorPadProps> = memo(({ onOperatorClick, onClear, onEqual }) => {
  const operators = [
    { symbol: 'C', className: 'clear', onClick: onClear },
    { symbol: '÷', className: 'operator', onClick: () => onOperatorClick('/') },
    { symbol: '×', className: 'operator', onClick: () => onOperatorClick('*') },
    { symbol: '-', className: 'operator', onClick: () => onOperatorClick('-') },
    { symbol: '+', className: 'operator', onClick: () => onOperatorClick('+') },
    { symbol: '=', className: 'equal', onClick: onEqual }
  ];

  return (
    <div className="operator-pad">
      {operators.map((op) => (
        <CalculatorButton
          key={op.symbol}
          onClick={op.onClick}
          className={op.className}
        >
          {op.symbol}
        </CalculatorButton>
      ))}
    </div>
  );
});

OperatorPad.displayName = 'OperatorPad';

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
        <NumberPad onNumberClick={handleNumber} />
        <OperatorPad
          onOperatorClick={handleOperator}
          onClear={handleClear}
          onEqual={handleEqual}
        />
      </div>
    </div>
  );
});

Calculator.displayName = 'Calculator';

export default Calculator; 