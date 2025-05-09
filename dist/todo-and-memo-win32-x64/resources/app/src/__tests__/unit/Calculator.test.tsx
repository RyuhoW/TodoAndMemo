import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../../components/calculator/Calculator';

describe('Calculator', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  const getDisplayValue = () => {
    const display = screen.getByTestId('calculator-result');
    return display.textContent;
  };

  it('renders calculator display with initial value', () => {
    expect(getDisplayValue()).toBe('0');
  });

  it('displays numbers when clicked', async () => {
    const user = userEvent.setup();
    const buttons = ['1', '2', '3'].map(num => screen.getByRole('button', { name: num }));
    
    for (const button of buttons) {
      await user.click(button);
    }
    
    expect(getDisplayValue()).toBe('123');
  });

  it('performs addition correctly', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '=' }));
    
    expect(getDisplayValue()).toBe('3');
  });

  it('performs subtraction correctly', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '-' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '=' }));
    
    expect(getDisplayValue()).toBe('2');
  });

  it('clears display when C is clicked', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: 'C' }));
    
    expect(getDisplayValue()).toBe('0');
  });

  it('handles decimal calculations correctly', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '.' }));
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '.' }));
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '=' }));
    
    expect(getDisplayValue()).toBe('4');
  });
}); 