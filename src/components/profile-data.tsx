'use client';

import { useCallback, useState, Fragment, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pencil,
  PaintBucket,
  Copy,
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Sparkles,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

import { columns } from './columns';
import { DataTable } from './data-table';
import { ProfileSwitcher } from './profile-switcher';

import {
  generateRandomEmail,
  generateRandomPassword,
  generateRandomString,
  handleCopy,
  sendToContent,
} from '@/lib';
import { useUser, useAuth, useAccount } from '@/hooks';

import type { Data } from '@/types';

const random_values = ['password', 'email', 'username'];

interface ProfileProps {
  data: Data[];
}

export const Profile: FC<ProfileProps> = ({ data }) => {
  const navigate = useNavigate();
  const [str, setStr] = useState<string>(generateRandomPassword());
  const [opt, setOpt] = useState<string>('password');
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const { handleDashboard } = useAuth();
  const { profiles } = useUser();
  const { account } = useAccount();
  const sendCommand = useCallback(
    (action: string) => {
      sendToContent(action, profiles[account]);
    },
    [profiles, account]
  );
  const handleGenerate = useCallback(() => {
    let tempStr = generateRandomPassword();
    switch (opt) {
      case 'email': {
        tempStr = generateRandomEmail();
        break;
      }
      case 'username': {
        tempStr = generateRandomString(10);
        break;
      }
      case 'password':
      default: {
        tempStr = generateRandomPassword();
        break;
      }
    }
    setStr(tempStr);
  }, [setStr, opt]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          To Make changes to your account. Click on edit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            <ProfileSwitcher />
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            <Button type="button" onClick={handleDashboard}>
              <Pencil /> Edit
            </Button>
            <Button type="button" onClick={() => navigate('/ai')}>
              <Sparkles /> AI
            </Button>
            <Button type="button" onClick={() => sendCommand('fill')}>
              <PaintBucket /> AutoFill
            </Button>
            <Button type="button" onClick={() => sendCommand('sitefill')}>
              <PaintBucket /> Site AutoFill
            </Button>
          </div>
          <div className="w-full max-w-sm pt-2">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex flex-row p-1 gap-x-2">
                    <div className="flex-1 text-center text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {`Random ${opt}`}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Random Values
                  </DropdownMenuLabel>
                  {random_values.map((random_value, index) => (
                    <Fragment key={random_value}>
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setOpt(random_value)}
                        className="gap-2 p-2"
                      >
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                          <GalleryVerticalEnd className="size-4 shrink-0" />
                        </div>
                        {`Random ${random_value}`}
                        <DropdownMenuShortcut>
                          ⌘{index + 1}
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center pt-2">
              <Button
                className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white border rounded-s-lg"
                type="button"
                onClick={handleGenerate}
              >
                Generate
              </Button>
              <div className="relative w-full">
                <Input
                  type="text"
                  aria-describedby="generated-text"
                  className="bg-gray-50 border border-e-0 border-gray-300 text-gray-500 dark:text-gray-400 text-sm border-s-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={str}
                  readOnly
                  disabled
                />
              </div>
              <Button
                className="shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:hover:text-white dark:border-gray-600"
                type="button"
                onClick={async () => {
                  setCopyStatus(await handleCopy(str));
                  setTimeout(() => {
                    setCopyStatus(false);
                  }, 300);
                }}
              >
                {copyStatus ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
