/**
 * Kinetic ribbon: a slightly-rotated marquee band of repeating words —
 * with a second, counter-rotated band behind it for depth.
 */
export function Ribbon({
  items,
  className = '',
  angle = -2,
  backAngle = 1.6,
  back = true,
}) {
  const strip = [...items, ...items, ...items, ...items]
  return (
    <div className={`pointer-events-none relative z-20 -my-8 overflow-hidden py-10 ${className}`}>
      {back && (
        <div
          aria-hidden="true"
          className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rounded-sm bg-marigold-400 py-3.5 opacity-90"
          style={{ transform: `translateY(-50%) rotate(${backAngle}deg)` }}
        />
      )}
      <div
        className="relative inset-x-[-5%] w-[110%] rounded-sm bg-brand-600 py-3.5 shadow-soft"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className="animate-marquee flex w-max items-center gap-8 pr-8">
          {strip.map((item, i) => (
            <span key={i} className="flex shrink-0 items-center gap-8">
              <span className="font-display text-base italic tracking-wide text-cream-50 sm:text-lg">
                {item}
              </span>
              <span aria-hidden="true" className="text-marigold-300">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
