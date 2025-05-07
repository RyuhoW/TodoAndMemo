import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../components/Calculator';

describe('Calculator', () => {
  it('renders calculator display', () => {
    render(<Calculator />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays numbers when clicked', async () => {
    render(<Calculator />);
    await userEvent.click(screen.getByText('1'));
    await userEvent.click(screen.getByText('2'));
    await userEvent.click(screen.getByText('3'));
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('performs addition correctly', async () => {
    render(<Calculator />);
    await userEvent.click(screen.getByText('1'));
    await userEvent.click(screen.getByText('+'));
    await userEvent.click(screen.getByText('2'));
    await userEvent.click(screen.getByText('='));
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('clears display when C is clicked', async () => {
    render(<Calculator />);
    await userEvent.click(screen.getByText('1'));
    await userEvent.click(screen.getByText('2'));
    await userEvent.click(screen.getByText('C'));
    expect(screen.getByText('0')).toBeInTheDocument();
  });
}); 