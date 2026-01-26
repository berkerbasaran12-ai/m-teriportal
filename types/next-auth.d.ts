import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      role: "ADMIN" | "CLIENT";
      companyName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "CLIENT";
    companyName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "CLIENT";
    companyName?: string;
  }
}
