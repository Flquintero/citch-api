//  this is for oath 2 state param in the auth for platforms
//also done with possible chars to avoid issues with url
export function $getRandomHash() {
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 40; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
