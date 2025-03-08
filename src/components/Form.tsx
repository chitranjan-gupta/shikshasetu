'use client';

import {
  Fragment,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FC,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AlertCircle, RefreshCcwDot } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Form } from './ui/form';

import { PickupInput } from './pickup-input';
import { renderInput } from './render-input';

import { normalizeText, FormValues } from '@/lib';
import { FormSchema } from '@/constants';

import type { FormSchemaType } from '@/types';

interface ProfileFormProps {
  formState: FormSchemaType & { id?: string };
  handleSubmit: (values: FormSchemaType & { id?: string }) => void;
  handleClear: () => void;
}

export const ProfileForm: FC<ProfileFormProps> = ({
  formState,
  handleSubmit,
  handleClear,
}) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const formError = form.formState.errors;
  const onSubmit = useCallback(
    (values: FormSchemaType) => {
      if (formState?.id) {
        if ((formState as any)?.sites) {
          handleSubmit({
            id: formState.id,
            sites: (formState as any).sites,
            ...values,
          } as any);
        } else {
          handleSubmit({ id: formState.id, ...values });
        }
      } else {
        handleSubmit(values);
      }
    },
    [handleSubmit, formState]
  );

  const handleExport = useCallback(() => {
    console.log('formState', formState);
    if (!formState || !formState.email) {
      toast('Email is not found', {
        description: new Date().toString(),
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
      return;
    }
    const name = `profile_${formState.email}_${Date.now()}.json`;
    const localData = JSON.stringify(formState, null, 2);
    console.log('localData', localData);
    const file = new File([localData], name, {
      type: 'application/json',
    });
    const a = document.querySelector<HTMLAnchorElement>('#download-form');
    if (a && file) {
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [formState]);

  const handleImport = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>('#upload-form');
    if (input) {
      input.click();
    }
  }, []);

  const handleUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) {
        return;
      }
      const file = files.length > 0 ? files[0] : null;
      const filereader = new FileReader();
      filereader.addEventListener(
        'load',
        () => {
          try {
            const parsedJson = JSON.parse(String(filereader.result));
            const parsedObject = new Object(parsedJson);
            FormSchema.parse(parsedObject);
            handleSubmit(parsedObject);
          } catch (err) {
            console.log(err);
            toast('Not a valid file', {
              description: new Date().toString(),
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo'),
              },
            });
          }
        },
        false
      );

      if (file && file.type === 'application/json') {
        filereader.readAsText(file);
      }
    },
    [handleSubmit]
  );

  useEffect(() => {
    if (formState) {
      form.reset(formState);
    }
  }, [formState, form]);

  return (
    <div>
      {Object.keys(formError).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {Object.entries(formError).map(([key, error], index) => (
              <p key={index}>{`${normalizeText(key)}: ${error.message}`}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-4 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900">
              Applicant Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
              Personal details and application.
            </p>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <div className="divide-y divide-gray-100">
              {FormValues.map((property, index) => (
                <Fragment key={index}>
                  {property.value === 'custom_fields' ? (
                    <PickupInput form={form} />
                  ) : (
                    <Fragment>{renderInput(form, property)}</Fragment>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
            </div>
            {/*            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Notifications
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                We'll always let you know about important changes, but you pick
                what else you want to hear about.
              </p>

              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm/6 font-semibold text-gray-900">
                    By Email
                  </legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm/6">
                        <label
                          htmlFor="comments"
                          className="font-medium text-gray-900"
                        >
                          Comments
                        </label>
                        <p className="text-gray-500">
                          Get notified when someones posts a comment on a
                          posting.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm/6">
                        <label
                          htmlFor="candidates"
                          className="font-medium text-gray-900"
                        >
                          Candidates
                        </label>
                        <p className="text-gray-500">
                          Get notified when a candidate applies for a job.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="offers"
                          name="offers"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm/6">
                        <label
                          htmlFor="offers"
                          className="font-medium text-gray-900"
                        >
                          Offers
                        </label>
                        <p className="text-gray-500">
                          Get notified when a candidate accepts or rejects an
                          offer.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm/6 font-semibold text-gray-900">
                    Push Notifications
                  </legend>
                  <p className="mt-1 text-sm/6 text-gray-600">
                    These are delivered via SMS to your mobile phone.
                  </p>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-everything"
                        name="push-notifications"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="push-everything"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Everything
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-email"
                        name="push-notifications"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="push-email"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Same as email
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-nothing"
                        name="push-notifications"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="push-nothing"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        No push notifications
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
*/}{' '}
          </div>
          <div className="flex flex-row gap-x-2 py-1">
            <Button type="submit">Submit</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button">Clear</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClear}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <a id="download-form" className="sr-only"></a>
            <input
              id="upload-form"
              type="file"
              className="sr-only"
              onChange={handleUpload}
            />
            <Button type="button" onClick={handleImport}>
              Import
            </Button>
            <Button type="button" onClick={handleExport}>
              Export
            </Button>
          </div>
          <div className="inline-block fixed bottom-20 right-5">
            <Button title="refresh" type="button" className="rounded-full">
              <RefreshCcwDot className="w-6 h-6" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
