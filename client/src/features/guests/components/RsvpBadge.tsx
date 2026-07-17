import type { RsvpStatus } from '@buttercup/shared/types';
import { RSVP_STATUS_LABELS } from '@buttercup/shared/constants';
import { Badge } from '@/components/Badge';

const TONE_BY_STATUS: Record<RsvpStatus, 'success' | 'warning' | 'danger'> = {
  attending: 'success',
  pending: 'warning',
  declined: 'danger',
};

interface RsvpBadgeProps {
  status: RsvpStatus;
}

export function RsvpBadge({ status }: RsvpBadgeProps) {
  return <Badge tone={TONE_BY_STATUS[status]}>{RSVP_STATUS_LABELS[status]}</Badge>;
}
