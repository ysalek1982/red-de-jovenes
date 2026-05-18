interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="bg-white py-14">
      <div className="section-shell max-w-4xl">
        <p className="text-sm font-semibold text-youth-700">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold text-brand-900 md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
      </div>
    </section>
  )
}
