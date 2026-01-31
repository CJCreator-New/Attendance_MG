import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LiveIndicator from '../../components/LiveIndicator';

describe('LiveIndicator', () => {
  it('should render live status', () => {
    render(<LiveIndicator isConnected={true} />);
    expect(screen.getByText(/live/i)).toBeInTheDocument();
  });

  it('should render offline status', () => {
    render(<LiveIndicator isConnected={false} />);
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });

  it('should show last update time', () => {
    const lastUpdate = new Date();
    render(<LiveIndicator isConnected={true} lastUpdate={lastUpdate} />);
    expect(screen.getByText(/last update/i)).toBeInTheDocument();
  });
});
