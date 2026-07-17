import type {
  RsvpStatus,
  MealPreference,
  VendorCategory,
  VendorStatus,
  TaskPriority,
} from './types';

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  pending: 'Pending',
  attending: 'Attending',
  declined: 'Declined',
};

export const MEAL_PREFERENCE_LABELS: Record<MealPreference, string> = {
  standard: 'Standard',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  gluten_free: 'Gluten-Free',
};

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  florist: 'Florist',
  caterer: 'Caterer',
  music: 'Music',
  photographer: 'Photographer',
  security: 'Security',
  planning: 'Event Planning',
};

export const VENDOR_STATUS_LABELS: Record<VendorStatus, string> = {
  contacted: 'Contacted',
  pending: 'Pending',
  booked: 'Booked',
  declined: 'Declined',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
