'use client';

import { Fragment, useMemo, useCallback, type FC } from 'react';

import {
  generateRandomEmail,
  generateRandomPassword,
  normalizeText,
  setAllInputFields,
  getAllInputFields,
} from '@/lib';

interface RightClickMenuTitleProps {
  title: () => string;
  handleClick: (ce: any) => void;
}

const RightClickMenuTitle: FC<RightClickMenuTitleProps> = ({
  title,
  handleClick,
}) => {
  return (
    <div
      className="pb-[10px] bg-blue-300 text-white font-bold"
      onClick={handleClick}
    >
      {title()}
    </div>
  );
};

interface RightClickMenuItemProps {
  title: () => string;
  handleClick: (ce?: any) => void;
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
  handleClick: (ce?: any) => void;
  parent?: string;
}

const RightClickMenuSubItem: FC<RightClickMenuSubItemProps> = ({
  title,
  handleClick,
  parent,
}) => {
  return (
    <div
      className="p-[5px_0_0_10px] border-t border-solid border-t-gray-400 cursor-pointer"
      onClick={handleClick}
      data-parent={parent}
    >
      {`> ${title()}`}
    </div>
  );
};

interface RightClickMenuProps {
  title: string;
  event: Event;
  items: [string, unknown][];
  document_files: Map<string, object>;
}

export const RightClickMenu: FC<RightClickMenuProps> = ({
  title,
  event,
  items,
  document_files,
}) => {
  const handleTitle = useCallback((title: string | object) => {
    return normalizeText(
      typeof title === 'object'
        ? (title as { document_type: string }).document_type
        : title || ''
    );
  }, []);
  const handleClick = useCallback(
    (value: string | object, clickEvent?: any) => {
      const target = event.target as HTMLInputElement;
      console.log('clickEvent', clickEvent);
      if (
        clickEvent &&
        clickEvent.target &&
        clickEvent.target.dataset &&
        clickEvent.target.dataset.parent &&
        clickEvent.target.dataset.parent === 'sites'
      ) {
        setAllInputFields(value);
      } else if (target && target.type === 'file') {
        console.log(document_files);
        const file_ = document_files.get(
          (value as unknown as { url: string }).url
        ) as unknown as File;
        console.log(file_);
        // if (file_) {
        //   target.files = [file_] as unknown as FileList;
        // }
      } else {
        target.value = String(value) || '';
      }
    },
    [document_files, event.target]
  );
  const data: any[] = useMemo(() => {
    const datarow = items.map((item) =>
      Array.isArray(item[1]) &&
      typeof item[1][0] === 'object' &&
      !Array.isArray(item[1][0]) &&
      item[0] === 'custom_fields'
        ? item[1].map((val) => [val['attribute_name'], val['value']])
        : item
    );
    const mergedArray: any[] = [];
    datarow.forEach((item) => {
      if (Array.isArray(item[0])) {
        item.forEach((val) => mergedArray.push(val));
      } else {
        mergedArray.push(item);
      }
    });
    return mergedArray;
  }, [items]);
  return (
    <div className="fixed float-right bottom-[10px] right-[10px] bg-white border border-solid border-[#ccc] p-[15px] cursor-pointer z-[9999] rounded-[5px] max-h-[200px] overflow-y-scroll shadow-[0_0_10px_rgba(0,0,0,0.1)]">
      <RightClickMenuTitle
        title={() => handleTitle(title)}
        handleClick={() => getAllInputFields(Object.fromEntries(items))}
      />
      <RightClickMenuItem
        title={() => handleTitle('Random Email')}
        handleClick={() => handleClick(generateRandomEmail())}
      />
      <RightClickMenuItem
        title={() => handleTitle('Random Password')}
        handleClick={() => handleClick(generateRandomPassword())}
      />
      {data.map((item) => {
        return Array.isArray(item[1]) ? (
          <Fragment key={item[0]}>
            <RightClickMenuItem
              title={() => handleTitle(item[0])}
              handleClick={() => {}}
            />
            {item[1].map((value) => (
              <RightClickMenuSubItem
                key={value}
                title={() => handleTitle(value)}
                handleClick={(ce: any) => handleClick(value, ce)}
                parent={String(item[0])}
              />
            ))}
          </Fragment>
        ) : typeof item[1] === 'object' ? (
          <Fragment key={item[0]}>
            <RightClickMenuItem
              title={() => handleTitle(item[0])}
              handleClick={() => {}}
            />
            {Object.entries(item[1] as object).map((value) => (
              <RightClickMenuSubItem
                title={() => handleTitle(value[0])}
                handleClick={(ce: any) => handleClick(value[1] as string, ce)}
                parent={String(item[0])}
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
