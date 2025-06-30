import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from "@/lib/api";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                try {
                    const response = await fetch('http://localhost:3000/api/login', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password
                        })
                    });
                    if (!response.ok) {
                        throw new Error('Login failed');
                    }
                    const data = await response.json();
                    console.log('Login response:', data);
                    if (data.cookies) {
                        return {
                            id: '1',
                            token: data.cookies,
                            properties: data.data || {},
                            username: credentials?.username
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.accessToken = user.token;
                token.username = user.username;
                token.properties = user.properties;
            }
            return token;
        },
        async session({session, token}) {
            session.accessToken = token.accessToken;
            session.data = token.properties;
            session.user = {
                ...session.user,
                username: token.username
            };
            return session;
        }
    },
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET
});

export {handler as GET, handler as POST};