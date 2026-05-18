import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-700 text-white hover:bg-brand-800 focus-visible:outline-brand-700',
        secondary:
          'bg-white text-brand-800 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-brand-700',
        accent:
          'bg-youth-600 text-white hover:bg-youth-700 focus-visible:outline-youth-600',
        ghost:
          'text-slate-700 hover:bg-slate-100 hover:text-brand-800 focus-visible:outline-brand-700',
        outline:
          'border border-white/55 text-white hover:bg-white hover:text-brand-900 focus-visible:outline-white',
      },
      size: {
        sm: 'h-9 px-3',
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
