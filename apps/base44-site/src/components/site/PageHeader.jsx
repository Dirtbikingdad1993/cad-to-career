export default function PageHeader({ kicker, title, intro, children }) {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="pointer-events-none absolute inset-0 grid-sheet opacity-30" />
      <div className="relative mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-20">
        {kicker && <p className="mono-label">{kicker}</p>}
        <h1 className="mt-4 max-w-3xl font-heading text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{intro}</p>}
        {children}
      </div>
    </section>
  );
}