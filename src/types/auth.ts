export type UserRole = "admin" | "member";

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}

