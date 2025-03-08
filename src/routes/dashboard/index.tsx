'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ChangeEvent,
} from 'react';
import { toast } from 'sonner';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

import { AppSidebar, NavActions, ProfileForm } from '@/components';

import { useAccount, useS3, useUser } from '@/hooks';

import type { FormSchemaType } from '@/types';

function Dashboard() {
  const { profiles, setProfiles, setProfile, clearProfile, user } = useUser();
  const { account } = useAccount();
  const { buckets, saveBuckets, clearBuckets } = useS3();
  const [transition, setTransition] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = useCallback(
    (values: FormSchemaType & { id?: string }) => {
      console.log(values);
      setProfile(values);
      saveBuckets(account, buckets);
    },
    [setProfile, saveBuckets, account, buckets]
  );
  const onClear = useCallback(() => {
    clearProfile(account);
    clearBuckets(account, new Map());
    setTransition(false);
    timeoutRef.current = setTimeout(() => {
      setTransition(true);
    }, 500);
  }, [clearProfile, clearBuckets, setTransition, account]);
  const handleExport = useCallback(() => {
    const name = `profiles_${user?.name}_${Date.now()}.json`;
    const localData = JSON.stringify(profiles, null, 2);
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
  }, [profiles, user?.name]);
  const handleImport = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>('#upload-forms');
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
            setProfiles(parsedJson);
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
    [setProfiles]
  );

  useEffect(() => {
    if (typeof account !== 'undefined') {
      setTransition(false);
      timeoutRef.current = setTimeout(() => {
        setTransition(true);
      }, 500);
    }
    return () => {
      if (timeoutRef && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [account, setTransition]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 bg-white z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="ml-auto px-3">
            <NavActions
              handleExport={handleExport}
              handleImport={handleImport}
              handleUpload={handleUpload}
            />
          </div>
        </header>
        <ScrollArea className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {transition ? (
            <ProfileForm
              formState={profiles[account]}
              handleSubmit={onSubmit}
              handleClear={onClear}
            />
          ) : (
            <div className="w-full h-full">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="aspect-video rounded-xl bg-muted/50 mt-4" />
            </div>
          )}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Dashboard;
