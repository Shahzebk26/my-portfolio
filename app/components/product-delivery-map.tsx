type MapCardProps = {
  type: "frontend" | "backend" | "mobile" | "cloud";
  eyebrow: string;
  title: string;
  detail: string;
  children: React.ReactNode;
};

function MapCard({ type, eyebrow, title, detail, children }: MapCardProps) {
  return (
    <div className={`delivery-map-card delivery-map-card-${type}`}>
      <div className="delivery-map-card-icon" aria-hidden="true">{children}</div>
      <div>
        <p className="delivery-map-card-eyebrow">{eyebrow}</p>
        <p className="delivery-map-card-title">{title}</p>
        <p className="delivery-map-card-detail">{detail}</p>
      </div>
    </div>
  );
}

export default function ProductDeliveryMap() {
  return (
    <section className="product-delivery-map mt-16" aria-labelledby="delivery-map-heading">
      <div className="delivery-map-header">
        <div className="delivery-map-brand-mark">SK</div>
        <h2 id="delivery-map-heading">Product delivery map</h2>
        <span className="delivery-map-status"><i /> System online</span>
      </div>

      <div className="delivery-map-stage">
        <div className="delivery-map-orbit delivery-map-orbit-large" />
        <div className="delivery-map-orbit delivery-map-orbit-small" />
        <div className="delivery-map-grid" />
        <svg className="delivery-map-connectors" viewBox="0 0 1000 620" fill="none" aria-hidden="true" preserveAspectRatio="none">
          <path className="delivery-map-connector delivery-map-connector-cyan" d="M105 145H365C405 145 423 205 452 250" />
          <path className="delivery-map-connector delivery-map-connector-purple" d="M895 145H635C595 145 577 205 548 250" />
          <path className="delivery-map-connector delivery-map-connector-cyan" d="M105 475H365C405 475 423 415 452 370" />
          <path className="delivery-map-connector delivery-map-connector-green" d="M895 475H635C595 475 577 415 548 370" />
          <path className="delivery-map-connector delivery-map-connector-muted" d="M500 390V550H760" />
        </svg>

        <MapCard type="frontend" eyebrow="Interface" title="Frontend" detail="React · Next.js">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </MapCard>
        <MapCard type="backend" eyebrow="Systems" title="Backend" detail="Next.js · APIs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" strokeLinejoin="round" /><path d="m5 7 7 4 7-4M12 11v10" /></svg>
        </MapCard>
        <MapCard type="mobile" eyebrow="Experience" title="Mobile" detail="React Native">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" strokeLinecap="round" /></svg>
        </MapCard>
        <MapCard type="cloud" eyebrow="Delivery" title="Cloud" detail="AWS · Docker">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6.5 18h10.8a3.7 3.7 0 1 0-.6-7.35A5.5 5.5 0 0 0 6.5 12a3 3 0 0 0 0 6Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </MapCard>

        <div className="delivery-map-core">
          <span className="delivery-map-core-label">Product</span>
          <strong>SK</strong>
          <span className="delivery-map-core-status">One connected build</span>
        </div>

        <div className="delivery-map-ready"><span>✓</span><div><small>Delivery signal</small><strong>Ready to ship</strong></div></div>
      </div>

      <div className="delivery-map-stack">
        <span>Core stack</span>
        {['React', 'Next.js', 'TypeScript', 'Next JS', 'Postgres', 'AWS'].map((item) => <strong key={item}>{item}</strong>)}
        <span className="delivery-map-layer-count">04 connected layers</span>
      </div>
    </section>
  );
}
