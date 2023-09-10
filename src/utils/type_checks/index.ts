import { errors } from '../consts/errors';

function validateNumber(variable: any): number {
  const num = Number(variable);
  if (isNaN(num)) throw new Error(`${errors.BAD_REQUEST}: ${variable} is not a number`);
  return num;
}

function round(num: number, digits: number): string {
  if (!Number.isInteger(num)) return num.toFixed(digits);
  return num.toString();
}

function transformIpfsToUrl(url: string): string {
  if (url.startsWith('ipfs://')) {
    const ipfsHash = url.replace('ipfs://', '');
    return `https://lens.infura-ipfs.io/ipfs/${ipfsHash}`;
  }

  return url;
}

function removeWhiteSpaces(text: string): string {
  return text.replace(/\s/g, '');
}

function capitalizeFirstLetter(text: string): string {
  const firstLetterCap = text.charAt(0).toUpperCase();
  const remainingText = text.slice(1);
  return firstLetterCap + remainingText;
}

function parseToBoolean(variable: any): boolean {
  if (String(variable) === 'true') return true;
  return false;
}

export {
  validateNumber,
  round,
  transformIpfsToUrl,
  removeWhiteSpaces,
  capitalizeFirstLetter,
  parseToBoolean,
};
