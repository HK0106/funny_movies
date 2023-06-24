import { Test } from "@nestjs/testing";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserController } from "./user.controller";
import { User } from "../../core/database/models/users";
import { HttpException } from "@nestjs/common";

describe("UserController test function", () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    fakeUserService = {
      getUserInfomation: (email: string) => Promise.resolve(),
      createUser: (userData: CreateUserDto) => Promise.resolve({ id: 1 }),
    };
    const module = await Test.createTestingModule({
      providers: [
        UserController,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    controller = module.get(UserController);
  });

  it("should create an instance of user service", async function () {
    expect(controller).toBeDefined();
  });

  it("create user only return id", async () => {
    const user = await controller.createUser({
      email: "abc@gmail.com",
      password: "1234",
    });
    expect(Object.keys(user)).toEqual(["id"]);
  });

  it("create user only return id 2", async () => {
    const user = await controller.createUser({
      email: "ab123c@gmail.com",
      password: "1123234",
    });
    expect(Object.keys(user)).not.toEqual(["id", "email"]);
  });

  it("throws an error if user register with email inuse", async () => {
  });
});
