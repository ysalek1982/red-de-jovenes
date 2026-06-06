import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-black transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-amber-100 via-lime-100 to-emerald-200 text-slate-950 shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 hover:shadow-amber-500/30 focus-visible:outline-amber-200',
        secondary:
          'border border-amber-100/15 bg-white/[0.07] text-white shadow-lg shadow-black/10 backdrop-blur hover:-translate-y-0.5 hover:bg-white/[0.12] hover:text-amber-50 focus-visible:outline-amber-200',
        accent:
          'bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-200 text-slate-950 shadow-lg shadow-emerald-500/15 hover:-translate-y-0.5 focus-visible:outline-emerald-200',
        ghost:
          'text-white/70 hover:bg-white/[0.08] hover:text-white focus-visible:outline-amber-200',
        outline:
          'border border-white/20 bg-white/[0.03] text-white backdrop-blur hover:bg-white hover:text-slate-950 focus-visible:outline-white',
      },
      size: {
        sm: 'min-h-10 px-3 py-2',
        md: 'h-11 px-5',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)
