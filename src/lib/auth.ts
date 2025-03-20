import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("There is an issue in authroize /auth.ts");
        }

        try {
          await connectToDB();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User Not found");
          }

          const isValid = bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Your password is not correct");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
};
