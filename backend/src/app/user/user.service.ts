import { Injectable, Inject } from "@nestjs/common";
import * as _ from "lodash";

import { USER_REPOSITORY } from "../../common/constant/user";

import { User } from "../../core/database/models/users";
import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: typeof User,
  ) {}

  /**
   * Promise get Account info with role
   * @param {*} email
   *
   * @returns {Promise}
   */
  async getUserInfomation(email): Promise<any> {
    return this.userRepository.findOne({
      attributes: ["id", "email", "password"],
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const isEmailExist = await this.getUserInfomation(createUserDto.email);

    if (isEmailExist) {
    }

    return;
  }
}
