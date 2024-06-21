export class BooleanUtils {
  static isTrue(data?: any) {
    let check = Boolean(data);

    if (typeof check === "number") check = !Number.isNaN(data);

    return data !== undefined && data !== null && check;
  }

  static isFalse(data?: any) {
    let check = !Boolean(data);

    if (typeof check === "number") check = Number.isNaN(data);

    return data !== undefined && data !== null && check;
  }

  static isEmpty(data: any) {
    switch (typeof data) {
      case "string": {
        return !data;
      }

      case "number": {
        return data === undefined || data === null;
      }

      case "object": {
        if (Array.isArray(data)) return data.length === 0;
        return Object.getOwnPropertyNames(data).length === 0;
      }

      case "undefined":
      default:
        return true;
    }
  }
}
