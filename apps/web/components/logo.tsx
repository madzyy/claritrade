import Image from "next/image"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"

type LogoProps = {
  variant?: "full" | "icon"
  /** `auto` switches with dark mode; `light`/`dark` force a specific wordmark */
  theme?: "auto" | "light" | "dark"
  width?: number
  height?: number
  className?: string
  href?: string
  priority?: boolean
}

export function Logo({
  variant = "full",
  theme = "auto",
  width,
  height,
  className,
  href = "/",
  priority = false,
}: LogoProps) {
  const content =
    variant === "icon" ? (
      <Image
        src="/logo-collapse.png"
        alt="ClariTrade"
        width={width ?? 40}
        height={height ?? 40}
        className={cn("object-contain", className)}
        priority={priority}
      />
    ) : theme === "light" ? (
      <Image
        src="/logo-light.png"
        alt="ClariTrade"
        width={width ?? 160}
        height={height ?? 48}
        className={cn("object-contain", className)}
        priority={priority}
      />
    ) : theme === "dark" ? (
      <Image
        src="/logo-dark.png"
        alt="ClariTrade"
        width={width ?? 160}
        height={height ?? 48}
        className={cn("object-contain", className)}
        priority={priority}
      />
    ) : (
      <span
        className={cn("relative inline-block shrink-0", className)}
        style={{ width: width ?? 160, height: height ?? 48 }}
      >
        <Image
          src="/logo-light.png"
          alt="ClariTrade"
          width={width ?? 160}
          height={height ?? 48}
          className="object-contain dark:hidden"
          priority={priority}
        />
        <Image
          src="/logo-dark.png"
          alt="ClariTrade"
          width={width ?? 160}
          height={height ?? 48}
          className="object-contain hidden dark:block"
          priority={priority}
        />
      </span>
    )

  if (!href) {
    return content
  }

  return (
    <Link href={href} className="inline-flex shrink-0">
      {content}
    </Link>
  )
}
