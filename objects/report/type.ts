// Import types
import type { User } from "../user/type";
import type { Place } from "../place/type";
import type { Blog } from "../blog/type";

type $ReportExtendableAttributes = {
  _id: string;
  value: string;
  name: string;
  updatedAt: number;
  createdAt: number;
};

export type ReportReason = $ReportExtendableAttributes;

export type ReportStatus = $ReportExtendableAttributes;

export type ReportModel = {
  _id?: string;
  reporterId: string;
  userId?: string;
  placeId?: string;
  blogId?: string;
  reasonId: string;
  statusId: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export type Report = Omit<
  ReportModel,
  "reporterId" | "userId" | "placeId" | "blogId" | "reasonId" | "statusId"
> & {
  reporter: User;
  user: User;
  place: Place;
  blog: Blog;
  reason: ReportReason;
  status: ReportStatus;
};
