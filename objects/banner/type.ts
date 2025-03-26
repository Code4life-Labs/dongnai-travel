export type BannerModel = {
  _id: string;
  title: string;
  image: string;
  target: string;
  brand: {
    name: string;
    logoUrl: string;
    website: string;
  };
  isActive: boolean;
  startDate: number;
  endDate: number;
};

export type Banner = BannerModel;
