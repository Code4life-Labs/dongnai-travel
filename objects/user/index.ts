import moment from "moment";

import { UserAPI } from "./api";
import { UserStorage } from "./storage";
import { UserValidator } from "./validator";

// Import types
import type { NewUser } from "./type";

export class UserManager {
  static Api = new UserAPI(process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL!);
  static Storage = new UserStorage();
  static Validator = new UserValidator();

  private constructor() {}

  static createNewUser(data: NewUser): NewUser {
    return {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.firstName + " " + data.lastName,
      birthday: moment(data.birthday, "DD/MM/YYYY").toDate().getTime(),
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      avatar: data.avatar,
      coverPhoto: data.coverPhoto,
    };
  }
}
