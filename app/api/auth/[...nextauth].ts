// 导入所需的模块和库
import bcrypt from 'bcrypt'; // 用于密码哈希
import NextAuth, { AuthOptions } from 'next-auth'; // NextAuth.js 库和类型
import CredentialsProvider from 'next-auth/providers/credentials'; // 用于用户名/密码身份验证的提供者
import GithubProvider from 'next-auth/providers/github'; // 用于 GitHub OAuth 身份验证的提供者
import GoogleProvider from 'next-auth/providers/google'; // 用于 Google OAuth 身份验证的提供者
import { PrismaAdapter } from '@next-auth/prisma-adapter'; // 用于连接 Prisma 数据库的适配器

import prisma from '@/app/libs/prismadb'; // 导入 Prisma 客户端实例

// 定义身份验证选项
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma), // 使用 Prisma 适配器
  providers: [
    // 配置 GitHub OAuth 提供者
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // 配置 Google OAuth 提供者
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // 配置用户名/密码提供者
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        // 验证输入的用户名和密码
        // 如果用户名或密码无效，抛出错误
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // 从数据库中查找用户
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // 如果用户不存在或用户的密码哈希不存在，抛出错误
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        // 比较输入的密码和数据库中的密码哈希
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

        // 如果密码不正确，抛出错误
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // 如果密码正确，返回用户对象
        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development', // 如果在开发环境中，开启调试模式
  session: {
    strategy: 'jwt', // 使用 JWT 作为会话策略
  },
  secret: process.env.NEXTAUTH_SECRET, // 用于签名 JWT 的密钥
};

// 创建 NextAuth.js 的处理函数
const handler = NextAuth(authOptions);

// 导出处理函数，可以作为 GET 和 POST 请求的处理函数
export { handler as GET, handler as POST };
