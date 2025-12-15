const fs = require('fs');
const path = require('path');

const generateSitemap = async () => {
  const routes = [
    '/',
    '/map',
    '/schedule',
    '/announcements',
  ];

  // Change this to your domain
  const domain = 'https://your-domain.com';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${route === '/' ? '1.00' : '0.80'}</priority>
  </url>`).join('')}
</urlset>`;

  const publicPath = path.resolve(__dirname, 'public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap, 'utf8');

  console.log('sitemap.xml has been generated successfully in the public folder!');
};

generateSitemap();
