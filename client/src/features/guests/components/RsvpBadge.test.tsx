import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RsvpBadge } from './RsvpBadge';

describe('RsvpBadge', () => {
  it('renders the human-readable label for each status', () => {
    render(<RsvpBadge status="attending" />);
    expect(screen.getByText('Attending')).toBeInTheDocument();
  });

  it('renders declined guests distinctly from attending guests', () => {
    render(<RsvpBadge status="declined" />);
    expect(screen.getByText('Declined')).toBeInTheDocument();
  });
});
