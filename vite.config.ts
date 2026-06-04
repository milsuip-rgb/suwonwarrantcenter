import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

function generateSeoHtmlPlugin() {
  return {
    name: 'generate-seo-html',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      
      if (!fs.existsSync(indexPath)) return;
      
      const homeHtml = fs.readFileSync(indexPath, 'utf-8');
      
      const routes = [
        {
          path: 'cases',
          title: '성공사례 | 수원지방법원 영장실질심사 전담',
          description: '수원 영장실질심사, 구속적부심 성공사례 모음. 보이스피싱, 마약, 성범죄 등 다수의 무죄, 집행유예, 기각 사례를 확인하세요.',
          canonical: 'https://suwonwarrantcenter.com/cases'
        },
        {
          path: 'lawyer',
          title: '변호사 소개 | 수원지방법원 형사전문변호사',
          description: '수원 영장실질심사 전담 변호사. 대표 변호사가 강력 사건을 직접 전담하며 구속 위기에서 구출해 드립니다.',
          canonical: 'https://suwonwarrantcenter.com/lawyer'
        },
        {
          path: 'process',
          title: '업무 프로세스 | 수원지방법원 체포·구속영장 실시간 대응',
          description: '체포부터 구속영장 실질심사까지. 수원지방법원 형사전문변호사의 체계적이고 신속한 24시간 방어 프로세스를 안내합니다.',
          canonical: 'https://suwonwarrantcenter.com/process'
        },
        {
          path: 'contact',
          title: '상담안내 | 24시간 긴급 법률상담',
          description: '수원 영장실질심사, 구속적부심 상담. 언제든 전문가와 빠르게 논의하세요. 24시간 연중무휴 변호사 직접 상담.',
          canonical: 'https://suwonwarrantcenter.com/contact'
        }
      ];

      for (const route of routes) {
        const routeDir = path.join(distDir, route.path);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        
        let routeHtml = homeHtml;
        
        // Replace Title
        routeHtml = routeHtml.replace(
          /<title>.*?<\/title>/,
          `<title>${route.title}</title>`
        );
        
        // Replace Description
        routeHtml = routeHtml.replace(
          /<meta name="description" content=".*?"(?: \/>|>)/,
          `<meta name="description" content="${route.description}" />`
        );
        
        // Replace Canonical
        routeHtml = routeHtml.replace(
          /<link rel="canonical" href=".*?"(?: \/>|>)/,
          `<link rel="canonical" href="${route.canonical}" />`
        );
        
        // Replace OG URL
        routeHtml = routeHtml.replace(
          /<meta property="og:url" content=".*?"(?: \/>|>)/,
          `<meta property="og:url" content="${route.canonical}" />`
        );

        fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml);
        console.log(`Generated SEO HTML for /${route.path}`);
      }
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), generateSeoHtmlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
