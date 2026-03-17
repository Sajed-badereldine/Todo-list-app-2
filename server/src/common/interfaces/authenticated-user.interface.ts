export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
