import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post } from "@prisma/client";
import { PostPutRequestBody } from "@/app/_types/PostPutRequestBody";

import { supabase } from "@/utils/supabase";

export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  // if (error)
  //   return NextResponse.json({ error: error.message }, { status: 401 });

  try {
    const post = await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ msg: `「${post.title}」を削除しました` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });

  try {
    const { title, content, coverImageURL, categoryIds }: PostPutRequestBody =
      await req.json();

    const post = await prisma.$transaction(async (prisma) => {
      const categories = await prisma.category.findMany({
        where: {
          id: {
            in: categoryIds,
          },
        },
      });

      if (categories.length !== categoryIds.length) {
        return NextResponse.json(
          { error: "指定されたカテゴリの一部が存在しません" },
          { status: 400 }
        );
      }

      const post: Post = await prisma.post.update({
        where: {
          id,
        },
        data: {
          title,
          content,
          coverImageURL,
          updatedAt: new Date(),
        },
      });

      await prisma.postCategory.deleteMany({
        where: {
          postId: id,
        },
      });

      await prisma.postCategory.createMany({
        data: categories.map((category) => ({
          postId: id,
          categoryId: category.id,
        })),
      });

      return post;
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の更新に失敗しました" },
      { status: 500 }
    );
  }
};
