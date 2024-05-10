"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader, Loader2 } from 'lucide-react'


const page = () => {
  const [userName, setUserName] = useState("")
  const [userNameMessage, setUserNameMessage] = useState("")
  const [isCheckingUserName, setIsCheckingUserName] = useState(false)
  const [isSubmitting, setIsSubmmiting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const debounced = useDebounceCallback(setUserName, 500)

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    }
  })
  useEffect(() => {
    const checkUserNameUniqe = async () => {
      if (userName) {
        setIsCheckingUserName(true)
        setUserNameMessage("")

        try {
          const res = await axios.get(`/api/check-username-unique?userName=${userName}`)
          setUserNameMessage(res.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUserNameMessage(axiosError.response?.data.message || "error in checking user name.")
        } finally {
          setIsCheckingUserName(false)
        }
      }
    }
    checkUserNameUniqe()
  }, [userName])

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (data) => {
    console.log(data)
    try {
      setIsSubmmiting(true)
      const res = await axios.post<ApiResponse>("/api/sign-up", data)

      toast({
        title: "Success",
        description: res.data.message
      })
      router.replace(`/verify/${userName}`)
    } catch (error) {
      console.error("error in sign up", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errormessage = axiosError.response?.data.message
      toast({
        title: "Sigup Field",
        description: errormessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmmiting(false)
    }
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            poin Mystery Message
          </h1>
          <p className="mb-4"> sign up to start your anonymous
            adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UserName</FormLabel>
                  <FormControl>
                    <Input placeholder="user name"
                      {...field}
                      onChange={e => {
                        field.onChange(e);
                        debounced(e.target.value)
                      }} />
                  </FormControl>
                  {isCheckingUserName ? <Loader2 className="animate-spin" /> :
                    <p className={`text-sm ${userNameMessage === "user name is unique." ? "text-green-500" : "text-red-500"}`}>{userNameMessage}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> please wait</> : "SignUp"
              }
            </Button>
          </form>
          <div className="text-center mt-4">
            Alredy member?{" "}
            <Link href={'/sign-in'} className="text-blue-600 hover:text-blue-800">Sign in</Link>
          </div>
        </Form>
      </div>
    </div >
  );
};

export default page;
