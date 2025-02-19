import { existsSync } from 'fs';
import { join } from 'path';

describe('Build Output', () => {
  const buildDir = join(process.cwd(), '.next');
  const expectedRoutes = ['/', '/compare', '/settings'];

  it('creates build directory', () => {
    expect(existsSync(buildDir)).toBe(true);
  });

  it('generates all expected routes', () => {
    expectedRoutes.forEach(route => {
      // Check if either the static HTML or server bundle exists
      const serverPath = join(buildDir, 'server/app', route === '/' ? 'page.js' : `${route.slice(1)}/page.js`);
      const staticPath = join(buildDir, 'static/chunks/app', route === '/' ? 'page.js' : `${route.slice(1)}/page.js`);
      
      expect(existsSync(serverPath) || existsSync(staticPath)).toBe(true);
    });
  });
});