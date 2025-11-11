"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signin, signup } from "../lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(5),
  })
}

const AuthForm = ({type}: {type: FormType}) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);

  //1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  //2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if(type === "sign-up") {
        const { name, email, password } = values;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signup({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in to continue.");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        if(!idToken) {
          toast.error("Sign in failed.=");
          return;
        }

        await signin({
          email, idToken
        })

        toast.success("Signed in successfully.")
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image 
            src="/logo.svg" 
            alt="AI MOCK INTERVIEW" 
            width={32} 
            height={38} 
            priority
          className="w-8 h-10" 
          />
          <h2 className="text-primary-100">AI MOCK INTERVIEW</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="W-full space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField 
                control={form.control} 
                name="name" 
                label="Name" 
                placeholder="your name" 
                type="text" />
            )}
            
            <FormField 
                control={form.control} 
                name="email" 
                label="Email" 
                placeholder="your email address" 
                type="email" />
            
            <FormField 
                control={form.control} 
                name="password" 
                label="Password" 
                placeholder="enter your password" 
                type="password" />
            
            <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? 'No Account Yet?' : 'Already have an account?'}
          <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm