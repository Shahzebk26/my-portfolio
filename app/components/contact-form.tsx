"use client";

type ContactFormProps = {
  email: string;
  whatsappUrl?: string;
  phone?: string;
};

const inputClass =
  "w-full rounded-xl border border-(--border) bg-(--panel-strong) px-4 py-3 text-sm text-(--text-strong) outline-none transition placeholder:text-(--muted) focus:border-cyan-400";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4L9.8 8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.9 2.3 1 2.5.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.1.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

export default function ContactForm({ email, whatsappUrl, phone }: ContactFormProps) {
  const phoneNumber = phone?.replace(/\D/g, "");
  const chatUrl = whatsappUrl || (phoneNumber ? `https://wa.me/${phoneNumber}` : "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const senderEmail = String(data.get("email") || "").trim();
    const senderPhone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${senderEmail}\nPhone: ${senderPhone || "Not provided"}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-(--text-strong)">
          Your name
          <input name="name" autoComplete="name" required className={`${inputClass} mt-2`} placeholder="Name" />
        </label>
        <label className="block text-sm font-medium text-(--text-strong)">
          Email address
          <input name="email" type="email" autoComplete="email" required className={`${inputClass} mt-2`} placeholder="you@example.com" />
        </label>
      </div>
      <label className="block text-sm font-medium text-(--text-strong)">
        Phone number <span className="font-normal text-(--muted)">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className={`${inputClass} mt-2`} placeholder="Your phone number" />
      </label>
      <label className="block text-sm font-medium text-(--text-strong)">
        Message
        <textarea name="message" required rows={5} className={`${inputClass} mt-2 resize-y`} placeholder="Tell me a little about your project..." />
      </label>
      <button type="submit" className="btn-primary inline-flex w-full items-center justify-center rounded-full px-6 py-3 font-semibold text-slate-950">
        Send message
      </button>
      {chatUrl ? (
        <a
          href={chatUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-4 rounded-[1.25rem] border border-emerald-500/35 bg-emerald-950/25 px-5 py-5 text-center text-lg font-bold uppercase tracking-[0.06em] text-slate-200 transition hover:border-emerald-400 hover:bg-emerald-950/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <span className="text-emerald-400"><WhatsAppIcon /></span>
          Connect on WhatsApp
        </a>
      ) : null}
    </form>
  );
}
