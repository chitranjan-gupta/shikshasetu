'use client';

import {
  useState,
  useRef,
  useEffect,
  type ComponentType,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import { toast } from 'sonner';

import { useS3, useAccount } from '@/hooks';

import type { ImageInputProps } from '@/types';

const createDownloadLink = (file: File, a: HTMLAnchorElement) => {
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
};

const regex = /https?:\/\//;

export const withHiddenInput = <P extends ImageInputProps>(
  View: ComponentType<P>
) => {
  return function HiddenInput(props: P) {
    const [files, setFiles] = useState<FileList>([] as unknown as FileList);
    const [url, setUrl] = useState<string>('');
    const [rawData, setRawData] = useState<string | null>(null);
    const { account } = useAccount();
    const { buckets, addBucket, fetchBucket } = useS3();
    const inputRef = useRef<HTMLInputElement>(null);
    const anchorRef = useRef<HTMLAnchorElement>(null);
    function handleUpload(
      event: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>
    ) {
      event.stopPropagation();
      event.preventDefault();
      const files_ =
        (event as DragEvent<HTMLDivElement>)?.dataTransfer?.files ||
        (event as ChangeEvent<HTMLInputElement>)?.target?.files;
      if (files_) {
        setFiles(files_);
        const file = files_.length > 0 ? files_[0] : null;
        if (file && file.type.indexOf('image') !== -1) {
          const genUrl = `indexeddb://${file.name}`;
          addBucket(props.property.value, {
            name: props.property.value,
            value: genUrl,
            file: file,
          });
          setUrl(genUrl);
        } else {
          toast('Not a valid image', {
            description: new Date().toString(),
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          });
        }
      }
    }
    function handleDownload() {
      if (url.length > 0 && anchorRef.current) {
        const file = buckets.get(props.property.value)?.file;
        if (file) {
          createDownloadLink(file, anchorRef.current);
        } else if (url.match(regex) && url.length > 4) {
          console.log('Fetching...');
          fetchBucket(props.property.value, url, account);
        }
      }
    }
    function handleClick() {
      if (inputRef.current) {
        inputRef.current.click();
      }
    }
    useEffect(() => {
      if (url.length > 0) {
        const propertyValue = buckets.get(props.property.value);
        const file = propertyValue?.file ? propertyValue?.file : null;
        if (file) {
          const urlObject = URL.createObjectURL(file);
          setRawData(urlObject);
        } else if (url.match(regex) && url.length > 4) {
          console.log('Fetching...');
          fetchBucket(props.property.value, url, account);
        }
      }
    }, [url, setRawData, buckets, props.property.value, fetchBucket, account]);
    return (
      <>
        <View
          {...props}
          handleClick={handleClick}
          handleDownload={handleDownload}
          handleUpload={handleUpload}
          url={url}
          setUrl={setUrl}
          rawData={rawData}
        />
        <a ref={anchorRef} className="sr-only"></a>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          // @ts-expect-error - Required for the input to work
          files={files}
          onChange={handleUpload}
        />
      </>
    );
  };
};
