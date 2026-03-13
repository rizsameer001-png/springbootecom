export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} rounded-full border-gray-200 border-t-zulu-500 animate-spin`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  )
}
