/**
 * Initializes the Origin Private File System (OPFS) by requesting access to the root directory.
 * @returns {Promise<FileSystemDirectoryHandle>} A promise resolving to the root directory handle.
 */
async function initOPFS() {
  if (navigator && navigator.storage) {
    const root = await navigator.storage.getDirectory();
    return root;
  } else {
    throw new Error('Navigator storage is not supported');
  }
}

/**
 * Represents an interface to the Origin Private File System (OPFS).
 */
export class OPFS {
  public root: FileSystemDirectoryHandle | null;

  /**
   * Constructs an instance of OPFS.
   */
  constructor() {
    this.root = null;
  }

  /**
   * Initializes the OPFS instance by setting the root directory.
   * @returns {Promise<void>} A promise resolving when the initialization is complete.
   */
  async init() {
    this.root = await initOPFS();
  }

  /**
   * Creates a new directory within the specified parent directory.
   * @param {string} name The name of the directory to create.
   * @param {FileSystemDirectoryHandle} [directory=this.root] The parent directory.
   * @returns {Promise<FileSystemDirectoryHandle>} A promise resolving to the created directory handle.
   */
  async createDirectory(
    name: string,
    directory: FileSystemDirectoryHandle | null = this.root
  ) {
    return await directory?.getDirectoryHandle(name, { create: true });
  }

  /**
   * Retrieves a directory handle within the specified parent directory.
   * @param {string} name The name of the directory to retrieve.
   * @param {FileSystemDirectoryHandle} [directory=this.root] The parent directory.
   * @returns {Promise<FileSystemDirectoryHandle>} A promise resolving to the retrieved directory handle.
   */
  async getDirectory(
    name: string,
    directory: FileSystemDirectoryHandle | null = this.root
  ) {
    return await directory?.getDirectoryHandle(name);
  }

  /**
   * Creates a new file within the specified parent directory.
   * @param {string} name The name of the file to create.
   * @param {FileSystemDirectoryHandle} [directory=this.root] The parent directory.
   * @returns {Promise<FileSystemFileHandle>} A promise resolving to the created file handle.
   */
  async createFile(
    name: string,
    directory: FileSystemDirectoryHandle | null = this.root
  ) {
    return await directory?.getFileHandle(name, { create: true });
  }

  /**
   * Retrieves a file handle within the specified parent directory.
   * @param {string} name The name of the file to retrieve.
   * @param {FileSystemDirectoryHandle} [directory=this.root] The parent directory.
   * @returns {Promise<FileSystemFileHandle>} A promise resolving to the retrieved file handle.
   */
  async getFile(
    name: string,
    directory: FileSystemDirectoryHandle | null = this.root
  ) {
    return await directory?.getFileHandle(name);
  }

  /**
   * Reads the contents of a file.
   * @param {FileSystemFileHandle} file The file handle to read from.
   * @returns {Promise<File>} A promise resolving to the file contents.
   */
  async readFile(file: FileSystemFileHandle) {
    return await file.getFile();
  }

  /**
   * Writes contents to a file.
   * @param {FileSystemFileHandle} file The file handle to write to.
   * @param {string} contents The contents to write.
   * @returns {Promise<void>} A promise resolving when the write operation is complete.
   */
  async writeFile(file: FileSystemFileHandle, contents: string) {
    const writable = await file.createWritable();
    await writable.write(contents);
    await writable.close();
  }
}
