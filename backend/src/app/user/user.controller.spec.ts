import { Test, TestingModule } from "@nestjs/testing";
import { HttpException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { User } from "../../core/database/models/users";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginDto } from "./dto/login.dto";
import { USER_REPOSITORY } from "../../common/constant/user";

describe("UserService", () => {
  let service: UserService;
  let jwtService: JwtService;
  let userRepository: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("mockToken"),
            verify: jest
              .fn()
              .mockReturnValue({ id: 1, email: "test@example.com" }),
          },
        },
        {
          provide: USER_REPOSITORY,
          useClass: MockUserRepository, // Create a mock repository for testing
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<typeof User>(USER_REPOSITORY);
  });

  describe("getUserInfomation", () => {
    it("should return user information when email exists", async () => {
      const email = "test@example.com";
      const expectedUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      } as User;

      jest.spyOn(userRepository, "findOne").mockResolvedValue(expectedUser);

      const user = await service.getUserInfomation(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        attributes: ["id", "email", "password"],
        where: { email: email.toLowerCase() },
      });
      expect(user).toEqual(expectedUser);
    });

    it("should return undefined when email does not exist", async () => {
      const email = "nonexistent@example.com";

      jest.spyOn(userRepository, "findOne").mockResolvedValue(undefined);

      const user = await service.getUserInfomation(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        attributes: ["id", "email", "password"],
        where: { email: email.toLowerCase() },
      });
      expect(user).toBeUndefined();
    });
  });

  describe("createUser", () => {
    it("should create a new user and return the created user object", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "password123",
      };
      const hashedPassword = "hashedPassword";
      const expectedUser = {
        id: 1,
        email: "test@example.com",
        password: hashedPassword,
      } as User;

      jest.spyOn(service, "getUserInfomation").mockResolvedValue(null);
      jest.spyOn(service, "create").mockResolvedValue(expectedUser);
      jest.spyOn(service, "genPassword").mockReturnValue(hashedPassword);

      const user = await service.createUser(createUserDto);

      expect(service.getUserInfomation).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(user).toEqual(expectedUser);
    });

    it("should throw an HttpException if the email is already registered", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "password123",
      };

      jest.spyOn(service, "getUserInfomation").mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      });

      await expect(service.createUser(createUserDto)).rejects.toThrowError(
        HttpException,
      );
      expect(service.getUserInfomation).toHaveBeenCalledWith(
        createUserDto.email,
      );
    });
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      email: "test@example.com",
      password: "password123",
    };

    it("should generate a token and return the user login response object if the email and password are correct", async () => {
      const userExist = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      };
      const token = "generatedToken";
      const expectedResponse = { token, userId: userExist.id };

      jest.spyOn(service, "getUserInfomation").mockResolvedValue(userExist);
      jest.spyOn(service, "comparePassword").mockResolvedValue(true);
      jest.spyOn(service, "generateToken").mockResolvedValue(token);

      const response = await service.login(loginDto);

      expect(service.getUserInfomation).toHaveBeenCalledWith(loginDto.email);
      expect(service.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        userExist.password,
      );
      expect(service.generateToken).toHaveBeenCalledWith({
        userId: userExist.id,
        email: userExist.email,
      });
      expect(response).toEqual(expectedResponse);
    });

    it("should throw an HttpException with status 402 if the email is not registered", async () => {
      jest.spyOn(service, "getUserInfomation").mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrowError(HttpException);
      expect(service.getUserInfomation).toHaveBeenCalledWith(loginDto.email);
    });

    it("should throw an HttpException with status 403 if the password is incorrect", async () => {
      const userExist = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      };

      jest.spyOn(service, "getUserInfomation").mockResolvedValue(userExist);
      jest.spyOn(service, "comparePassword").mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrowError(HttpException);
      expect(service.getUserInfomation).toHaveBeenCalledWith(loginDto.email);
      expect(service.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        userExist.password,
      );
    });
  });
});
// Mock user repository class for testing
class MockUserRepository {
  findOne() {}
  create() {}
}
