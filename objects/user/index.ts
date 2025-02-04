import { UserAPI } from "./api";
import { UserStorage } from "./storage";
import { UserValidator } from "./validator";

export class UserManager {
  static Api = new UserAPI();
  static Storage = new UserStorage();
  static Validator = new UserValidator();

  private constructor() {}
}
