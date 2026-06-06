import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/[0.07] text-white/75',
        brand: 'border-amber-100/20 bg-amber-200/10 text-amber-100',
        youth: 'border-emerald-200/20 bg-emerald-300/10 text-emerald-100',
        coral: 'border-rose-200/20 bg-rose-300/10 text-rose-100',
        success: 'border-emerald-200/25 bg-emerald-300/12 text-emerald-100',
        warning: 'border-amber-200/25 bg-amber-300/12 text-amber-100',
        muted: 'border-white/10 bg-white/[0.045] text-white/55',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
