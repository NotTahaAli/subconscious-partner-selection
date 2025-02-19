import { existsSync } from 'fs';
import { join } from 'path';

describe('Build Output', () => {
  const buildDir = join(process.cwd(), '.next');
  const expectedRoutes = ['/', '/compare', '/settings'];

  it('creates build directory', () => {
    expect(existsSync(buildDir)).toBe(true);
  });

  it('generates all expected routes', () => {
    // In Next.js app router, routes are compiled to HTML files
    expectedRoutes.forEach(route => {
      const htmlPath = join(buildDir, 'server/app', route === '/' ? 'page.js' : `${route.slice(1)}/page.js`);
      expect(existsSync(htmlPath)).toBe(true);
    });
  });
});