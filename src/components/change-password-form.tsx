'use client';

import { useState, memo, type FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

import { Spinner } from './spinner';

interface ChangePasswordFormProps {
  form: UseFormReturn<{
    currentPassword: string;
    newPassword: string;
  }>;
  error: string | null;
  isloading: boolean;
}

const ChangePasswordFormComponent: FC<ChangePasswordFormProps> = ({
  form,
  error,
  isloading,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Change Password</CardTitle>
        <CardDescription>
          Enter your old and new password to change your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="flex flex-row">
                      <Input
                        type={show ? 'text' : 'password'}
                        autoComplete="current-password"
                        {...field}
                        value={field.value ?? ''}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShow((prev) => !prev)}
                      >
                        {show ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="flex flex-row">
                      <Input
                        type={show ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...field}
                        value={field.value ?? ''}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShow((prev) => !prev)}
                      >
                        {show ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <span className="text-red-500">{String(error)}</span>}
          <Button
            type="submit"
            className="w-full flex flex-row"
            disabled={isloading}
          >
            {isloading && <Spinner />}
            Change
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Have an account?{' '}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{' '}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </CardContent>
    </Card>
  );
};

export const ChangePasswordForm = memo(ChangePasswordFormComponent);
