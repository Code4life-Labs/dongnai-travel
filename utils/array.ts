export class ArrayUtils {
  static updateAt<T>(target: Array<T>, index: number, update: any) {
    target.splice(index, 1, update);
    return target;
  }
}
