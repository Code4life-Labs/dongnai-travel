export type TabSliderProps = {
  children: Array<JSX.Element>;
  lineIndexTranslateXStart?: number;
  slideTranslateXStart?: number;
  isSliderContainerScrollable?: boolean;
  selectTabIndex?(index: number): void;
};
