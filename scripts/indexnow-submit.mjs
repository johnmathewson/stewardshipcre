// scripts/indexnow-submit.mjs
//
// Pings IndexNow with every URL in our production sitemap. IndexNow is
// consumed by Bing, Yandex, Naver, Seznam, and several others — Google
// does NOT consume it (they have their own crawler). Run after deploying
// new SEO pages to get instant indexing on the IndexNow-supporting engines.
//
// Usage: npm run indexnow
//
// Auth: a one-time key is published as a static file in public/. IndexNow
// fetches that file to verify any request signed with the same key.

const KEY = 'db9db8232fc31b286df37e4f5239179d';
const HOST = 'stewardshipcre.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

async function main() {
  console.log(`→ Fetching sitemap from ${SITEMAP_URL}`);
  const sitemapRes = await fetch(SITEMAP_URL);
  if (!sitemapRes.ok) {
    throw new Error(`Sitemap fetch failed: HTTP ${sitemapRes.status}`);
  }
  const xml = await sitemapRes.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (urls.length === 0) {
    throw new Error('No URLs found in sitemap.');
  }

  console.log(`→ Found ${urls.length} URLs in sitemap`);
  console.log(`→ Verifying key file is reachable at ${KEY_LOCATION}`);
  const keyRes = await fetch(KEY_LOCATION);
  if (!keyRes.ok) {
    throw new Error(
      `Key file not reachable at ${KEY_LOCATION} (HTTP ${keyRes.status}). Has the deploy with the key file completed?`
    );
  }
  const keyContent = (await keyRes.text()).trim();
  if (keyContent !== KEY) {
    throw new Error(`Key file content mismatch. Expected "${KEY}" got "${keyContent}".`);
  }
  console.log(`✓ Key file verified`);

  console.log(`→ Submitting ${urls.length} URLs to IndexNow`);
  const submitRes = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });

  const responseText = await submitRes.text().catch(() => '');
  console.log(`← IndexNow responded HTTP ${submitRes.status} ${submitRes.statusText}`);
  if (responseText.trim()) {
    console.log(`  Body: ${responseText.trim()}`);
  }

  // IndexNow returns 200/202 for success, 4xx for problems.
  if (submitRes.status === 200 || submitRes.status === 202) {
    console.log(`✓ ${urls.length} URLs submitted to IndexNow.`);
    console.log(`  Bing, Yandex, Naver, Seznam and other IndexNow-consuming engines will index within minutes to hours.`);
    console.log(`  Google does NOT consume IndexNow — request indexing manually in Google Search Console for those.`);
    process.exit(0);
  } else {
    console.error(`✗ Unexpected response. Common causes:`);
    console.error(`  - 400: malformed request body`);
    console.error(`  - 403: key file not found at keyLocation, or key mismatch`);
    console.error(`  - 422: at least one URL not on the host (${HOST})`);
    console.error(`  - 429: rate limited (try again later, in smaller batches)`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});
