const x1 = 'YXN0dXRlMmsz';
const p1 = {
  a: ['aHR0cHM6Ly9saWtlcy4=', 'YXBpLmZyZWVmaXJl', 'b2ZmaWNpYWwuY29tL2FwaS9zZy8='],
  b: ['aHR0cHM6Ly9hcGku', 'YWxsb3JpZ2lucy53aW4=', 'L3Jhdz91cmw9'],
  c: ['aHR0cHM6Ly9ub2RlanMt', 'aW5mby52ZXJjZWVsLmFwcC8=', 'L2luZm8=']
};
const d1 = {
  'NjY3MzUyNjc4': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'MjgwNTM2NTcwMg==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'MjUwNjE0OTg4MA==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'MjA1MjU4MDEzMg==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'Mjg3NDI5MDk2NQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'MTg5NTAyODg1NA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0xNlQxMjoyNzowMCswNTozMCJ9',
  'MzY1NDM2Njk2': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0zMVQxOTo0MTowMCswNTozMCJ9',
  'NzUzNTI0ODM5': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wMVQxOTo0MTowMCswNTozMCJ9'
};

function g1() {
  return atob(x1);
}
function g2() {
  const r = {};
  for (const k in d1) {
    const id = atob(k);
    const dt = JSON.parse(atob(d1[k]));
    r[id] = { e: new Date(dt.expiration) };
  }
  return r;
}
function g3(id) {
  return p1.a.map(atob).join('') + id + '?key=' + encodeURIComponent(g1());
}
function g4(id) {
  const base = p1.b.map(atob).join('');
  const api = p1.c.map(atob).join('') + `?uid=${id}`;
  return base + encodeURIComponent(api);
}
async function f1(id) {
  try {
    const res = await fetch(g4(id));
    if (!res.ok) return 'Unknown';
    const d = await res.json();
    return d?.data?.player_info?.nikname || 'Unknown';
  } catch {
    return 'Unknown';
  }
}
function g5(e) {
  const n = new Date();
  return Math.max(0, Math.ceil((e - n) / (1000 * 60 * 60 * 24)));
}

function animateCounter(id, toValue) {
  const el = document.getElementById(id);
  if (!el) return;
  let count = 0;
  const duration = 1000;
  const step = Math.ceil(toValue / (duration / 16));

  const updater = () => {
    count += step;
    if (count >= toValue) {
      el.textContent = toValue;
    } else {
      el.textContent = count;
      requestAnimationFrame(updater);
    }
  };
  requestAnimationFrame(updater);
}

async function sendLike() {
  const input = document.getElementById('custom-uid');
  const respDiv = document.getElementById('response-custom');
  const btn = document.getElementById('send-button');
  const uid = input.value.trim();
  const now = new Date();
  const reg = g2();

  respDiv.innerHTML = `<div class="flex items-center justify-center p-4"><div class="spinner"></div></div>`;

  if (!/^\d+$/.test(uid)) {
    respDiv.innerHTML = `<div class="response-error animate-fade-in">Oops! 😔 Please enter a valid numeric UID!</div>`;
    return;
  }
  if (!reg[uid]) {
    respDiv.innerHTML = `<div class="response-error animate-fade-in">You're not registered yet... 😔</div>`;
    return;
  }

  const { e } = reg[uid];
  if (now > e) {
    respDiv.innerHTML = `<div class="response-error animate-fade-in">Your registration has expired. Please renew! 💕</div>`;
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';
  input.disabled = true;

  try {
    const res = await fetch(g3(uid));
    const dt = await res.json();

    if (dt.status === 1 && dt.response) {
      const nick = await f1(uid);
      const days = g5(e);
      respDiv.innerHTML = `
        <div class="response-success animate-success">
          <div class="flex items-center justify-center mb-4"><div class="checkmark"></div></div>
          <div class="response-text space-y-2">
            🔹 <strong>Player:</strong> ${nick}<br>
            🔸 <strong>UID:</strong> ${dt.response.UID}<br>
            🆙 <strong>Level:</strong> ${dt.response.PlayerLevel}<br>
            ❤️ <strong>Given:</strong> <span id="likes-count">0</span><br>
            🔢 <strong>Before→After:</strong> ${dt.response.LikesbeforeCommand} → ${dt.response.LikesafterCommand}<br>
            📅 <strong>Days Left:</strong> ${days} day${days !== 1 ? 's' : ''}<br>
            ✅ <strong>Status:</strong> Success
          </div>
          <button onclick="copyResponse()" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
        </div>`;
      animateCounter("likes-count", dt.response.LikesGivenByAPI);
    } else if (dt.status === 3) {
      const days = g5(e);
      respDiv.innerHTML = `<div class="response-warning animate-fade-in">
        🔸 <strong>UID:</strong> ${uid}<br>
        ⚠️ ${dt.message}<br>
        📅 Days Left: ${days} day${days !== 1 ? 's' : ''}
        <br><button onclick="copyResponse()" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
      </div>`;
    } else {
      respDiv.innerHTML = `<div class="response-error animate-fade-in">Something went wrong, please try again later.</div>`;
    }
  } catch (err) {
    respDiv.innerHTML = `<div class="response-error animate-fade-in">Error: ${err.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Like';
    input.disabled = false;
  }
}

function copyResponse() {
  const resp = document.querySelector('#response-custom .response-text');
  if (!resp) return;
  const txt = resp.innerText.trim();
  navigator.clipboard.writeText(txt)
    .then(() => {
      const btn = document.querySelector('.copy-button');
      btn.textContent = 'Copied!';
      btn.classList.replace('bg-gray-600', 'bg-green-500');
      setTimeout(() => {
        btn.textContent = 'Copy Response';
        btn.classList.replace('bg-green-500', 'bg-gray-600');
      }, 2000);
    })
    .catch(() => console.error('Copy failed'));
}

window.sendLike = sendLike;
window.copyResponse = copyResponse;
