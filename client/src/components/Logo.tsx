interface LogoProps {
  height: number
  className?: string
  /** Leave empty when the logo sits next to the brewery name, so screen readers don't hear it twice. */
  alt?: string
}

/** The oval badge, cropped out of the full-page logo artwork. */
export function Logo({ height, className = '', alt = '' }: LogoProps) {
  return (
    <span className={`logo-crop ${className}`} style={{ height }}>
      <img src="/logo.webp" alt={alt} />
    </span>
  )
}
