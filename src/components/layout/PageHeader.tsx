interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-amber-100/10 bg-[#06100d] py-14 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(244,200,107,0.16),transparent_26rem),radial-gradient(circle_at_90%_20%,rgba(142,214,208,0.12),transparent_24rem)]" />
      <div className="section-shell max-w-4xl">
        <p className="relative text-sm font-semibold text-amber-200">{eyebrow}</p>
        <h1 className="relative mt-3 text-4xl font-bold text-white md:text-5xl">
          {title}
        </h1>
        <p className="relative mt-5 text-lg leading-8 text-white/68">{description}</p>
      </div>
    </section>
  )
}
