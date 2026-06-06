import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-white/50 focus:border-amber-200/70 focus:bg-slate-950/70 focus:ring-4 focus:ring-amber-200/10',
        className,
      )}
      {...props}
    />
  )
}
