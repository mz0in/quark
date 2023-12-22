"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import AuthTemplate from "@/components/auth/auth-template"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(60, "Password must not exceed 60 characters"),
    confirmPassword: z.string({ required_error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

export default function ResetPasswordTokenPage({
  params,
}: {
  params: { token: string }
}) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const resp = await axios
      .post(`/api/auth/reset-password/${params.token}`, data)
      .then(() => {
        toast.success("Password updated")
        router.push("/auth/login")
      })
      .catch((error) => {
        if (error.response.status == 401) {
          router.push("/auth/reset-password")
          toast.error(error.response.data.message)
        } else {
          toast.error("Something went wrong")
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <AuthTemplate>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        Reset your password
      </h1>
      <div className="my-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      disabled={isLoading}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      disabled={isLoading}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <Button
                variant="default"
                size="sm"
                className="w-full"
                disabled={isLoading}
                type="submit"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change password
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/reset-password">Back</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AuthTemplate>
  )
}
