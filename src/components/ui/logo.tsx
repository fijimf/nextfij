"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  href?: string
  showText?: boolean
}

const sizeVariants = {
  sm: {
    container: "w-6 h-6",
    image: "w-6 h-6",
    text: "text-sm font-bold"
  },
  md: {
    container: "w-8 h-8", 
    image: "w-8 h-8",
    text: "text-xl font-bold"
  },
  lg: {
    container: "w-12 h-12",
    image: "w-12 h-12", 
    text: "text-3xl font-bold"
  }
}

export function Logo({ 
  size = "md", 
  href = "/", 
  showText = true, 
  className,
  ...props 
}: LogoProps) {
  const sizes = sizeVariants[size]
  
  const logoContent = (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div className={cn("relative transition-all hover:scale-105", sizes.container)}>
        <Image
          src="/deepfij.png"
          alt="DeepFij Logo"
          width={48}
          height={48}
          className={cn("object-contain", sizes.image)}
          priority
        />
      </div>
      {showText && (
        <span className={cn(
          "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
          sizes.text
        )}>
          DeepFij
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-80">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}