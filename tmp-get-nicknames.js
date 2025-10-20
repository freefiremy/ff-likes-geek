const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('app/page.js', 'utf8');
const match = source.match(/const murkyLedger = (\{[\s\S]*?\});/);
if (!match) {
  console.error('Unable to locate murkyLedger');
  process.exit(1);
}
const ledger = vm.runInNewContext('(' + match[1] + ')');
const uids = Object.keys(ledger).map((key) => Buffer.from(key, 'base64').toString('utf8'));
const regions = ['SG', 'BD', 'IN', 'ID', 'BR', 'US', 'EU', 'ME', 'RU', 'TH', 'VN', 'TW'];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sanitizeNickname = (input) => {
  if (!input) {
    return 'Unknown';
  }
  try {
    const normalized = input.normalize('NFKC').replace(/[\u0000-\u001F\u007F-\u009F]+/g, '').trim();
    return normalized || 'Unknown';
  } catch (error) {
    const cleaned = input.replace(/[\u0000-\u001F\u007F-\u009F]+/g, '').trim();
    return cleaned || 'Unknown';
  }
};

(async () => {
  const results = [];
  for (const uid of uids) {
    let record = null;
    const errors = [];
    for (const region of regions) {
      const url = 'https://accinfo.vercel.app/player-info?region=' + encodeURIComponent(region) + '&uid=' + encodeURIComponent(uid);
      try {
        const response = await fetch(url, {
          headers: {
            'user-agent': 'Mozilla/5.0 (compatible; CodexBot/1.0)',
          },
        });
        if (!response.ok) {
          errors.push(region + ':' + response.status);
          await delay(200);
          continue;
        }
        const data = await response.json();
        const nicknameRaw = data && data.basicInfo ? data.basicInfo.nickname : null;
        const nickname = sanitizeNickname(nicknameRaw);
        const resolvedRegion = data && data.basicInfo && data.basicInfo.region ? data.basicInfo.region : region;
        if (nickname && nickname !== 'Unknown') {
          record = { uid, nickname, region: resolvedRegion };
          break;
        }
        errors.push(region + ':empty-nickname');
      } catch (error) {
        errors.push(region + ':' + error.message);
      }
      await delay(200);
    }
    if (!record) {
      record = { uid, nickname: 'Unknown', region: null, error: errors.join(', ') || 'unknown' };
    }
    results.push(record);
    await delay(200);
  }
  console.log(JSON.stringify(results, null, 2));
})();
