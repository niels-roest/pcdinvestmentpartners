const nunjucks = require('nunjucks');
const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const { globSync } = require('glob');

// ============================================
// Configuration
// ============================================
const SITE_URL = 'https://pcdinvestmentpartners.com';
const LANGUAGES = [
  { code: 'nl', hreflang: 'nl', label: 'Nederlands', prefix: '', rootPath: '', ogLocale: 'nl_NL' },
  { code: 'en', hreflang: 'en', label: 'English', prefix: '/en', rootPath: '../', ogLocale: 'en_US' },
  { code: 'es', hreflang: 'es', label: 'Español', prefix: '/es', rootPath: '../', ogLocale: 'es_ES' },
  { code: 'pt-br', hreflang: 'pt-BR', label: 'Português (BR)', prefix: '/pt-br', rootPath: '../', ogLocale: 'pt_BR' },
];
const DEFAULT_LANG = 'nl';
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

// ============================================
// 1. Clean dist/
// ============================================
console.log('Cleaning dist/...');
fs.emptyDirSync(DIST);

// ============================================
// 2. Copy static assets
// ============================================
console.log('Copying static assets...');
fs.copySync(path.join(__dirname, 'assets'), path.join(DIST, 'assets'));
fs.copySync(path.join(__dirname, 'css'), path.join(DIST, 'css'));
fs.copySync(path.join(__dirname, 'js'), path.join(DIST, 'js'));

const staticFiles = ['CNAME', '.nojekyll'];
for (const file of staticFiles) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copySync(src, path.join(DIST, file));
  }
}

// ============================================
// 3. Configure Nunjucks
// ============================================
const env = nunjucks.configure(path.join(SRC, 'templates'), {
  autoescape: false,
  noCache: true,
  throwOnUndefined: false,
});

// ============================================
// 4. Load i18n strings
// ============================================
console.log('Loading i18n strings...');
const i18nStrings = {};
for (const lang of LANGUAGES) {
  const filePath = path.join(SRC, 'i18n', `${lang.code}.json`);
  if (fs.existsSync(filePath)) {
    i18nStrings[lang.code] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    console.warn(`  Warning: No i18n file for ${lang.code}, falling back to ${DEFAULT_LANG}`);
    i18nStrings[lang.code] = i18nStrings[DEFAULT_LANG];
  }
}

// ============================================
// 4b. Load slug translations
// ============================================
console.log('Loading slug translations...');
const slugMap = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n', 'slugs.json'), 'utf8'));

