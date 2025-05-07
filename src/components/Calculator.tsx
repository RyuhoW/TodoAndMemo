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

const NumberPad: React.FC<NumberPadProps> = memo(({ onNumberClick }) => (
  <div className="number-pad">
    <CalculatorButton onClick={() => onNumberClick('7')} className="number">7</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('8')} className="number">8</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('9')} className="number">9</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('4')} className="number">4</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('5')} className="number">5</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('6')} className="number">6</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('1')} className="number">1</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('2')} className="number">2</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('3')} className="number">3</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('0')} className="number zero">0</CalculatorButton>
    <CalculatorButton onClick={() => onNumberClick('.')} className="number">.</CalculatorButton>
  </div>
));

NumberPad.displayName = 'NumberPad';

interface OperatorPadProps {
  onOperatorClick: (operator: string) => void;
  onClear: () => void;
  onEqual: () => void;
}

const OperatorPad: React.FC<OperatorPadProps> = memo(({ onOperatorClick, onClear, onEqual }) => (
  <div className="operator-pad">
    <CalculatorButton onClick={onClear} className="clear">C</CalculatorButton>
    <CalculatorButton onClick={() => onOperatorClick('/')} className="operator">÷</CalculatorButton>
    <CalculatorButton onClick={() => onOperatorClick('*')} className="operator">×</CalculatorButton>
    <CalculatorButton onClick={() => onOperatorClick('-')} className="operator">-</CalculatorButton>
    <CalculatorButton onClick={() => onOperatorClick('+')} className="operator">+</CalculatorButton>
    <CalculatorButton onClick={onEqual} className="equal">=</CalculatorButton>
  </div>
));

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