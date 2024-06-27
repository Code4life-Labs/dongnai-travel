export class RouteUtils {
  /**
   * Use this method to get valid href from string
   * @param routeName
   * @returns
   * @NguyenAnhTuan1912
   */
  static getHref(routeName: string) {
    const splitted = routeName.split("/");

    routeName = splitted[splitted.length - 1];

    if (routeName === "index") return "/";

    return "/" + routeName;
  }

  /**
   * Use this method to create a valid path for routing
   * @param routeName
   * @NguyenAnhTuan1912
   */
  static getPath(...routeNames: Array<string>) {
    let path = "";

    for (let routeName of routeNames) {
      path += RouteUtils.getHref(routeName);
    }

    return path;
  }
}
