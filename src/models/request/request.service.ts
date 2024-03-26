import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service that provides a unique ID for each request.
 * This ID can be used to trace and log requests throughout the application.
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private readonly _id: string;

  constructor() {
    this._id = uuidv4();
  }

  /**
   * Getter for the unique ID associated with the current request.
   * @returns {string} The unique ID.
   */
  public get id(): string {
    return this._id;
  }
}