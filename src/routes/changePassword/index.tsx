'use client';

import { type FC, memo, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { ChangePasswordForm } from '@/components';

import { useAuth } from '@/hooks';

const formSchema = z.object({
  currentPassword: z
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
  newPassword: z
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

const ChangePasswordComponent: FC = () => {
  const { status, error, isloading, handleDashboard, changepassword } =
    useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      await changepassword(values.currentPassword, values.newPassword);
    },
    [changepassword]
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
          <ChangePasswordForm form={form} error={error} isloading={isloading} />
        </form>
      </Form>
    </div>
  );
};

const ChangePassword = memo(ChangePasswordComponent);

export default ChangePassword;
