import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const prisma = new PrismaClient(); // PrismaClientのインスタンス生成

const main = async () => {
  // 各テーブルから既存の全レコードを削除
  await prisma.postCategory?.deleteMany();
  await prisma.post?.deleteMany();
  await prisma.category?.deleteMany();

  // カテゴリデータの作成 (テーブルに対するレコードの挿入)
  const c1 = await prisma.category.create({ data: { name: "データ構造" } });
  const c2 = await prisma.category.create({ data: { name: "アルゴリズム" } });
  const c3 = await prisma.category.create({ data: { name: "グラフ理論" } });
  const c4 = await prisma.category.create({ data: { name: "ポエム" } });
  const c5 = await prisma.category.create({ data: { name: "数学" } });

  // 投稿記事データの作成
  const p1 = await prisma.post.create({
    data: {
      title: "JMO本選2025P4解いてみた",
      content:
        "十分性の確認で \\( p=2 \\) の時のLTEの補題の話をしていませんが，大目に見てください",
      createdAt: new Date(),
      coverImageKey: "private/d61e09bcdc8da363761e93d1be8f89ab",
      bodyPdfKey: "private/026b44fe69ce6691e28601ec106afa73",
      categories: {
        create: [{ categoryId: c5.id }],
      },
    },
  });

  const p2 = await prisma.post.create({
    data: {
      title: "シュタイニッツ",
      content:
        "<ol>\n    <li>任意の体は代数的閉包を持つ．</li>\n    <li> \\( \\Omega_i \\) を \\( K_i \\) の代数的閉包とする．このとき，同型写像 \\( \\sigma: K_1 \\to K_2 \\) は，\\( \\~{\\sigma}: \\Omega_1 \\to \\Omega_2 \\) に延長される．</li>\n</ol>\n\n証明はまたいつか．",
      createdAt: new Date(),
      categories: {
        create: [{ categoryId: c5.id }],
      },
    },
  });

  const p3 = await prisma.post.create({
    data: {
      title: "ポエム1",
      content: "お腹が鳴くから帰ろうと思います．まっすぐお家へ帰ります．",
      createdAt: new Date(),
      categories: {
        create: [{ categoryId: c4.id }],
      },
    },
  });

  const p4 = await prisma.post.create({
    data: {
      title: "ポエム2",
      content: "いっぱい輝き，未来を明るくする．",
      createdAt: new Date(),
      categories: {
        create: [{ categoryId: c4.id }],
      },
    },
  });

  const p5 = await prisma.post.create({
    data: {
      title: "ポエム3",
      content: "セブンの蒸しパン超うまい．",
      createdAt: new Date(),
      coverImageKey: "private/7addb921dc6ab6e865f7c82aa004c6d0",
      categories: {
        create: [{ categoryId: c4.id }],
      },
    },
  });

  const p6 = await prisma.post.create({
    data: {
      title: "ポエム4",
      content: "キルヒホッフに従うほど無敵になれた．",
      createdAt: new Date(),
      coverImageKey: "private/73207128af9e6d1c36670be3c9d00c83",
      categories: {
        create: [{ categoryId: c4.id }],
      },
    },
  });

  const p7 = await prisma.post.create({
    data: {
      title: "ポエム5",
      content: "へい",
      coverImageKey: "private/7addb921dc6ab6e865f7c82aa004c6d0",
      createdAt: new Date(),
      categories: {
        create: [{ categoryId: c4.id }],
      },
    },
  });

  const p8 = await prisma.post.create({
    data: {
      title: "Hallの結婚定理",
      content:
        '頂点集合 \\( A, B \\) に分割されている二部グラフ \\( G \\) に対して次の二条件は同値です．<br>\n<div>\n<ul class="list-style-type: circle">\n    <li> \\( A \\)をすべてカバーするマッチングが存在する．</li>\n    <li> \\( |N(S)| \\geq |S| \\quad \\forall S \\subseteq A \\) </li>\n</ul>\nここで，頂点集合 \\( S \\) の隣接頂点全体を \\( N(S) \\) としました．証明はしません．',
      createdAt: new Date(),
      categories: {
        create: [{ categoryId: c5.id }, { categoryId: c3.id }],
      },
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
