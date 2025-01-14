export const postSelectOptions = {
  select: {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    coverImageURL: true,
    categories: {
      select: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
} as const;
