import { createState } from '@agile-ts/core';
import { toast } from 'react-toastify';
import reactIntegration from '@agile-ts/react';
import { shared } from '@agile-ts/core';

// https://agile-ts.org/docs/quick-start/react#component-doesnt-re-render-when-state-mutates
shared.integrate(reactIntegration);

// States
export const IS_LOADING = createState(false);
export const IMAGE_URL = createState<string | null>(null);

// Actions

const getFileExtension = (filename: string): string | null => {
  const parts = filename.split('.');
  return parts.length > 0 ? parts[parts.length - 1] : null;
};

export const isValidFile = (filename: string): boolean => {
  const extensionName = getFileExtension(filename);
  return extensionName === 'png' || extensionName === 'jpg';
};

export const parseFile = (file: File): Promise<Buffer | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    if (!isValidFile(file.name)) {
      errorToast('Invalid file provided!');
      resolve(null);
    }

    // Setup FileReader callbacks
    reader.onabort = () => errorToast('File reading was aborted!');
    reader.onerror = () => errorToast('File reading has failed!');
    reader.onload = (e) => {
      // @ts-ignore
      resolve(Buffer.from(e.target?.result) || null);
    };

    // Start reading specified file
    reader.readAsArrayBuffer(file);
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
