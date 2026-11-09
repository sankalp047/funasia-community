import { Loader2 } from 'lucide-react'

export function FullPageSpinner() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream-100">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
    </div>
  )
}
