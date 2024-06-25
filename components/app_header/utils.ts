// Import from utils
import { BooleanUtils } from "@/utils/boolean";

// Import types
import type { AppStackHeaderProps, AppTabHeaderProps } from "./type";

export class AppHeaderUtils {
  static getTitle(props: AppStackHeaderProps | AppTabHeaderProps) {
    let title = "Title";

    if (BooleanUtils.isEmpty(props.options)) return title;

    if (!BooleanUtils.isEmpty(props.options.title)) title = props.options.title;
    if (!BooleanUtils.isEmpty(props.screenName)) title = props.screenName;
    if (!BooleanUtils.isEmpty(props.route)) title = props.route.name;

    return title;
  }
}
