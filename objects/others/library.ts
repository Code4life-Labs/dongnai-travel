import * as ImagePicker from "expo-image-picker";

export class Library {
  /**
   * Use to pick image from library
   * @param options
   * @returns
   */
  static async pickImage(options?: ImagePicker.ImagePickerOptions) {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return undefined;
      }

      options = Object.assign(
        {},
        {
          mediaTypes: ["images"],
          quality: 1,
          base64: true,
          // Allow 10 images at one times
          selectionLimit: 10,
          orderedSelection: true,
        },
        options
      );

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled) return undefined;
      return result;
    } catch (error: any) {
      console.log("Image pick result error: ", error.message);
      return undefined;
    }
  }
}
