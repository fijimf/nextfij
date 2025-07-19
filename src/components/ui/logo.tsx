"use client"

import * as React from "react"
import Link from "next/link"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  href?: string
  showText?: boolean
}

const sizeVariants = {
  sm: {
    container: "w-6 h-6",
    icon: "w-4 h-4",
    text: "text-sm font-bold"
  },
  md: {
    container: "w-8 h-8", 
    icon: "w-5 h-5",
    text: "text-xl font-bold"
  },
  lg: {
    container: "w-12 h-12",
    icon: "w-8 h-8", 
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
      <div className={cn(
        "relative rounded-full bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-md transition-all hover:shadow-lg hover:scale-105",
        sizes.container
      )}>
        <div className="relative">
          <Circle className={cn("text-white fill-current", sizes.icon)} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-full bg-white/30 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-90">
            <div className="w-0.5 h-full bg-white/30 rounded-full"></div>
          </div>
        </div>
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