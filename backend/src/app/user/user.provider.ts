import { USER_REPOSITORY } from "../../common/constant/user";
import { User } from "../../core/database/models/users";

export const UserProvider = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
