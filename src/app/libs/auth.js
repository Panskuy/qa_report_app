import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { email, password } = credentials;

        // Validasi input
        if (!email || !password) {
          throw new Error("Email dan password wajib diisi");
        }

        try {
          // Cari user berdasarkan email
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
          });

          if (!user) {
            throw new Error("Email tidak terdaftar");
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            throw new Error("Password yang Anda masukkan salah");
          }

          // Return user data jika berhasil
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          // Re-throw error untuk ditangkap di sign-in page
          throw new Error(error.message);
        }
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
