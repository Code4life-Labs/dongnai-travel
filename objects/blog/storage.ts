// Import from utils
import { StorageUtils } from "@/utils/storage";

export class BlogStorage {
  constructor() {}

  async saveDraftContent(data: any) {
    await StorageUtils.setItemAsync("SAVED_BLOG_CONTENT_KEY", data);
  }

  async getDraftContent() {
    return await StorageUtils.getItemAsync("SAVED_BLOG_CONTENT_KEY");
  }

  async removeDraftContent() {
    return await StorageUtils.removeItemAsync("SAVED_BLOG_CONTENT_KEY");
  }

  async savePublishContent(data: any) {
    await StorageUtils.setItemAsync("SAVED_BLOG_METADATA_KEY", data);
  }

  async getPublishContent() {
    return await StorageUtils.getItemAsync("SAVED_BLOG_METADATA_KEY");
  }

  async removePublishContent() {
    return await StorageUtils.removeItemAsync("SAVED_BLOG_CONTENT_KEY");
  }
}
