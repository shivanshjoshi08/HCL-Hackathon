import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// Wrapper for components that need Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('UI Components', () => {
  describe('Button Component', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Styled</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('Input Component', () => {
    it('renders input element', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('handles value changes', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('supports different input types', () => {
      render(<Input type="email" data-testid="email-input" />);
      expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email');
    });

    it('can be disabled', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('Label Component', () => {
    it('renders label with text', () => {
      render(<Label>Username</Label>);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('associates with input via htmlFor', () => {
      render(
        <>
          <Label htmlFor="test-input">Test Label</Label>
          <Input id="test-input" />
        </>
      );
      expect(screen.getByText('Test Label')).toHaveAttribute('for', 'test-input');
    });
  });
});

describe('Form Validation', () => {
  it('validates email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('user@domain.co.in')).toBe(true);
    expect(emailRegex.test('invalid')).toBe(false);
    expect(emailRegex.test('test@')).toBe(false);
  });

  it('validates password strength', () => {
    const isStrongPassword = (password) => {
      return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);
    };

    expect(isStrongPassword('Password123')).toBe(true);
    expect(isStrongPassword('weak')).toBe(false);
    expect(isStrongPassword('noupppercase1')).toBe(false);
  });

  it('validates phone number format', () => {
    const phoneRegex = /^[0-9]{10}$/;
    
    expect(phoneRegex.test('9876543210')).toBe(true);
    expect(phoneRegex.test('123')).toBe(false);
    expect(phoneRegex.test('abcdefghij')).toBe(false);
  });
});
