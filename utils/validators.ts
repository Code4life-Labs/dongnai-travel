// Import from constants
import { FILE_CONST } from "@/constants/file";
import { REGEXES } from "@/constants/regexes";

export const EMAIL_RULE_MESSAGE = "Email is invalid.";

export const PASSWORD_RULE_MESSAGE =
  "At least 1 letter, a number, at least 8 characters.";

export const BIRTHDAY_RULE_MESSAGE = "Incorrect format dd/mm/yyyy";

export const FIELD_REQUIRED_MESSAGE = "This field is required.";
export const FIELD_MIN_LENGTH_MESSAGE =
  "This field must be at least 8 characters";

export class ValidatorUtils {
  static singleFileValidator(file: any) {
    if (!file || !file.name || !file.size || !file.type) {
      return "File cannot be blank.";
    }
    if (file.size > FILE_CONST.SIZE) {
      return "Maximum file size exceeded. (10MB)";
    }
    if (!FILE_CONST.ALLOWED_FILES.includes(file.type)) {
      return "File type is invalid.";
    }
    return null;
  }

  static isValidFileURL(fileURL: string) {
    return REGEXES.URL.test(fileURL);
  }

  static isValidEmail(email: string) {
    return REGEXES.USER.EMAIL.test(email);
  }
}
