import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export class Encrypt {
  static make(plain) {
    const salt = genSaltSync();
    return hashSync(plain, salt);
  }
  
  static compare(plain, hash) {
    return compareSync(plain, hash);
  }
}