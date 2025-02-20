// Import from utils
import { StorageUtils } from "@/utils/storage";

export class UserStorage {
  constructor() {}

  async save(data: any) {
    await StorageUtils.setItemAsync("REMEMBERED_USER", data);
  }

  async get() {
    return await StorageUtils.getItemAsync("REMEMBERED_USER");
  }
}
