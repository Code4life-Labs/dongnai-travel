// Import from utils
import { StorageUtils } from "@/utils/storage";

export class UserStorage {
  constructor() {}

  async save(data: any) {
    await StorageUtils.setItemAsync("USER", data);
  }

  async get() {
    return await StorageUtils.getItemAsync("USER");
  }
}
