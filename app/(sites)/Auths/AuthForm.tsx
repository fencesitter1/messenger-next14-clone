'use client';

// import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import AuthSocialButton from '@/components/authSocialButton';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useEffect, useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import { useSession, signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
  const session = useSession();

  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('REGISTER');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      toast.success('authenticated');
      router.push('/users'); // Redirect to /users
    }
  }, [session?.status, router]);
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const formSchema = z.object({
    name: z.string().min(3, {
      message: 'Name must be at least 3 characters long',
    }),
    email: z.string().email({
      message: 'Invalid email',
    }),
    password: z.string().min(5, {
      message: 'Password must be at least 5 characters long',
    }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    console.log(variant);
    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      console.log(variant);

      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!');
          }

          if (callback?.ok && !callback?.error) {
            toast.success('Logged in!');
            router.push('/users');
          }
        })
        .finally(() => setIsLoading(false));
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!');

          // router.push('/users');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
      <div
        className="
          bg-white-100
          px-4
          py-4
          shadow-xl
          sm:rounded-lg
          sm:px-10
          
        "
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full mt-4 "
          >
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="form-message" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-base">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="form-message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-base">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="form-message" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="shad-button_bg-sky-500 "
            >
              {variant === 'REGISTER' ? 'Register' : 'Sign in'}
            </Button>
          </form>
        </Form>

        {/* 第三方账号登录 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className="
                  w-full 
                  border-t
                border-gray-300"
              />
            </div>
            <div
              className="
            relative 
            flex 
            justify-center
             text-sm
             "
            >
              <span
                className="
              bg-white 
              px-2 
              text-gray-500
              "
              >
                Or continue with
              </span>
            </div>
          </div>

          <div className=" mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        {/* 切换状态 */}
        <div
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500 
            "
        >
          <div>{variant === 'LOGIN' ? 'New to Messenger' : 'Already have an account?'}</div>
          <div
            onClick={toggleVariant}
            className="underline cursor-pointer"
          >
            {variant === 'LOGIN' ? 'Create an accout' : 'Login in'}
          </div>
        </div>
      </div>
    </div>
  );
}
