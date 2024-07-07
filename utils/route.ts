export class RouteUtils {
  static Regexes = {
    DoubleStartQueryChar: /^\?{2,}/,
  };

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

  /**
   * Use this method to merge `url` and `query`.
   * @param url
   * @param query
   */
  static mergeQuery(url: string, query: string) {
    // TO DO: remove all "?", if query has more than 2

    // `query` can have "?", "??", or more "?" (start query character)
    // Remove all "?" or left only 1 character "?" if `query` has only 1.
    const result = query.split(RouteUtils.Regexes.DoubleStartQueryChar);
    const validatedQuery = result[result.length - 1];

    if (validatedQuery[0] === "?") return url + validatedQuery;
    return url + "?" + validatedQuery;
  }
}
