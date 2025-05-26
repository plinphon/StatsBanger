// src/components/ui/card.tsx
import React, { ReactNode } from "react"

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border p-4 shadow-sm bg-white">{children}</div>
  )
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="mt-2">{children}</div>
}
