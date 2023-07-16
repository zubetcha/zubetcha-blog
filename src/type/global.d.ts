import type { Mongoose } from 'mongoose';

declare global {
  /* eslint-disable-next-line no-var */
  var mongoose: Mongoose | undefined;
}
