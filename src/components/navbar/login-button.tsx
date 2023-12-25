"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import React, { Dispatch, SetStateAction } from "react"

import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import UserAvatar from "./user-avatar"

interface IMenu {
  name: string
  href: string
  separator: boolean
  shortcut?: string
}
const menu: IMenu[] = [
  { name: "Profile", href: "/profile", separator: false, shortcut: "⇧⌘P" },
  { name: "Settings", href: "/settings", separator: false, shortcut: "⇧⌘S" },
  { name: "Log out", href: "/auth/logout", separator: true },
]

export default function LoginButton({
  setOpenSheet,
}: {
  setOpenSheet?: Dispatch<SetStateAction<boolean>>
}) {
  const router = useRouter()
  const pathname = usePathname()

  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <>
        <div className="hidden lg:flex lg:gap-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Signed in as</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {menu.map((item, index) => (
                <React.Fragment key={index}>
                  {item.separator && (
                    <DropdownMenuSeparator key={`menu_dropdown_separator_${index}`} />
                  )}
                  <DropdownMenuItem
                    key={`menu_dropdown_${index}`}
                    onClick={() => router.push(item.href)}
                    className={cn(pathname === item.href && "bg-muted")}
                  >
                    {item.name}
                    {item.shortcut && (
                      <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex lg:hidden">
          <div className="flex flex-grow flex-col">
            <UserAvatar />
            <div className="space-y-2 py-2">
              {menu.map((item, index) => (
                <Link
                  key={`menu_user_${index}`}
                  href={item.href}
                  onClick={() => setOpenSheet?.(false)}
                  className={cn(
                    "-mx-3 block px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname != item.href && "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex space-x-1">
      <Button asChild variant="outline" size="default">
        <Link href="/auth/login">Log in</Link>
      </Button>
      <Button asChild variant="default" size="default">
        <Link href="/auth/register">Sign up</Link>
      </Button>
    </div>
  )
}
