'use client';

import { Fragment, useRef, useEffect, type FC } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './ui/context-menu';

import {
  generateRandomEmail,
  generateRandomPassword,
  normalizeText,
} from '@/lib';

interface MenuTitleProps {
  title: () => string;
}

const MenuTitle: FC<MenuTitleProps> = ({ title }) => {
  return (
    <ContextMenuItem inset>
      {title()}
      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
    </ContextMenuItem>
  );
};

interface MenuItemProps {
  title: () => string;
  handleClick: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ title, handleClick }) => {
  return (
    <ContextMenuItem onClick={handleClick} inset>
      {title()}
      <ContextMenuShortcut>⌘[</ContextMenuShortcut>
    </ContextMenuItem>
  );
};

interface MenuProps {
  title: string;
  event: Event;
  items: [string, unknown][];
}

export const Menu: FC<MenuProps> = ({ title, event, items }) => {
  const divRef = useRef<HTMLDivElement>(null);
  function handleTitle(title: string | object) {
    return normalizeText(
      typeof title === 'object'
        ? (title as { documentType: string }).documentType
        : title || ''
    );
  }
  function handleClick(value: string | object) {
    (event.target as HTMLInputElement).value =
      typeof value === 'object'
        ? (value as { documentType: string }).documentType
        : value || '';
  }
  useEffect(() => {
    if (divRef.current) {
      const rightClickEvent = new MouseEvent('contextmenu', {
        bubbles: true, // Ensures the event bubbles up through the DOM
        cancelable: true, // Allows the event to be canceled
        button: 2, // Specifies the right mouse button (0 = left, 1 = middle, 2 = right)
        buttons: 2, // Indicates that the right button is pressed
        clientX: window.innerWidth - 20, // Position relative to the viewport
        clientY: window.innerHeight - 10,
      });

      divRef.current?.dispatchEvent(rightClickEvent);
    }
  }, []);
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div ref={divRef} className="hidden"></div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <MenuTitle title={() => handleTitle(title)} />
        <MenuItem
          title={() => handleTitle('Random Email')}
          handleClick={() => handleClick(generateRandomEmail())}
        />
        <MenuItem
          title={() => handleTitle('Random Password')}
          handleClick={() => handleClick(generateRandomPassword())}
        />

        {items.map((item) => {
          return Array.isArray(item[1]) ? (
            <Fragment key={item[0]}>
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>
                  {handleTitle(item[0])}
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  {item[1].map((value) => (
                    <MenuItem
                      key={value}
                      title={() => handleTitle(value)}
                      handleClick={() => handleClick(value)}
                    />
                  ))}
                </ContextMenuSubContent>
              </ContextMenuSub>
            </Fragment>
          ) : typeof item[1] === 'object' ? (
            <Fragment key={item[0]}>
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>
                  {handleTitle(item[0])}
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  {Object.entries(item[1] as object).map((value) => (
                    <MenuItem
                      title={() => handleTitle(value[0])}
                      handleClick={() => handleClick(value[1] as string)}
                    />
                  ))}
                </ContextMenuSubContent>
              </ContextMenuSub>
            </Fragment>
          ) : (
            <Fragment key={item[0]}>
              <MenuItem
                title={() => handleTitle(item[0])}
                handleClick={() => handleClick(item[1] as string)}
              />
            </Fragment>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
};

interface RightClickMenuTitleProps {
  title: () => string;
}

const RightClickMenuTitle: FC<RightClickMenuTitleProps> = ({ title }) => {
  return <div className="pb-[10px] bg-[#f9f9f9] font-bold">{title()}</div>;
};

interface RightClickMenuItemProps {
  title: () => string;
  handleClick: () => void;
}

const RightClickMenuItem: FC<RightClickMenuItemProps> = ({
  title,
  handleClick,
}) => {
  return (
    <div
      className="mt-[10px] p-[5px_0] border-t border-solid border-t-gray-400 cursor-pointer font-semibold"
      onClick={handleClick}
    >
      {title()}
    </div>
  );
};

interface RightClickMenuSubItemProps {
  title: () => string;
  handleClick: () => void;
}

const RightClickMenuSubItem: FC<RightClickMenuSubItemProps> = ({
  title,
  handleClick,
}) => {
  return (
    <div
      className="p-[5px_0_0_10px] border-t border-solid border-t-gray-400 cursor-pointer"
      onClick={handleClick}
    >
      {`> ${title()}`}
    </div>
  );
};

interface RightClickMenuProps {
  title: string;
  event: Event;
  items: [string, unknown][];
}

export const RightClickMenu: FC<RightClickMenuProps> = ({
  title,
  event,
  items,
}) => {
  function handleTitle(title: string | object) {
    return normalizeText(
      typeof title === 'object'
        ? (title as { documentType: string }).documentType
        : title || ''
    );
  }
  function handleClick(value: string | object) {
    (event.target as HTMLInputElement).value =
      typeof value === 'object'
        ? (value as { documentType: string }).documentType
        : value || '';
  }
  return (
    <div className="fixed float-right bottom-[10px] right-[10px] bg-white border border-solid border-[#ccc] p-[15px] cursor-pointer z-[9999] rounded-[5px] max-h-[200px] overflow-y-scroll shadow-[0_0_10px_rgba(0,0,0,0.1)]">
      <RightClickMenuTitle title={() => handleTitle(title)} />
      <RightClickMenuItem
        title={() => handleTitle('Random Email')}
        handleClick={() => handleClick(generateRandomEmail())}
      />
      <RightClickMenuItem
        title={() => handleTitle('Random Password')}
        handleClick={() => handleClick(generateRandomPassword())}
      />
      {items.map((item) => {
        return Array.isArray(item[1]) ? (
          <Fragment key={item[0]}>
            <RightClickMenuItem
              title={() => handleTitle(item[0])}
              handleClick={() => {}}
            />{' '}
            {item[1].map((value) => (
              <RightClickMenuSubItem
                key={value}
                title={() => handleTitle(value)}
                handleClick={() => handleClick(value)}
              />
            ))}
          </Fragment>
        ) : typeof item[1] === 'object' ? (
          <Fragment key={item[0]}>
            <RightClickMenuItem
              title={() => handleTitle(item[0])}
              handleClick={() => {}}
            />{' '}
            {Object.entries(item[1] as object).map((value) => (
              <RightClickMenuSubItem
                title={() => handleTitle(value[0])}
                handleClick={() => handleClick(value[1] as string)}
              />
            ))}
          </Fragment>
        ) : (
          <Fragment key={item[0]}>
            <RightClickMenuItem
              title={() => handleTitle(item[0])}
              handleClick={() => handleClick(item[1] as string)}
            />
          </Fragment>
        );
      })}
    </div>
  );
};
