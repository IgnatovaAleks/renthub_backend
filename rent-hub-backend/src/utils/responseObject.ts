import { User } from "@prisma/client";

export interface IUserDisplayDTO {
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
  tokens?: {
    access?: string;
    refresh?: string;
  };
}

export const UserDisplayDTOResponse = (
  user: User,
  access?: string,
  refresh?: string
): IUserDisplayDTO => {
  const userObject: IUserDisplayDTO = {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
  if (access && refresh) {
    userObject.tokens = {
      access,
      refresh,
    };
  }
  return userObject;
};
