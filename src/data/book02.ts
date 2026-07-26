export const book02Id = "02-overseas-network";

export interface BookChapterMetadata {
  book: string;
  order: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  chapterType: "introduction" | "chapter" | "appendix" | "sources";
  updatedAt: string;
  draft: boolean;
}

export interface BookTocItem extends BookChapterMetadata {
  chapterNumber?: number | undefined;
}

interface BookEntryLike {
  data: BookChapterMetadata & {
    chapterNumber?: number | undefined;
  };
}

export function sortBookChapters<T extends BookEntryLike>(
  entries: readonly T[],
): T[] {
  return [...entries].sort((left, right) => left.data.order - right.data.order);
}

export function toBookTocItems(
  entries: readonly BookEntryLike[],
): BookTocItem[] {
  return sortBookChapters(entries).map(({ data }) => ({
    book: data.book,
    order: data.order,
    slug: data.slug,
    title: data.title,
    shortTitle: data.shortTitle,
    description: data.description,
    chapterType: data.chapterType,
    updatedAt: data.updatedAt,
    draft: data.draft,
    ...(data.chapterNumber ? { chapterNumber: data.chapterNumber } : {}),
  }));
}
