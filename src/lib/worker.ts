import { OPFS } from './opfs';
import { uploadFile, downloadFile, setRequestInterceptor } from '@/api';
import type { Buckets, TokenType } from '@/types';

declare global {
  interface Window {
    opfs: OPFS;
  }
}

self.opfs = new OPFS();

self.onmessage = async (e: MessageEvent<string>) => {
  if (!self.opfs) {
    self.opfs = new OPFS();
  }
  if (!self.opfs.root) {
    await self.opfs.init();
  }
  if (e.data[0] === 'initialise') {
    const token = e.data[1] as unknown as TokenType;
    setRequestInterceptor({ token });
  }
  if (e.data[0] === 'save') {
    const file = await self.opfs.createFile((e.data[1] as any).name);
    if (file) {
      await self.opfs.writeFile(file, e.data[1]);
    }
  }
  if (e.data[0] === 'read') {
    const file = await self.opfs.getFile(e.data[1]);
    self.postMessage(['read', file]);
  }
  if (e.data[0] === 'upload') {
    // console.log(e.data);
    const key = e.data[1];
    const files = e.data[2] as unknown as Buckets;
    try {
      for (const [k, v] of files) {
        if (!v?.cloud && v.file instanceof File) {
          const res = await uploadFile(v.file);
          files.set(k, { ...v, cloud: res.data });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      // console.log(files);
      self.postMessage(['uploaded', key, files]);
    }
  }
  if (e.data[0] === 'download') {
    const name = e.data[1];
    const url = e.data[2];
    const key = e.data[3];
    try {
      const res = await downloadFile(url);
      const mimeType = res.data.type || 'image/png';
      const filename =
        url.substring(url.lastIndexOf('/') + 1) || 'untitled.png';
      const file = new File([res.data], filename, { type: mimeType });
      self.postMessage(['downloaded', name, url, file, key]);
    } catch (error) {
      console.log(error);
    }
  }
  // console.log("Message received from main script", e);
  //const workerResult = `Result: ${e.data[0] * e.data[1]}`;
  // console.log("Posting message back to main script");
  //postMessage(workerResult);
};
