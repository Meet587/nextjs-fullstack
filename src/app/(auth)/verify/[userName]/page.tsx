"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from "zod"

const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{ userName: string }>()
    const { toast } = useToast()

    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async (data) => {
        try {
            const res = await axios.post<ApiResponse>(`api/verify-code`, {
                userName: param.userName,
                code: data.code
            })

            toast({
                title: "Success",
                description: res.data.message
            })
            router.replace('/sign-in')

        } catch (error) {
            console.error("error in verify code", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errormessage = axiosError.response?.data.message
            toast({
                title: "verify Field",
                description: errormessage,
                variant: "destructive"
            })
        }
    }

    return (
        <div className='flex items-center justify-center bg-gray-100 min-h-screen'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6">
                        Verify Your Account
                    </h2>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Verification Code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit"> Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div >
    )
}

export default VerifyAccount