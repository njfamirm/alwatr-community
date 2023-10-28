import moment from 'moment-jalaali';

export const fatemieh = moment('1402/9/26', 'jYYYY/jM/jD');

export function dateDistance(dateMilliseconds: number): number {
  return Math.ceil((dateMilliseconds - Date.now()) / 60 / 60 / 24 / 1000);
}
