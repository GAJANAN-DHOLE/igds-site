import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const insights = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    sector: z.enum(['Medical', 'Agriculture']),
    summary: z.string().max(220),
    order: z.number().int(),
    readMinutes: z.number().int().positive(),
  }),
});

export const collections = { insights };
