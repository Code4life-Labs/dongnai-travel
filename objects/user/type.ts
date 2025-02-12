export type UserRoleModel = {
  _id: string;
  value: string;
  name: string;
};

export type $Extendable = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  displayName: string;
  birthday: number;
  avatar: string;
  coverPhoto: string;
  createdAt: number;
  updatedAt: number;
};

export type UserDataForAuthentication = {
  email?: string;
  username?: string;
  password?: string;
};

export type NewUser = Omit<$Extendable, "_id" | "createdAt" | "updatedAt"> & {
  confirmPassword: string;
  password: string;
};

export type UserModel = $Extendable & {
  roleId: string;
};

export type User = $Extendable & {
  role: UserRoleModel;
};
