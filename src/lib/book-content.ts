import type {
  BookDefinition,
  ChapterType,
} from "../data/books";

export interface BookChapterMetadata {
  book: string;
  order: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  chapterType: ChapterType;
  updatedAt: string;
  draft: boolean;
  sourceAnchor?: string | undefined;
  chapterNumber?: number | undefined;
  duration?: string | undefined;
  labels?: string[] | undefined;
  completionId?: string | undefined;
}

export interface BookTocItem extends BookChapterMetadata {
  completionEligible: boolean;
}

export interface BookEntryLike {
  data: BookChapterMetadata;
}

export function sortBookChapters<T extends BookEntryLike>(
  entries: readonly T[],
): T[] {
  return [...entries].sort((left, right) => left.data.order - right.data.order);
}

export function entriesForBook<T extends BookEntryLike>(
  entries: readonly T[],
  book: BookDefinition,
): T[] {
  return sortBookChapters(
    entries.filter((entry) => entry.data.book === book.id && !entry.data.draft),
  );
}

export function includesChapterType(
  configuredTypes: readonly ChapterType[],
  chapterType: ChapterType,
): boolean {
  return configuredTypes.includes(chapterType);
}

export function isCompletionEligible(
  book: BookDefinition,
  chapterType: ChapterType,
): boolean {
  return includesChapterType(
    book.completion.eligibleChapterTypes,
    chapterType,
  );
}

export function isSearchEligible(
  book: BookDefinition,
  chapterType: ChapterType,
): boolean {
  return (
    book.search.enabled &&
    includesChapterType(book.search.indexedChapterTypes, chapterType)
  );
}

export function isPrintEligible(
  book: BookDefinition,
  chapterType: ChapterType,
): boolean {
  return (
    book.print.enabled &&
    includesChapterType(book.print.includedChapterTypes, chapterType)
  );
}

export function toBookTocItems(
  entries: readonly BookEntryLike[],
  book: BookDefinition,
): BookTocItem[] {
  return sortBookChapters(entries).map(({ data }) => ({
    ...data,
    completionEligible: isCompletionEligible(book, data.chapterType),
  }));
}

export function bookHref(book: BookDefinition): string {
  return `/books/${book.slug}/`;
}

export function chapterHref(
  book: BookDefinition,
  chapterSlug: string,
): string {
  return `/books/${book.slug}/${chapterSlug}/`;
}

export function printHref(book: BookDefinition): string {
  return `/books/${book.slug}/print/`;
}
