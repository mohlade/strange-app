import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { SigninValidation } from "@/lib/validation"
import Loader from "@/components/ui/shared/Loader"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SigninForm = () => {
    const { toast } = useToast()
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const navigate = useNavigate();

    const { mutateAsync: signInAccount } = useSignInAccount();
    // 1. Define your form.
    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SigninValidation>) {
        const session = await signInAccount({
            email: values.email,
            password: values.password,
        })
        if (!session) {
            return toast({ title: 'Sign in failed. Please try again2', })
        }
        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
            form.reset();
            navigate('/')
        } else { toast({ title: 'Sign up failed. Please try again' }) }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img className="object-contain h-16 w-96" src="/assets/images/camera.svg" alt="logo" />
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-6" >Login to your account</h2>
                <p className="text-light-4 small-medium md:base-regular mt-2">Welcome Back! Please enter your details</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isUserLoading ? (
                            <div className="flex-center gap-2">
                                <Loader />Loading...
                            </div>
                        ) : "Sign In"}
                    </Button>
                    <p className="text-small-regular text-light-4 text-center mt-2">
                        Don't have an account?
                        <Link to="/sign-up" className="text-primary-600 text-small-semibold  m1-1">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SigninForm