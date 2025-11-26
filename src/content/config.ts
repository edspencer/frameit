import { defineCollection, z } from 'astro:content'

const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    publishDate: z.date(),
    author: z.string().default('FrameIt Team'),
    tags: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    lastUpdated: z.date().optional(),
    order: z.number().optional(),
  }),
})

export const collections = {
  guides: guidesCollection,
}
