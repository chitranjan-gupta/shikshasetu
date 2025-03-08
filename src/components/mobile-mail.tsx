'use client';

import { useState, memo, useCallback, type FC } from 'react';
import { Search } from 'lucide-react';

import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TooltipProvider } from './ui/tooltip';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent } from './ui/collapsible';

import { AccountSwitcher } from './account-switcher';
import { MailDisplay } from './mail-display';
import { MailList } from './mail-list';
import { DomainSwitcher } from './domain-switcher';

import type { MailProps } from '@/types';

const MailComponent: FC<MailProps> = ({
  accounts,
  mails,
  domains,
  sendCommand,
}) => {
  const [isListOpen, setIsListOpen] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentMail, setCurrentMail] = useState(mails[0]);
  const handleClick = useCallback(
    (mail: (typeof mails)[0]) => {
      setIsListOpen(false);
      setIsViewOpen(true);
      setCurrentMail(mail);
    },
    [setIsListOpen, setIsViewOpen, setCurrentMail]
  );
  const handleBack = useCallback(() => {
    setIsListOpen(true);
    setIsViewOpen(false);
    setCurrentMail(mails[0]);
  }, [setIsListOpen, setIsViewOpen, setCurrentMail, mails]);
  const handleCommand = useCallback(
    (action: string) => {
      if (sendCommand) {
        sendCommand(action, []);
      }
    },
    [sendCommand]
  );
  return (
    <TooltipProvider delayDuration={0}>
      <Collapsible
        open={isListOpen}
        onOpenChange={setIsListOpen}
        className="h-full max-h-[800px] items-stretch"
      >
        <CollapsibleContent>
          <div className={'flex h-[52px] items-center justify-center'}>
            <DomainSwitcher isCollapsed={false} domains={domains} />
          </div>

          <div
            className={'flex flex-col items-start justify-start gap-y-2 mb-2'}
          >
            <AccountSwitcher isCollapsed={false} accounts={accounts} />
            <Button onClick={() => handleCommand('addAccount')}>
              Generate Account
            </Button>
            <Button onClick={() => handleCommand('fetchMessages')}>
              Reload Messages
            </Button>
          </div>

          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form onSubmit={(event) => event.preventDefault()}>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={mails} handleClick={handleClick} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList
                items={mails.filter((item) => !item.seen)}
                handleClick={handleClick}
              />
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        className="h-full max-h-[800px] items-stretch"
      >
        <CollapsibleContent>
          <MailDisplay mail={currentMail} handleClick={handleBack} />
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
};

export const Mail = memo(MailComponent);
