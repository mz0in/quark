"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"

import { deletePermission } from "@/actions/permissions/delete"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Permission } from "@prisma/client"
import { Loader2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function DeletePermissionModal({
  permission,
}: {
  permission: Permission
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const formSchema = z.object({
    confirmString: z.literal(permission.key, {
      errorMap: () => ({ message: "Incorrect permission key" }),
    }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    defaultValues: { confirmString: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    await deletePermission(permission)
    toast.success("Permission deleted successfully!", { duration: 4000 })
    router.push("/admin/permissions")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="ml-2">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">delete permission</span>
          <span className="ml-2 hidden md:block">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete permission</DialogTitle>
          <DialogDescription>
            This action is permanent and could result in users losing access to your
            application.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col items-start space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col space-y-4"
            >
              <FormField
                control={form.control}
                name="confirmString"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Enter the permission key <b>{permission.key}</b> to continue.
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        disabled={form.formState.isSubmitting}
                        autoComplete="no"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false)
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={form.formState.isSubmitting || !form.formState.isDirty}
                  type="submit"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete permission
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
