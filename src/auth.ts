import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { auth, handlers } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify" } },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      const userId = account?.providerAccountId;
      const res = await fetch(
        `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${userId}`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      );

      if (!res.ok) return false;

      const member = await res.json();
      return member.roles.includes(process.env.ROLE_ID);
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/chat`;
    },
  },
});
