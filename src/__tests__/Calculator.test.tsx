import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../components/Calculator';

describe('Calculator', () => {
  it('renders calculator display', () => {
    render(<Calculator />);
    expect(screen.getByTestId('result')).toHaveTextContent('0');
  });

  it('displays numbers when clicked', async () => {
    render(<Calculator />);
    await userEvent.click(screen.getByText('1'));
    await userEvent.click(screen.getByText('2'));
    await userEvent.click(screen.getByText('3'));
    expect(screen.getByTestId('result')).toHaveTextContent('123');
  });

  it('performs addition correctly', async () => {
    render(<Calculator />);
    await userEvent.click(screen.getByText('1'));
    await userEvent.click(screen.getByText('+'));
    await userEvent.click(screen.getByText('2'));
    await userEvent.click(screen.getByText('='));
    expect(screen.getByTestId('result')).toHaveTextContent('3');
  });

  it('clears display when C is clicked', async () => {
    render(<Calculator />);
    await userEvent.click(screen.getByText('1'));
    await userEvent.click(screen.getByText('2'));
    await userEvent.click(screen.getByText('C'));
    expect(screen.getByTestId('result')).toHaveTextContent('0');
  });
}); 