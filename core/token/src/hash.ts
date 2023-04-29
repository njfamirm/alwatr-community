import {createHash, randomBytes, type BinaryLike} from 'node:crypto';

import type {HashGeneratorConfig} from './type.js';

/**
 * Secure **self-validate** hash generator.
 */
export class AlwatrHashGenerator {
  constructor(public config: HashGeneratorConfig) {}

  /**
   * Generate simple hash from random data.
   *
   * Example:
   *
   * ```js
   * const clientId = hashGenerator.random();
   * ```
   */
  random(): string {
    return this.generate(randomBytes(16));
  }

  /**
   * Generate **self-validate** hash from random data.
   *
   * Example:
   *
   * ```ts
   * const userId = hashGenerator.randomSelfValidate();
   * ```
   */
  randomSelfValidate(): string {
    return this.generateSelfValidate(randomBytes(16));
  }

  /**
   * Generate simple hash from data.
   *
   * Example:
   *
   * ```ts
   * const crcHash = hashGenerator.generate(downloadedData);
   * ```
   */
  generate(data: BinaryLike): string {
    return createHash(this.config.algorithm).update(data).digest(this.config.encoding);
  }

  /**
   * Generate crc hash.
   */
  _generateCrc(data: BinaryLike): string {
    const crc = this.generate(data);
    return this.config.crcLength == null || this.config.crcLength < 1 ? crc : crc.substring(0, this.config.crcLength);
  }

  /**
   * Generate **self-validate** hash from data.
   *
   * Example:
   *
   * ```js
   * const userId = hashGenerator.generateSelfValidate(randomData);
   * ```
   */
  generateSelfValidate(data: BinaryLike): string {
    const mainHash = this.generate(data);
    const crcHash = this._generateCrc(mainHash);
    return mainHash + crcHash;
  }

  /**
   * Verify `generate(data)` equals to `hash`.
   *
   * Example:
   *
   * ```ts
   * if (!hashGenerator.verify(downloadedData, crcHash)) {
   *   new Error('data_corrupted');
   * }
   * ```
   */
  verify(data: BinaryLike, hash: string): boolean {
    return hash === this.generate(data);
  }

  /**
   * Verify a **self-validate** hash to check its generated by this class (same options).
   *
   * Example:
   *
   * ```ts
   * if (!hashGenerator.verifySelfValidate(user.id)) {
   *   new Error('invalid_user');
   * }
   * ```
   */
  verifySelfValidate(hash: string): boolean {
    const gapPos =
      this.config.crcLength == null || this.config.crcLength < 1
        ? hash.length / 2
        : hash.length - this.config.crcLength;
    const mainHash = hash.substring(0, gapPos);
    const crcHash = hash.substring(gapPos);
    return crcHash === this._generateCrc(mainHash);
  }
}
