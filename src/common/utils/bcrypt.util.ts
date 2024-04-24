import * as bcrypt from 'bcrypt';

export abstract class CryptoUtil {
  static async generateSalt(): Promise<string> {
    return await bcrypt.genSalt();
  }

  static async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  static async validatePassword(
    passwordPlain: string,
    passwordCrypt: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordPlain, passwordCrypt);
  }
}
