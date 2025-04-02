import NextAuth from "next-auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectMongoDB();
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) throw new Error("Invalid credentials");
          if (!await bcrypt.compare(credentials.password, user.password)) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          };
        } catch (error) {
          throw new Error("/?error=CredentialsSignin");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour absolute maximum
    updateAge: 60 * 5, // Refresh if last update >5 mins ago
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.lastUpdate = Math.floor(Date.now() / 1000);
        return token;
      }
      
      //Update via useSession().update()
      if (trigger === "update") {
        token.lastUpdate = Math.floor(Date.now() / 1000);
        return { ...token, ...session };
      }
      
      //Refresh
      const now = Math.floor(Date.now() / 1000);
      if (token.lastUpdate && (now - token.lastUpdate > 60 * 5)) {
        token.lastUpdate = now;
      }
      
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.expires = new Date(
        (token.lastUpdate || token.iat || Math.floor(Date.now() / 1000)) * 1000 + 60 * 60 * 1000
      ).toISOString();

      if (session?.user) {
        session.user.image = token.profilePic || "/Images/defaultUser.png";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  pages: {
    signIn: "/",
    error: "/", // Redirect all errors to home/login
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
