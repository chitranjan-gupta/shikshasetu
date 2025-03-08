'use client';

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';

import { RegisterForm } from '@/components';

import { useUser, useAuth, useToast } from '@/hooks';

const formSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email({
    message: 'Email is not valid.',
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, {
      message: 'Password must contain at least one special character',
    }),
});

function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, error, isloading } = useUser();
  const { status, handleDashboard, oauth } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const status = await setUser(values);
      if (status) {
        toast({
          title: 'Successfully Registered',
          description: new Date().toString(),
          action: (
            <ToastAction
              altText="navigate"
              onClick={() => {
                navigate('/login');
              }}
            >
              Login
            </ToastAction>
          ),
        });
      }
    },
    [setUser, navigate, toast]
  );

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          role="form"
        >
          {status === 'signIn' && (
            <Button type="button" variant="outline" onClick={handleDashboard}>
              <ArrowLeft /> Go to Dashboard
            </Button>
          )}
          <RegisterForm
            form={form}
            error={error}
            isloading={isloading}
            oauth={oauth}
          />
        </form>
      </Form>
    </div>
  );
}

export default Register;
