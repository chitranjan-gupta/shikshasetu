'use client';

import { useMemo, useEffect, type FC } from 'react';
import { EllipsisVertical, LogIn, LogOut } from 'lucide-react';
import { observer } from '@legendapp/state/react';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatars, Profile, Emails } from '@/components';

import {
  fetchFromLocal,
  saveToLocal,
  browserStorage,
  isChrome,
  isBrowser,
} from '@/lib';
import { useUser, useAccount, useAuth } from '@/hooks';

import type { Data } from '@/types';

const ProfilesComponent: FC = () => {
  const { status, isloading, handleLogout } = useAuth();
  const { user, profiles } = useUser();
  const { account } = useAccount();
  const data: Data[] = useMemo(() => {
    const datarow = profiles.length > 0 ? profiles[account] : {};
    const modArray = Object.entries(datarow || {}).map((value) => {
      if (typeof value[1] === 'object' && !Array.isArray(value[1])) {
        return [
          value[0],
          Object.entries(value[1] ?? {}) as unknown as
            | string
            | number
            | boolean
            | { currency: string; salary: number; salary_period: string }
            | { country_code: string; phone_number: string }
            | string[],
        ];
      } else if (
        Array.isArray(value[1]) &&
        typeof value[1][0] === 'object' &&
        !Array.isArray(value[1][0])
      ) {
        return value[1].map((val: any) => [
          val['attribute_name'],
          val['value'],
        ]);
      } else {
        return value as [
          string,
          (
            | string
            | number
            | boolean
            | string[]
            | { currency: string; salary: number; salary_period: string }
            | { country_code: string; phone_number: string }
            | { currency: string; salary: number; salary_period: string }
            | {
                [key: string]:
                  | string
                  | number
                  | boolean
                  | { currency: string; salary: number; salary_period: string }
                  | { country_code: string; phone_number: string }
                  | string[];
              }
          ),
        ];
      }
    });
    const mergedArray: any[] = [];
    modArray.forEach((item) => {
      if (Array.isArray(item[0])) {
        item.forEach((val) => mergedArray.push(val));
      } else {
        mergedArray.push(item);
      }
    });
    return mergedArray;
  }, [profiles, account]);
  useEffect(() => {
    if (isChrome && !isBrowser) {
      console.log('chrome', 'yes');
      (async () => {
        if (browserStorage) {
          const details = await fetchFromLocal(['currentAutofill']);
          if (details && profiles.length > 0) {
            await saveToLocal({ currentAutofill: profiles[account] });
          }
        }
      })();
    } else {
      console.log('firefox', 'yes');
      if (browserStorage) {
        browserStorage.local.get(['currentAutofill'], (details: any) => {
          console.log('details', details);
          if (details && profiles.length > 0) {
            browserStorage.local.set(
              { currentAutofill: profiles[account] },
              () => {
                console.log('currentAutofill is set for initial');
              }
            );
          }
        });
      }
    }
  }, [account, profiles]);
  return (
    <div className="w-full h-full p-5">
      <div className="w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-2">
            <div>
              <Avatars url={user?.avatar || ''} />
            </div>
            <div className="flex flex-col items-start">
              <span>{user?.name || ''}</span>
              <span>{user?.email || ''}</span>
            </div>
          </div>
          <div className="ml-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  {status === 'signIn' ? 'My Account' : 'Log In Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {status === 'signIn' && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Billing
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Keyboard shortcuts
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Invite users
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem>Email</DropdownMenuItem>
                            <DropdownMenuItem>Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>More...</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem>
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuItem disabled>API</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout} disabled={isloading}>
                  {status === 'signIn' ? (
                    <>
                      <LogOut />
                      Log out
                    </>
                  ) : (
                    <>
                      <LogIn /> Log In
                    </>
                  )}
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <Separator />
        </div>
      </div>
      <div>
        <Tabs defaultValue="profile" className="w-[400px]">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Profile data={data} />
          </TabsContent>
          <TabsContent value="emails">
            <Emails />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Profiles = observer(ProfilesComponent);

export default Profiles;
