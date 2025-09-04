import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                presentationId: { label: "Presentation ID", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    // Call your backend login endpoint
                    const res = await axios.post(
                        `http://localhost:5000/api/users/login`,
                        {
                            email: credentials.email,
                            password: credentials.password,
                            presentationId: credentials.presentationId,
                        }
                    );

                    if (res.data?.token) {
                        console.log("TOKEN", res.data.token);
                        return {
                            id: res.data.userId, // make sure backend returns this
                            email: credentials.email,
                            accessToken: res.data.token,
                            presentationId: res.data.presentationId,
                        };
                    }
                    return null;
                } catch (err) {
                    console.error("Login failed:", err);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.accessToken = (user as any).accessToken;
                token.presentationId = (user as any).presentationId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    accessToken: token.accessToken as string,
                    presentationId: token.presentationId as string,
                };
            }
            return session;
        }

        ,
    },

    // pages: {
    //   signIn: "/auth/login",
    // },
    debug: process.env.NODE_ENV === "development",
};
