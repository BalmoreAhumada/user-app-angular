import { EventEmitter, Injectable } from "@angular/core";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter();

  private _idUserEventEmitter = new EventEmitter();

  private _findUserByIdEventEmitter = new EventEmitter();

  private _selectUserEventEmitter = new EventEmitter();

  private _erroruserFormEventEmitter = new EventEmitter();

  private _pageUsersEventEmitter = new EventEmitter();

  constructor() { }

  get selectUserEventEmitter() {
    return this._selectUserEventEmitter;
  }

  get pageUsersEventEmitter() {
    return this._pageUsersEventEmitter;
  }

  get findUserByIdEventEmitter() {
    return this._findUserByIdEventEmitter
  }

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }

  get idUserEventEmitter(): EventEmitter<number> {
    return this._idUserEventEmitter;
  }

  get erroruserFormEventEmitter(): EventEmitter<any> {
    return this._erroruserFormEventEmitter;
  }

}
