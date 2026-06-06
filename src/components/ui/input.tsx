import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm font-medium text-white outline-none transition placeholder:text-white/50 focus:border-amber-200/70 focus:bg-slate-950/70 focus:ring-4 focus:ring-amber-200/10',
        className,
      )}
      {...props}
    />
  )
}
