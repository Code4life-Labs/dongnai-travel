import React from "react";

// Import from utils
import { StringUtils } from "@/utils/string";

// Import types
import type { AppListItemProps, AppListProps, UListTypes } from "./type";

export class ListUtils {
  static UnorderedBullets = ["\u2022", "-"];
  static OrderedButtets = [
    StringUtils.Digits,
    StringUtils.Characters,
  ] as Array<string>;

  /**
   * Check the incomming element is an valid item of list container
   * @param element
   * @returns
   */
  static isValidItem(element: any) {
    if (!React.isValidElement(element)) return false;

    switch (element.type) {
      case "[Function AppOrderedList]":
      case "[Function AppListItem]": {
        return true;
      }

      default:
        return false;
    }
  }

  /**
   * Check the incomming element is `AppListItem`
   * @param element
   * @returns
   */
  static isItemElement(element: any) {
    if (!React.isValidElement(element)) return false;
    return /AppListItem/.test(Object.toString.call(element.type));
  }

  /**
   * Check the incomming element is `AppOrderedList` or `AppUnorderedList`
   * @param element
   * @returns
   */
  static isValidList(element: any) {
    if (!React.isValidElement(element)) return false;
    return /\bAppList\b/.test(Object.toString.call(element.type));
  }

  private static _getBullet(
    bullets: Array<string>,
    index: number,
    level: number
  ) {
    const bullet = bullets[level % bullets.length];
    return bullet[index % bullet.length];
  }

  /**
   * Get bullet for ordered list within level
   * @param bullets
   * @param level
   * @returns
   */
  static getOrderedBullet(
    bullets: Array<string> = ListUtils.OrderedButtets,
    index: number,
    level: number
  ) {
    let bullet = ListUtils._getBullet(bullets, index, level);

    // If index >= 10
    if (index >= 9) {
      bullet = (index + 1).toString()[0] + bullet;
    }

    return bullet;
  }

  /**
   * Get bullet for unordered list within level
   * @param bullets
   * @param level
   * @returns
   */
  static getUnorderedBullet(
    bullets: Array<string> = ListUtils.UnorderedBullets,
    index: number,
    level: number
  ) {
    let bullet = ListUtils._getBullet(bullets, index, level);

    return bullet;
  }

  /**
   * Increase the nested list to 1
   * @param element
   * @returns
   */
  static increaseListLevel(
    element: React.ReactElement<AppListProps>,
    level?: number
  ) {
    return React.cloneElement(element, {
      level: (element.props.level || level || 0) + 1,
      ...element.props,
    });
  }

  /**
   * Render a list of item
   * @param item
   * @param index
   * @param level
   * @param type
   * @param bullets
   * @returns
   */
  static renderListItem(
    item: React.ReactElement<AppListItemProps | AppListProps>,
    index: number,
    level: number,
    type: UListTypes,
    bullets?: Array<string>
  ) {
    let separator, bullet;

    switch (type) {
      case "ordered": {
        bullet = ListUtils.getOrderedBullet(bullets, index, level);
        separator = ". ";
        break;
      }

      case "unordered": {
        bullet = ListUtils.getUnorderedBullet(bullets, index, level);
        separator = " ";
        break;
      }
    }

    if (ListUtils.isValidList(item.props.children)) return item;

    return React.cloneElement(item, {
      key: index,
      children: bullet + separator + item.props.children,
    });
  }
}
