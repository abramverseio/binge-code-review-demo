export type RsvpStatus = 'pending' | 'attending' | 'declined';

export type MealPreference = 'standard' | 'vegetarian' | 'vegan' | 'gluten_free';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  household: string;
  rsvpStatus: RsvpStatus;
  mealPreference: MealPreference;
  tableId: string | null;
  plusOne: boolean;
  // TODO: support dietary restrictions beyond a single meal preference
  notes: string;
}
