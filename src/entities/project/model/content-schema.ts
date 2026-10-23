import { z } from 'zod';

export const localizedStringSchema = z.object({
  en: z.string().min(1, 'English translation is required'),
  ru: z.string().min(1, 'Russian translation is required'),
  uz: z.string().min(1, 'Uzbek translation is required'),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;

export const projectBenefitContentSchema = z.object({
  icon: z.string().min(1, 'Benefit icon key is required'),
  title: localizedStringSchema,
  description: localizedStringSchema,
});

export type ProjectBenefitContent = z.infer<typeof projectBenefitContentSchema>;

export const projectLinksContentSchema = z.object({
  live: z.string().url('Invalid live demo URL'),
  github: z.string().url('Invalid GitHub URL'),
});

export type ProjectLinksContent = z.infer<typeof projectLinksContentSchema>;

export const projectImagesContentSchema = z.object({
  light: z.string().min(1, 'Light image key is required'),
  dark: z.string().optional(),
  mobileLight: z.string().optional(),
  mobileDark: z.string().optional(),
});

export type ProjectImagesContent = z.infer<typeof projectImagesContentSchema>;

export const projectContentSchema = z.object({
  id: z.string().min(1, 'Project id is required'),
  order: z.number().int().positive('Order must be a positive integer'),
  title: z.union([
    z.string().min(1),
    localizedStringSchema,
  ]),
  description: localizedStringSchema,
  technologies: z.array(z.string().min(1)).min(1, 'Technologies list cannot be empty'),
  links: projectLinksContentSchema,
  images: projectImagesContentSchema,
  benefits: z.array(projectBenefitContentSchema).min(1, 'Benefits list cannot be empty'),
});

export type ProjectContentRaw = z.infer<typeof projectContentSchema>;
