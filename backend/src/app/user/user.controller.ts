import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import {
  UserLoginResponse,
  UserRegisterResponse,
} from "./interface/user.interface";
import { LoginDto } from "./dto/login.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post("register")
  async createUser(
    @Body() userData: CreateUserDto,
  ): Promise<UserRegisterResponse> {
    return await this.userService.createUser(userData);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post("login")
  async login(@Body() userData: LoginDto): Promise<UserLoginResponse> {
    return await this.userService.login(userData);
  }
}
