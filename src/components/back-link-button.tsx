import Link from "next/link"

import React from "react"

import { ArrowLeft } from "lucide-react"

import { Button } from "./ui/button"

export default function BackLinkButton({ link }: { link: string }) {
  return (
    <Button size="sm" variant="link" className="mt-1 p-0 text-muted-foreground" asChild>
      <Link href={link}>
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back</span>
      </Link>
    </Button>
  )
}
