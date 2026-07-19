import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

const DISALLOW = [
  '/admin',
  '/api/',
  '/profile',
  '/checkout',
  '/auth/reset-password',
  '/*?*sort=',
  '/*?*filter=',
  '/*?*search=',
  '/*?*q=',
  '/*?*page=',
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: 'AhrefsBot', crawlDelay: 10 },
      { userAgent: 'MJ12bot', crawlDelay: 10 },
      { userAgent: 'SemrushBot', crawlDelay: 10 },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
