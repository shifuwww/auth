import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(private readonly _userService: UserService) {}

  public getAllUsers() {
    return this._userService.getAllUsers();
  }
}
