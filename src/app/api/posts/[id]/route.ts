import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { postSelectOptions } from "@/app/_config/postSelectOptions";
import { PostGetApiResponse } from "@/app/_types/PostGetApiResponse";

export const revalidate = 0;

export const GET = async (
  reg: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const post = (await prisma.post.findUnique({
      ...postSelectOptions,
      where: { id },
    })) as PostGetApiResponse | null;
    // console.log(post);
    if (!post) {
      return NextResponse.json(
        { error: `id='${id}'の投稿記事は見つかりませんでした` },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の取得に失敗しました" },
      { status: 500 }
    );
  }
};
