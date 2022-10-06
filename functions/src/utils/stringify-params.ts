// 3rd party
import { stringify } from 'query-string';

// Reason for this is to abstract the 3rd party library that keeps repeating
// if we had to replace it it would still be here
export function $stringifyParams(params: { [property: string]: string | number | undefined }) {
  return stringify({
    ...params,
  });
}
