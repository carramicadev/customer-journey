export function calculateETA(duration?: string) {
  if (!duration) return "-";

  const now = new Date();

  const numbers = duration.match(/\d+/g);
  if (!numbers) return duration;

  const max = Number(numbers[numbers.length - 1]);

  /* ================= HOURS ================= */
  if (duration.toLowerCase().includes("hour")) {
    const eta = new Date(now.getTime() + max * 60 * 60 * 1000);

    return eta.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ================= DAYS ================= */
  let added = 0;
  const eta = new Date(now);

  while (added < max) {
    eta.setDate(eta.getDate() + 1);

    if (eta.getDay() !== 0) added++; // skip sunday
  }

  return eta.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
