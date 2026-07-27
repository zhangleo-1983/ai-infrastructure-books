import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { chapterTypes } from "./data/books";

const chapters = defineCollection({
  loader: glob({
    base: "./src/content/books",
    pattern: "**/*.mdx",
    generateId: ({ entry }) => entry.replace(/\.mdx?$/i, ""),
  }),
  schema: z.object({
    book: z.string(),
    order: z.number().int().nonnegative(),
    slug: z.string(),
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    chapterType: z.enum(chapterTypes),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sourceAnchor: z.string().optional(),
    chapterNumber: z.number().int().positive().optional(),
    duration: z.string().optional(),
    labels: z.array(z.string()).default([]),
    completionId: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { chapters };
