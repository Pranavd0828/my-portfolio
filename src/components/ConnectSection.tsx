"use client";
import { useRef, useState } from "react";
import { sendContact } from "@/lib/contact";
export default function ConnectSection() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "invalid" | "error"
  >("idle");
  const busy = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    if (values.get("website")) return;
    const name = String(values.get("name") ?? "").trim(),
      email = String(values.get("email") ?? "").trim(),
      message = String(values.get("message") ?? "").trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
      setStatus("invalid");
      return;
    }
    busy.current = true;
    setStatus("submitting");
    try {
      await sendContact({ name, email, message });
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }
  return (
    <section id="connect" className="contact-section">
      <div className="shell section-space contact-grid">
        <div>
          <p className="eyebrow">05 / What comes next</p>
          <h2 className="section-heading mt-4">
            Let’s build
            <br />
            something that matters.
          </h2>
          <p className="body-copy mt-6">
            I’m interested in product leadership where ads, marketplaces, AI,
            and consumer experiences meet—and where technical depth and
            product judgment need to work together.
          </p>
          <p className="contact-location">
            Based in Sunnyvale, CA.
            <br />
            Open to remote, hybrid, and relocation.
          </p>
          <a
            href="mailto:deopranav2808.work@gmail.com"
            className="contact-email"
          >
            deopranav2808.work@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <div className="contact-links">
            <a
              href="https://linkedin.com/in/pranav-deo"
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a
              href="/Pranav-Deo-Resume.pdf"
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Résumé (PDF) ↗
            </a>
          </div>
        </div>
        <form
          onSubmit={submit}
          className="contact-form"
          aria-label="Contact Pranav"
          aria-busy={status === "submitting"}
        >
          <div className="form-pair">
            <div>
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                disabled={status === "submitting"}
              />
            </div>
            <div>
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                disabled={status === "submitting"}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message">
              What would you like to talk about?
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              maxLength={5000}
              disabled={status === "submitting"}
              aria-describedby="contact-privacy"
            />
          </div>
          <div hidden aria-hidden="true">
            <label htmlFor="website">Leave this empty</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <p id="contact-privacy" className="form-note">
            Your message is delivered through Formspree. Prefer email? Use the
            address alongside this form.
          </p>
          <div>
            <button
              type="submit"
              className="button button-primary"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Send message"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div
            className="form-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {status === "success" && "Thanks — your message has been sent."}
            {status === "invalid" && "Please enter your name, a valid email address, and a message."}
            {status === "error" && (
              <>
                I couldn’t confirm delivery. Your message is still here. Please
                try again or{" "}
                <a
                  href="mailto:deopranav2808.work@gmail.com"
                  className="underline"
                >
                  email me directly
                </a>
                .
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
