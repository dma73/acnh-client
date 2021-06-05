import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login screen by default', () => {
  render(<App />);
  const linkElement = screen.getByText('Username');
  expect(linkElement).toBeInTheDocument();
});
