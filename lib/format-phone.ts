export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  let normalized: string;
  if (digits.startsWith("2547") || digits.startsWith("2541")) {
    normalized = digits;
  } else if (digits.startsWith("07") || digits.startsWith("01")) {
    normalized = "254" + digits.slice(1);
  } else if (digits.startsWith("7") || digits.startsWith("1")) {
    normalized = "254" + digits;
  } else {
    normalized = digits;
  }

  return "+" + normalized;
}
