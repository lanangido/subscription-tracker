/**
 * Computes the subscription status based on the renewal date and current status.
 * @param renewalDate Date of subscription renewal
 * @param currentStatus The currently saved status in DB
 * @returns "Cancelled" | "Expired" | "Expiring Soon" | "Active"
 */
export function calculateStatus(renewalDate: Date, currentStatus: string): string {
  if (currentStatus === "Cancelled") {
    return "Cancelled";
  }

  const now = new Date();
  // Normalize dates to start of day for accurate day differences
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const renewal = new Date(renewalDate.getFullYear(), renewalDate.getMonth(), renewalDate.getDate());

  // Difference in time
  const diffTime = renewal.getTime() - today.getTime();
  // Difference in days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Expired";
  }

  if (diffDays >= 0 && diffDays <= 7) {
    return "Expiring Soon";
  }

  return "Active";
}