function getSlugForLang(pageName, langCode) {
  if (langCode === DEFAULT_LANG) return pageName;
  if (slugMap[pageName] && slugMap[pageName][langCode]) {
    return slugMap[pageName][langCode];
  }
  return pageName;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// 5. Discover all NL pages (master list)
// ============================================
const nlPages = globSync('*.njk', { cwd: path.join(SRC, 'pages', DEFAULT_LANG) })
  .map(f => f.replace('.njk', ''));

console.log(`Found ${nlPages.length} pages to build.`);

// ============================================
// 6. Helper: Extract structured_data block
// ============================================
function extractStructuredData(content) {
  const blockStart = '{% block structured_data %}';
  const blockEnd = '{% endblock %}';

  const startIdx = content.indexOf(blockStart);
  if (startIdx === -1) {
    return { mainContent: content, structuredData: '' };
  }

  // Find the LAST {% endblock %} (the one that closes structured_data)
  const afterStart = content.substring(startIdx + blockStart.length);
  const endIdx = afterStart.lastIndexOf(blockEnd);

  if (endIdx === -1) {
    return { mainContent: content, structuredData: '' };
  }

  const mainContent = content.substring(0, startIdx).trim();
  const structuredData = afterStart.substring(0, endIdx).trim();

  return { mainContent, structuredData };
}

// ============================================
// 7. Build all pages
// ============================================
const sitemapEntries = [];
let totalPages = 0;

for (const lang of LANGUAGES) {
  console.log(`\nBuilding ${lang.code.toUpperCase()} pages...`);

  for (const pageName of nlPages) {
    // Check if translated version exists; fall back to NL
    let pageFile = path.join(SRC, 'pages', lang.code, `${pageName}.njk`);
    let usingFallback = false;
    if (!fs.existsSync(pageFile)) {
      pageFile = path.join(SRC, 'pages', DEFAULT_LANG, `${pageName}.njk`);
      usingFallback = true;
    }

    // Parse frontmatter + content
    const raw = fs.readFileSync(pageFile, 'utf8');
    const { data: frontmatter, content: rawContent } = matter(raw);

    // Extract structured data block from content
    const { mainContent, structuredData } = extractStructuredData(rawContent);

    // Determine output path
    const slug = frontmatter.slug !== undefined ? frontmatter.slug : pageName;
    const isIndex = slug === '' || slug === 'index';
    const translatedSlug = getSlugForLang(pageName, lang.code);

    let outputFile, canonicalPath;
    if (lang.code === DEFAULT_LANG) {
      outputFile = isIndex ? 'index.html' : `${pageName}.html`;
      canonicalPath = isIndex ? '/' : `/${pageName}`;
    } else {
      outputFile = path.join(lang.code, isIndex ? 'index.html' : `${translatedSlug}.html`);
      canonicalPath = isIndex ? `${lang.prefix}/` : `${lang.prefix}/${translatedSlug}`;
    }

    // Build hreflang alternatives
    const availableLanguages = LANGUAGES.map(altLang => {
      const altSlug = getSlugForLang(pageName, altLang.code);
      return {
        hreflang: altLang.hreflang,
        url: `${SITE_URL}${altLang.code === DEFAULT_LANG
          ? (isIndex ? '/' : `/${pageName}`)
          : (isIndex ? `${altLang.prefix}/` : `${altLang.prefix}/${altSlug}`)}`,
      };
    });

    // Build language switcher URLs
    const languageSwitchUrls = LANGUAGES.map(altLang => {
      const altSlug = getSlugForLang(pageName, altLang.code);
      return {
        code: altLang.code,
        hreflang: altLang.hreflang,
        label: altLang.label,
        url: altLang.code === DEFAULT_LANG
          ? (isIndex ? '/' : `/${pageName}`)
          : (isIndex ? `${altLang.prefix}/` : `${altLang.prefix}/${altSlug}`),
      };
    });

    // Build og_image with full URL
    const ogImage = frontmatter.og_image
      ? `${SITE_URL}/${frontmatter.og_image}`
      : `${SITE_URL}/assets/logo/pcd-logo-design-blauw-transparant-500x500.png`;

    // Template variables
    const templateVars = {
      t: i18nStrings[lang.code],
      lang: lang.code,
      langPrefix: lang.prefix,
      rootPath: lang.rootPath,
      canonical: `${SITE_URL}${canonicalPath}`,
      availableLanguages,
      languageSwitchUrls,
      currentLangLabel: lang.label,
      pageName,
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      og_image: ogImage,
      og_locale: lang.ogLocale,
    };

    // Render page content (may contain Nunjucks variables like {{ rootPath }}, {{ langPrefix }})
    const renderedContent = nunjucks.renderString(mainContent, templateVars);
    const renderedStructuredData = structuredData
      ? nunjucks.renderString(structuredData, templateVars)
      : '';

    // Render full page through layout
    const html = env.render('layouts/page.njk', {
      ...templateVars,
      content: renderedContent,
      structured_data: renderedStructuredData,
    });

    // Post-process: replace Dutch slugs with translated slugs in internal links
    let finalHtml = html;
    if (lang.code !== DEFAULT_LANG) {
      for (const [dutchSlug, translations] of Object.entries(slugMap)) {
        const translated = translations[lang.code];
        if (translated && translated !== dutchSlug) {
          // Replace href="[prefix]/[dutch-slug]" with translated slug
          finalHtml = finalHtml.replace(
            new RegExp(`(href=["']${escapeRegex(lang.prefix)}/)${escapeRegex(dutchSlug)}(?=["'#?])`, 'g'),
            `$1${translated}`
          );
        }
      }
    }

    // Write output
    const outputPath = path.join(DIST, outputFile);
    fs.ensureDirSync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, finalHtml);
    totalPages++;

    if (usingFallback && lang.code !== DEFAULT_LANG) {
      // Still generate the page with NL content but target language UI
    }

    // Track for sitemap (skip 404)
    if (pageName !== '404') {
      sitemapEntries.push({
        url: `${SITE_URL}${canonicalPath}`,
        lang: lang.code,
        lastmod: new Date().toISOString().split('T')[0],
        pageName,
        isIndex,
      });
    }
  }
}

// ============================================
// 8. Generate sitemap.xml
// ============================================
console.log('\nGenerating sitemap.xml...');

// Group pages by pageName to build proper alternates
const pageGroups = {};
for (const entry of sitemapEntries) {
  if (!pageGroups[entry.pageName]) {
    pageGroups[entry.pageName] = [];
  }
  pageGroups[entry.pageName].push(entry);
}

let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
sitemapXml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

for (const [pageName, entries] of Object.entries(pageGroups)) {
  for (const entry of entries) {
    sitemapXml += '    <url>\n';
    sitemapXml += `        <loc>${entry.url}</loc>\n`;
    sitemapXml += `        <lastmod>${entry.lastmod}</lastmod>\n`;

    // Add hreflang alternates
    for (const altEntry of entries) {
      const altLang = LANGUAGES.find(l => l.code === altEntry.lang);
      sitemapXml += `        <xhtml:link rel="alternate" hreflang="${altLang.hreflang}" href="${altEntry.url}"/>\n`;
    }
    // x-default points to NL version
    const nlEntry = entries.find(e => e.lang === DEFAULT_LANG);
    if (nlEntry) {
      sitemapXml += `        <xhtml:link rel="alternate" hreflang="x-default" href="${nlEntry.url}"/>\n`;
    }

    sitemapXml += '    </url>\n';
  }
}

sitemapXml += '</urlset>\n';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemapXml);

// ============================================
// 9. Generate robots.txt
// ============================================
console.log('Generating robots.txt...');
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robotsTxt);

// ============================================
// Done
// ============================================
console.log(`\nBuild complete! ${totalPages} pages generated in dist/`);
