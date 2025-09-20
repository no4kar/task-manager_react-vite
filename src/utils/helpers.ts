
/**
 * Returns a promise that resolves after a specified delay.
 * This function can be used to pause execution for a set amount of time.
 * 
 * @param {number} delay - The delay in milliseconds after which the promise resolves.
 * @returns {Promise<void>} A promise that resolves after the specified delay. */
export function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

/**
 * Truncates a string to a specified maximum length and appends a specified string (e.g., '...') if truncation occurs.
 * If the string is shorter than or equal to the specified maximum length, it is returned unchanged.
 * 
 * @param {string} str - The target string to be truncated.
 * @param {number} maxLength - The maximum length of the truncated string including the fill string.
 * @param {string} [fillString=''] - The string to append to the truncated string (default is an empty string).
 * @returns {string} The truncated string with the fill string appended if truncation occurs. */
export function truncateString(
  str: string = '',
  maxLength: number,
  fillString: string = '',
): string {
  if (str.length > maxLength) {
    // Regular expression to match all characters after the maxLength-fillString.length
    const regex = new RegExp(`^\\b(.{${maxLength - fillString.length}})`, 'm');
    return str.replace(regex, `$1${fillString}`).slice(0, maxLength);
  } else {
    return str;
  }
}

/**
 * Converts a File object to a Base64-encoded string.
 * 
 * This function reads the content of the provided file and returns a Promise
 * that resolves with the Base64 string representation of the file's data.
 * 
 * @param {File} file - The file to be converted to Base64.
 * @returns {Promise<string>} A promise that resolves with the Base64-encoded string of the file. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

export function base64ToBlob(base64: string): Blob {
  const [
    metadata,
    data,
  ] = base64.split(',');

  const mime = metadata.match(/:(.*?);/)?.[1] || '';
  const binary = atob(data);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}
