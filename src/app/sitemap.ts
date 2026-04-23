import { MetadataRoute } from 'next';
import { caseStudies } from '@/content/caseStudies';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.deopranav.com';
    const lastModified = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/work`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/reading`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/playground`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/escape`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ];

    const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
        url: `${baseUrl}/work/${cs.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...caseStudyRoutes];
}
