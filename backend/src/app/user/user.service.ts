import { HttpException, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { ERROR_MAP, USER_REPOSITORY } from "../../common/constant/user";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../core/database/models/users";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginDto } from "./dto/login.dto";
import { UserLoginResponse } from "./interface/user.interface";
import { jwtPayload } from "./interface/jwtPayload.interface";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  /**
   * Promise get Account info with role
   * @param {*} email
   *
   * @returns {Promise}
   */
  async getUserInfomation(email): Promise<User> {
    return this.userRepository.findOne({
      attributes: ["id", "email", "password"],
      where: {
        email: email.toLowerCase(),
      },
    });
  }
  /**
   * Promise generator password
   * @param {String} password password of user
   *
   * @returns {String}
   */
  genPassword(password): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * Create user function
   * @param createUserDto
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isEmailExist = await this.getUserInfomation(createUserDto.email);
    if (isEmailExist) {
      throw new HttpException(ERROR_MAP.EMAIL_REGISTED, 401);
    }

    return await this.create(createUserDto);
  }

  /**
   * Create user repository
   * @param userData
   */
  create(userData): Promise<User> {
    return this.userRepository.create({
      email: userData.email.toLowerCase(),
      password: this.genPassword(userData.password),
    });
  }
  /**
   * Promise compare password
   *
   * @param {String} bodyPassword of user login
   * @param {String} passwordDb of user in db
   *
   * @returns {Promise}
   */
  async comparePassword(bodyPassword, passwordDb): Promise<boolean> {
    return bcrypt.compareSync(bodyPassword, passwordDb);
  }
  /**
   * Generate jwt token
   *
   * @param data
   * @returns {Promise}
   */
  async generateToken(data: jwtPayload): Promise<string> {
    return this.jwtService.sign(data);
  }

  /**
   * User login service
   * @param userData
   */
  async login(userData: LoginDto): Promise<UserLoginResponse> {
    const userExist = await this.getUserInfomation(userData.email);

    if (!userExist) {
      throw new HttpException(ERROR_MAP.EMAIL_NOT_REGISTED, 402);
    }

    const isPasswordCorrect = await this.comparePassword(
      userData.password,
      userExist.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(ERROR_MAP.EMAIL_OR_PASSWORD_NOT_CORRECT, 403);
    }
    const token = await this.generateToken({
      userId: userExist.id,
      email: userExist.email,
    });
    return { token, userId: userExist.id };
  }
}
