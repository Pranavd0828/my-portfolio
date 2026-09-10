export type ContactMessage = { name: string; email: string; message: string };
export async function sendContact(
  payload: ContactMessage,
  fetcher: typeof fetch = fetch,
  timeoutMs = 12000,
): Promise<void> {
  const clean = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
  };
  if (
    !clean.name ||
    !clean.message ||
    !/^\S+@\S+\.\S+$/.test(clean.email) ||
    clean.name.length > 100 ||
    clean.email.length > 254 ||
    clean.message.length > 5000
  )
    throw new Error("Please check your name, email, and message.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher("https://formspree.io/f/mzdlepvr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(clean),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Delivery was not confirmed");
  } finally {
    clearTimeout(timer);
  }
}
