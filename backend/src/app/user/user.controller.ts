import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post("user")
  createUser(@Body("user") userData: CreateUserDto) {}
}
