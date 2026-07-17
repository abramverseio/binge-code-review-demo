/**
 * Notification stub. Currently logs instead of sending real email.
 * TODO: email RSVP reminders (see docs/issues.md).
 */
export class NotificationService {
  async sendRsvpReminder(guestId: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`[notification-stub] Would send RSVP reminder to guest ${guestId}`);
  }
}

export const notificationService = new NotificationService();
