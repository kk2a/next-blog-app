import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { postSelectOptions } from "@/app/_config/postSelectOptions";

// postSelectOptionsを指定したときの戻り値の「型」を定義
type PostWithCategories = Prisma.PostGetPayload<typeof postSelectOptions>;

export const revalidate = 0;

export const GET = async (req: NextRequest) => {
  try {
    const posts: PostWithCategories[] = await prisma.post.findMany({
      ...postSelectOptions, // スプレッド構文でオプションを展開
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
};
