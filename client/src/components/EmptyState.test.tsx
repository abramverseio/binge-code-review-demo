import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(<EmptyState title="No guests yet" description="Add your first guest to get started." />);

    expect(screen.getByText('No guests yet')).toBeInTheDocument();
    expect(screen.getByText('Add your first guest to get started.')).toBeInTheDocument();
  });

  it('does not render an icon wrapper when no icon is provided', () => {
    const { container } = render(<EmptyState title="No guests yet" />);

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders the provided icon above the title', () => {
    render(<EmptyState title="No guests yet" icon={<svg data-testid="empty-icon" />} />);

    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });
});
