import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { DEFAULT_SALT_LENGTH } from 'src/shared/const';

@Injectable()
export class HashingService {
  private logger = new Logger(HashingService.name);

  async hashPassword(target: string): Promise<string> {
    try {
      const salt = await this.generateSalt();
      const hash = await this.hashWithSalt(target, salt);

      return `${salt}:${hash}`;
    } catch (err) {
      this.logger.error(err);
    }
  }

  async compare(target: string, hash: string): Promise<boolean> {
    const [salt, storedHash] = hash.split(':');

    const hashOfInput = await this.hashWithSalt(target, salt);

    return hashOfInput === storedHash;
  }

  private async generateSalt(): Promise<string> {
    return crypto.randomBytes(DEFAULT_SALT_LENGTH).toString('hex');
  }

  private async hashWithSalt(hash: string, salt: string): Promise<string> {
    const _hash = crypto.createHmac('sha256', salt);
    _hash.update(hash);
    return _hash.digest('hex');
  }
}
