// Import utils
import { BooleanUtils } from "@/utils/boolean";
import { ComponentUtils } from "@/utils/component";

// Import styles
import { Styles } from "@/styles";

// Import types
import type { $ExtendableButtonProps, RectangleButtonProps } from "./type";
import type { ButtonColors } from "./styles";

export class ButtonUtils {
  private static _getDefaultPropValues(props: $ExtendableButtonProps) {
    const activeColor = props.activeColor ? props.activeColor : "type_3";
    const defaultColor = props.defaultColor ? props.defaultColor : "type_1";
    const isTransparent = props.isTransparent ? props.isTransparent : false;
    const isOnlyContent = props.isOnlyContent ? props.isOnlyContent : false;
    const type = props.type ? props.type : "none";
    return {
      activeColor,
      defaultColor,
      isTransparent,
      isOnlyContent,
      type,
    };
  }

  private static _getDefaultRectanglePropsValues(props: RectangleButtonProps) {
    const _ = ButtonUtils._getDefaultPropValues(props);
    let shape = props.shape ? props.shape : "rounded_8";

    if (shape === "circle") shape = "capsule";

    return {
      shape,
      ..._,
    };
  }

  static getButtonColors(props: $ExtendableButtonProps, colors: ButtonColors) {
    const { activeColor, defaultColor } =
      ButtonUtils._getDefaultPropValues(props);

    const buttonColors = {
      btnColorStyle: {
        backgroundColor: colors.active[defaultColor].btn,
        color: colors.active[defaultColor].lbl,
      },
      lblColorStyle: {
        color: colors.active[defaultColor].lbl,
      },
    };

    if (BooleanUtils.isTrue(props.isActive)) {
      buttonColors.btnColorStyle.backgroundColor =
        colors.active[activeColor].btn;
      buttonColors.lblColorStyle.color = colors.active[activeColor].lbl;
    } else if (BooleanUtils.isFalse(props.isActive)) {
      buttonColors.btnColorStyle.backgroundColor =
        colors.inactive[activeColor].btn;
      buttonColors.lblColorStyle.color = colors.inactive[activeColor].lbl;
    }

    return buttonColors;
  }

  static buildButtonStyles(
    props: $ExtendableButtonProps,
    colors: ButtonColors,
    defaultStyle: any,
    buttonColors: ReturnType<typeof ButtonUtils.getButtonColors>
  ) {
    let contentContainerStyle: any = {
      ...defaultStyle,
      ...buttonColors.btnColorStyle,
    };
    let currentLabelStyle: any = buttonColors.lblColorStyle;

    if (props.isOnlyContent) {
      contentContainerStyle = {};
    }

    if (props.isTransparent) {
      contentContainerStyle.backgroundColor = "transparent";
      currentLabelStyle = {};
    }

    if (props.boxShadowType) {
      contentContainerStyle = Object.assign(
        {},
        contentContainerStyle,
        Styles.boxShadows[props.boxShadowType]
      );
    }

    if (props.border) {
      contentContainerStyle.borderWidth = props.border;
      contentContainerStyle.borderColor = buttonColors.lblColorStyle.color;
    }

    if (props.disabled) {
      contentContainerStyle = Object.assign(
        {},
        contentContainerStyle,
        colors.disable.type_1
      );
      currentLabelStyle = {
        color: colors.disable.type_1.lbl,
      };
    }

    contentContainerStyle = ComponentUtils.mergeStyle(
      contentContainerStyle,
      props.style,
      {
        underlayColor: props.underlayColor
          ? props.underlayColor
          : buttonColors.lblColorStyle.color,
      } as any
    );

    return {
      contentContainerStyle,
      currentLabelStyle,
    };
  }

  static buildRectangleButtonStyles(
    props: RectangleButtonProps,
    colors: ButtonColors,
    defaultStyle: any,
    buttonColors: ReturnType<typeof ButtonUtils.getButtonColors>
  ) {
    const _ = ButtonUtils.buildButtonStyles(
      props,
      colors,
      defaultStyle,
      buttonColors
    );
    const { shape } = ButtonUtils._getDefaultRectanglePropsValues(props);

    if (Array.isArray(_.contentContainerStyle))
      _.contentContainerStyle.push(Styles.shapes[shape]);
    else
      ComponentUtils.mergeStyle(_.contentContainerStyle, Styles.shapes[shape]);

    return _;
  }
}
