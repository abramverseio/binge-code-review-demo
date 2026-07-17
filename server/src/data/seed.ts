import { guestRepository } from '../repositories/GuestRepository';
import { vendorRepository } from '../repositories/VendorRepository';
import { taskRepository } from '../repositories/TaskRepository';
import { tableRepository } from '../repositories/TableRepository';
import { budgetRepository } from '../repositories/BudgetRepository';
import type { Guest, Vendor, Task, Table, BudgetItem } from '@buttercup/shared/types';

export function seedDatabase(): void {
  const tables: Table[] = [
    { id: 'table-1', name: 'Cliffs of Insanity', capacity: 8 },
    { id: 'table-2', name: 'Fire Swamp', capacity: 6 },
    { id: 'table-3', name: 'Florin Ballroom', capacity: 10 },
    { id: 'table-4', name: 'Guilder Garden', capacity: 8 },
    { id: 'table-5', name: 'Miracle Pavilion', capacity: 4 },
  ];
  tableRepository.seed(tables);

  const guests: Guest[] = [
    { id: 'guest-1', firstName: 'Westley', lastName: '', household: 'The Groom', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-3', plusOne: false, notes: 'Groom.' },
    { id: 'guest-2', firstName: 'Buttercup', lastName: '', household: 'The Bride', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-3', plusOne: false, notes: 'Bride.' },
    { id: 'guest-3', firstName: 'Inigo', lastName: 'Montoya', household: 'Wedding Party', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-1', plusOne: true, notes: 'Best man. Has a few words prepared.' },
    { id: 'guest-4', firstName: 'Fezzik', lastName: '', household: 'Wedding Party', rsvpStatus: 'attending', mealPreference: 'vegetarian', tableId: 'table-1', plusOne: false, notes: '' },
    { id: 'guest-5', firstName: 'Miracle', lastName: 'Max', household: 'Family Friends', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-5', plusOne: true, notes: 'Bring the chocolate-coated pill just in case.' },
    { id: 'guest-6', firstName: 'Valerie', lastName: '', household: 'Family Friends', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-5', plusOne: false, notes: '' },
    { id: 'guest-7', firstName: 'Prince', lastName: 'Humperdinck', household: 'Florin Royal Court', rsvpStatus: 'declined', mealPreference: 'standard', tableId: null, plusOne: false, notes: 'Sent regrets.' },
    { id: 'guest-8', firstName: 'Count', lastName: 'Rugen', household: 'Florin Royal Court', rsvpStatus: 'declined', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
    { id: 'guest-9', firstName: 'Vizzini', lastName: '', household: 'Guilder Delegation', rsvpStatus: 'pending', mealPreference: 'standard', tableId: null, plusOne: false, notes: 'Awaiting reply.' },
    { id: 'guest-10', firstName: 'Alice', lastName: 'Fenwick', household: 'Fenwick Family', rsvpStatus: 'attending', mealPreference: 'vegan', tableId: 'table-4', plusOne: true, notes: '' },
    { id: 'guest-11', firstName: 'Tom', lastName: 'Fenwick', household: 'Fenwick Family', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-4', plusOne: false, notes: '' },
    { id: 'guest-12', firstName: 'Priya', lastName: 'Shah', household: 'College Friends', rsvpStatus: 'attending', mealPreference: 'gluten_free', tableId: 'table-4', plusOne: false, notes: '' },
    { id: 'guest-13', firstName: 'Marcus', lastName: 'Ortiz', household: 'College Friends', rsvpStatus: 'pending', mealPreference: 'standard', tableId: null, plusOne: true, notes: '' },
    { id: 'guest-14', firstName: 'Helen', lastName: 'OBrien', household: 'Neighbors', rsvpStatus: 'attending', mealPreference: 'vegetarian', tableId: 'table-2', plusOne: false, notes: '' },
    { id: 'guest-15', firstName: 'Grant', lastName: 'Diaz', household: 'Neighbors', rsvpStatus: 'declined', mealPreference: 'standard', tableId: null, plusOne: false, notes: 'Scheduling conflict.' },
  ];
  guestRepository.seed(guests);

  const vendors: Vendor[] = [
    { id: 'vendor-1', name: 'Miracle Max Catering', category: 'caterer', contactName: 'Max', phone: '555-010-1001', email: 'max@miraclemaxcatering.example', estimatedCost: 12000, actualCost: 11800, status: 'booked' },
    { id: 'vendor-2', name: 'Fezzik Security', category: 'security', contactName: 'Fezzik', phone: '555-010-1002', email: 'fezzik@fezzikevents.example', estimatedCost: 2500, actualCost: null, status: 'booked' },
    { id: 'vendor-3', name: 'Inigo Fencing Academy', category: 'music', contactName: 'Inigo Montoya', phone: '555-010-1003', email: 'inigo@fencingacademy.example', estimatedCost: 1800, actualCost: null, status: 'pending' },
    { id: 'vendor-4', name: 'Dread Pirate Photography', category: 'photographer', contactName: 'Westley', phone: '555-010-1004', email: 'bookings@dreadpiratephoto.example', estimatedCost: 4200, actualCost: 4200, status: 'booked' },
    { id: 'vendor-5', name: 'Vizzini Event Planning', category: 'planning', contactName: 'Vizzini', phone: '555-010-1005', email: 'vizzini@inconceivableevents.example', estimatedCost: 3000, actualCost: null, status: 'contacted' },
    { id: 'vendor-6', name: 'Florin Blooms', category: 'florist', contactName: 'Rosa Delgado', phone: '555-010-1006', email: 'rosa@florinblooms.example', estimatedCost: 2200, actualCost: 2350, status: 'booked' },
  ];
  vendorRepository.seed(vendors);

  const tasks: Task[] = [
    { id: 'task-1', title: 'Pay venue deposit', description: 'Wire deposit to Florin Ballroom.', dueDate: '2026-08-01', priority: 'high', completed: true, assignedTo: 'Buttercup' },
    { id: 'task-2', title: 'Finalize guest list', description: 'Confirm final headcount for catering.', dueDate: '2026-08-15', priority: 'high', completed: false, assignedTo: 'Westley' },
    { id: 'task-3', title: 'Cake tasting', description: 'Schedule tasting with two bakeries.', dueDate: '2026-08-20', priority: 'medium', completed: false, assignedTo: 'Buttercup' },
    { id: 'task-4', title: 'Confirm security detail', description: 'Walk the venue perimeter with Fezzik.', dueDate: '2026-08-10', priority: 'medium', completed: false, assignedTo: 'Fezzik' },
    { id: 'task-5', title: 'Order invitations', description: 'Finalize wording and place print order.', dueDate: '2026-07-25', priority: 'high', completed: true, assignedTo: 'Vizzini Event Planning' },
    { id: 'task-6', title: 'Book officiant', description: 'The Impressive Clergyman is available on the date.', dueDate: '2026-08-05', priority: 'medium', completed: true, assignedTo: 'Buttercup' },
    { id: 'task-7', title: 'Send final headcount to caterer', description: 'Due one week before the wedding.', dueDate: '2026-09-01', priority: 'high', completed: false, assignedTo: 'Westley' },
    { id: 'task-8', title: 'Arrange transportation', description: 'Coordinate carriages for the wedding party.', dueDate: '2026-08-28', priority: 'low', completed: false, assignedTo: 'Vizzini Event Planning' },
  ];
  taskRepository.seed(tasks);

  const budgetItems: BudgetItem[] = [
    { id: 'budget-1', category: 'Venue', planned: 15000, actual: 15000 },
    { id: 'budget-2', category: 'Catering', planned: 12000, actual: 11800 },
    { id: 'budget-3', category: 'Attire', planned: 3000, actual: 3400 },
    { id: 'budget-4', category: 'Photography', planned: 4200, actual: 4200 },
    { id: 'budget-5', category: 'Music', planned: 1800, actual: 0 },
    { id: 'budget-6', category: 'Flowers', planned: 2200, actual: 2350 },
    { id: 'budget-7', category: 'Security', planned: 2500, actual: 0 },
    { id: 'budget-8', category: 'Miscellaneous', planned: 1500, actual: 620 },
  ];
  budgetRepository.seed(budgetItems);
}
