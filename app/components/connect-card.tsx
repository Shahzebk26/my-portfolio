import type { SiteContent } from "../../lib/content-storage";

type Method = { label: string; value: string; href: string };

type ConnectCardProps = {
  connect: SiteContent["connect"];
  fallbackEmail?: string;
  extraMethods?: Method[];
};

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1v3.4c0 .6-.4 1-1 1C10.6 20.6 3.4 13.4 3.4 4c0-.6.4-1 1-1H8c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2 2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4L9.8 8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.9 2.3 1 2.5.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.1.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
      <path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02ZM7 8.48H3V21h4V8.48Zm6.32 0H9.35V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M9.5 14.5 14.5 9.5M11 7l.7-.7a3.5 3.5 0 0 1 5 5l-.7.7M13 17l-.7.7a3.5 3.5 0 0 1-5-5l.7-.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function methodIcon(label: string) {
  const key = label.toLowerCase();
  if (key.includes("linkedin")) return <LinkedInIcon />;
  if (key.includes("github")) return <GithubIcon />;
  return <LinkIcon />;
}

const rowClass =
  "flex items-center gap-3 rounded-2xl border border-(--border) bg-(--panel) px-4 py-3 text-sm font-semibold text-(--text-strong) transition duration-300 hover:border-cyan-400/40";

export default function ConnectCard({ connect, fallbackEmail, extraMethods = [] }: ConnectCardProps) {
  const email = connect.email || fallbackEmail || "";
  const cleanMethods = extraMethods.filter((method) => method.label.toLowerCase() !== "email");

  return (
    <div className="h-full">
      <div className="glass-panel flex h-full flex-col rounded-3xl border border-(--border) bg-(--panel-strong) p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
        <h3 className="text-2xl font-semibold text-(--text-strong)">
          <span className="text-cyan-400">{connect.cardHeading}</span> {connect.cardHeadingHighlight}
        </h3>
        <p className="mt-2 text-sm text-(--muted)">{connect.cardSubheading}</p>

        <div className="mt-6 space-y-4">
          {email ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Email address</p>
              <a href={`mailto:${email}`} className={`mt-2 ${rowClass}`}>
                <MailIcon />
                {email}
              </a>
            </div>
          ) : null}

          {connect.phone ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Phone number</p>
              <a href={`tel:${connect.phone.replace(/\s+/g, "")}`} className={`mt-2 ${rowClass}`}>
                <PhoneIcon />
                {connect.phone}
              </a>
            </div>
          ) : null}

          {cleanMethods.map((method) => (
            <div key={method.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">{method.label}</p>
              <a href={method.href} target="_blank" rel="noreferrer" className={`mt-2 ${rowClass}`}>
                {methodIcon(method.label)}
                {method.value}
              </a>
            </div>
          ))}

          {connect.whatsappUrl ? (
            <a
              href={connect.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/20"
            >
              <WhatsAppIcon />
              {connect.whatsappLabel}
            </a>
          ) : null}
        </div>

        {connect.statusOnlineLabel || connect.statusResponseLabel ? (
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 text-xs text-(--muted)">
            {connect.statusOnlineLabel ? (
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {connect.statusOnlineLabel}
              </span>
            ) : null}
            {connect.statusResponseLabel ? (
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {connect.statusResponseLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
