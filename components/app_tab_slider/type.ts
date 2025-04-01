type Slide = {
  label: string;
  value: string;
  element: JSX.Element;
};

export type TabSliderProps = {
  slides: Array<Slide>;
  lineIndexTranslateXStart?: number;
  slideTranslateXStart?: number;
  isSliderContainerScrollable?: boolean;
  selectTabIndex?(index: number): void;
};
