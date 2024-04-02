import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

/**
 * Handles the POST request for user registration.
 * @param request - The request object.
 * @returns The response object.
 */
// 导出一个异步函数，处理 POST 请求
export async function POST(request: Request) {
  try {
    // 从请求中获取 JSON 数据
    const body = await request.json();
    // 从 JSON 数据中解构出 email、name 和 password
    const { email, name, password } = body;

    // 检查必要的字段是否缺失
    if (!email || !name || !password) {
      // 如果缺失，返回一个带有错误信息和 400 状态码的响应
      return new NextResponse('Missing info', { status: 400 });
    }

    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(password, 12);

    // 在数据库中创建一个新的用户记录
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // 返回一个包含新创建的用户信息的 JSON 响应
    return NextResponse.json(user);
  } catch (error: any) {
    // 如果在处理过程中发生错误，打印错误信息，并返回一个带有错误信息和 500 状态码的响应
    console.log(error, 'REGISTER_ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
