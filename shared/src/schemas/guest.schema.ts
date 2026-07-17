import { z } from 'zod';

export const rsvpStatusSchema = z.enum(['pending', 'attending', 'declined']);
export const mealPreferenceSchema = z.enum(['standard', 'vegetarian', 'vegan', 'gluten_free']);

export const guestCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  household: z.string().min(1, 'Household is required'),
  rsvpStatus: rsvpStatusSchema.default('pending'),
  mealPreference: mealPreferenceSchema.default('standard'),
  tableId: z.string().nullable().default(null),
  plusOne: z.boolean().default(false),
  // Intentionally unbounded — no max length. TODO: add stricter validation.
  notes: z.string().default(''),
});

export const guestUpdateSchema = guestCreateSchema.partial();

export type GuestCreateInput = z.infer<typeof guestCreateSchema>;
export type GuestUpdateInput = z.infer<typeof guestUpdateSchema>;
