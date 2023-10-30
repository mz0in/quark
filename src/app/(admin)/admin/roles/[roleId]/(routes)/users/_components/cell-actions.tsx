import { useRouter } from "next/navigation"

import React, { useState } from "react"

import { removeUser } from "@/actions/roles/remove-user"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IColumns } from "./columns"

export default function CellActions({ row }: { row: IColumns }) {
  const router = useRouter()

  const [open, setIsOpen] = useState(false)

  const { roleId, userId } = row!
  const email = row?.user.email

  function handleConfirmation() {
    removeUser({ roleId, userId })
    setIsOpen(false)
    router.push(`/admin/roles/${roleId}/users`)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(String(userId))}
          >
            Copy user ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/admin/user/${userId}`)}>
            View user
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Remove user</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove user</DialogTitle>
          <DialogDescription>
            Are you sure to remove this user: <span className="font-bold">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setIsOpen(false)
            }}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={() => handleConfirmation()}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
