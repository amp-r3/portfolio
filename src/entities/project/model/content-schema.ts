import { z } from 'zod';
import { projectIconKeys } from './icon-keys';

export const localizedStringSchema = z.object({
  en: z.string('English translation is required').min(1, 'English translation is required'),
  ru: z.string('Russian translation is required').min(1, 'Russian translation is required'),
  uz: z.string('Uzbek translation is required').min(1, 'Uzbek translation is required'),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;

export const projectSeoDescriptionSchema = z.object({
  en: z
    .string('English SEO description is required')
    .min(1, 'English SEO description is required')
    .max(160, 'English SEO description must be at most 160 characters'),
  ru: z
    .string('Russian SEO description is required')
    .min(1, 'Russian SEO description is required')
    .max(160, 'Russian SEO description must be at most 160 characters'),
  uz: z
    .string('Uzbek SEO description is required')
    .min(1, 'Uzbek SEO description is required')
    .max(160, 'Uzbek SEO description must be at most 160 characters'),
});

export const projectTypeSchema = z.enum(['personal', 'client', 'learning']);
export const projectStatusSchema = z.enum(['live', 'wip']);
export const projectRoleSchema = z.enum(['solo', 'team']);
export const projectStackGroupIdSchema = z.enum(['core', 'data', 'forms', 'tooling']);
export const projectIconSchema = z.enum(projectIconKeys);

export const projectPeriodSchema = z.object({
  start: z.number().int('Period start must be an integer'),
  end: z.number().int('Period end must be an integer').optional(),
});

export type ProjectPeriod = z.infer<typeof projectPeriodSchema>;

export const projectImageValueSchema = z.union([
  z.string().min(1, 'Image key cannot be empty'),
  z.object({
    light: z.string().min(1, 'Light image key is required'),
    dark: z.string().min(1, 'Dark image key is required'),
  }),
]);

export type ProjectImageValue = z.infer<typeof projectImageValueSchema>;

export const projectImagesContentSchema = z.object({
  desktop: projectImageValueSchema,
  mobile: projectImageValueSchema.optional(),
});

export type ProjectImagesContent = z.infer<typeof projectImagesContentSchema>;

export const projectLinksContentSchema = z.object({
  live: z.string().url('Invalid live demo URL').optional(),
  github: z.string().url('Invalid GitHub URL').optional(),
});

export type ProjectLinksContent = z.infer<typeof projectLinksContentSchema>;

export const projectStackGroupSchema = z.object({
  id: projectStackGroupIdSchema,
  items: z
    .array(z.string().min(1, 'Stack item cannot be empty'))
    .min(1, 'Stack group cannot be empty'),
});

export const projectStackContentSchema = z.object({
  primary: z
    .array(z.string().min(1, 'Primary stack item cannot be empty'))
    .min(1, 'Primary stack cannot be empty'),
  groups: z.array(projectStackGroupSchema).min(1, 'At least one stack group is required'),
});

export type ProjectStackContent = z.infer<typeof projectStackContentSchema>;

export const projectFeatureContentSchema = z.object({
  icon: projectIconSchema,
  text: localizedStringSchema,
});

export type ProjectFeatureContent = z.infer<typeof projectFeatureContentSchema>;

export const projectDeepDiveContentSchema = z.object({
  icon: projectIconSchema,
  title: localizedStringSchema,
  summary: localizedStringSchema,
  details: localizedStringSchema,
});

export type ProjectDeepDiveContent = z.infer<typeof projectDeepDiveContentSchema>;

export const projectTryItTitleSchema = z.object({
  en: z
    .string('English tryIt title is required')
    .min(1, 'English tryIt title is required')
    .max(32, 'English tryIt title must be at most 32 characters'),
  ru: z
    .string('Russian tryIt title is required')
    .min(1, 'Russian tryIt title is required')
    .max(32, 'Russian tryIt title must be at most 32 characters'),
  uz: z
    .string('Uzbek tryIt title is required')
    .min(1, 'Uzbek tryIt title is required')
    .max(32, 'Uzbek tryIt title must be at most 32 characters'),
});

export type ProjectTryItTitle = z.infer<typeof projectTryItTitleSchema>;

export const projectTryItContentSchema = z.object({
  title: projectTryItTitleSchema.optional(),
  text: localizedStringSchema,
});

export type ProjectTryItContent = z.infer<typeof projectTryItContentSchema>;

export const projectLimitationContentSchema = z.object({
  text: localizedStringSchema,
});

export const projectContentSchema = z
  .object({
    id: z.string().min(1, 'Project id is required'),
    order: z.number().int().positive('Order must be a positive integer'),
    // TODO: make type, status, period and role required once every project has this data.
    type: projectTypeSchema.optional(),
    status: projectStatusSchema.optional(),
    period: projectPeriodSchema.optional(),
    role: projectRoleSchema.optional(),
    title: localizedStringSchema,
    tagline: localizedStringSchema,
    seo: z.object({
      description: projectSeoDescriptionSchema,
    }),
    links: projectLinksContentSchema,
    images: projectImagesContentSchema,
    stack: projectStackContentSchema,
    features: z
      .array(projectFeatureContentSchema)
      .max(6, 'A project can have at most 6 key features'),
    deepDive: z
      .array(projectDeepDiveContentSchema)
      .max(5, 'A project can have at most 5 deep dive entries'),
    tryIt: z
      .array(projectTryItContentSchema)
      .max(3, 'A project can have at most 3 "Try it" items')
      .optional(),
    limitations: z
      .array(projectLimitationContentSchema)
      .max(4, 'A project can have at most 4 known limitations')
      .optional(),
  })
  .superRefine((project, ctx) => {
    const groupedItems = new Set(project.stack.groups.flatMap((group) => group.items));
    const missing = project.stack.primary.filter((item) => !groupedItems.has(item));

    if (missing.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['stack', 'primary'],
        message: `Every primary stack item must be present in stack.groups. Missing: ${missing.join(', ')}`,
      });
    }
  });

export type ProjectContentRaw = z.infer<typeof projectContentSchema>;
