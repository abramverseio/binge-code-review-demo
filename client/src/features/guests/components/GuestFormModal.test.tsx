import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GuestFormModal } from './GuestFormModal';

describe('GuestFormModal', () => {
  it('shows a validation error and does not submit when required fields are empty', async () => {
    const onSubmit = vi.fn();
    render(<GuestFormModal open onClose={() => {}} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed form values when all required fields are filled in', async () => {
    const onSubmit = vi.fn();
    render(<GuestFormModal open onClose={() => {}} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('First name'), 'Fezzik');
    await userEvent.type(screen.getByLabelText('Last name'), 'Giant');
    await userEvent.type(screen.getByLabelText('Household'), 'Wedding Party');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'Fezzik', lastName: 'Giant', household: 'Wedding Party' }),
    );
  });

  it('prefills fields from initialValues when provided at mount', () => {
    const onSubmit = vi.fn();
    render(
      <GuestFormModal
        open
        onClose={() => {}}
        onSubmit={onSubmit}
        initialValues={{ firstName: 'Inigo', lastName: 'Montoya', household: 'Wedding Party', notes: '' }}
      />,
    );

    expect((screen.getByLabelText('First name') as HTMLInputElement).value).toBe('Inigo');
    expect((screen.getByLabelText('Last name') as HTMLInputElement).value).toBe('Montoya');
    expect((screen.getByLabelText('Household') as HTMLInputElement).value).toBe('Wedding Party');
  });
});
