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
  'NzUzNTI0ODM5': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOS0wN1QxOTo0MTowMCswNTozMCJ9',
  'OTIzODI0NzQx': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0zMFQwMDowMDowMCswNTozMCJ9',
  'NTE0NTY0NDc4Ng==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOS0wN1QwMDowMDowMCswNTozMCJ9',
  'MTkxODMwMTkxNA==': 'eyJleHBcimF0aW9uIjoiMjAyNS0wOC0wM1QwMDowMDowMCswNTozMCJ9',
  'Mjg4MjQyNTI1': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNS0wMVQwMDowMDowMCswNTozMCJ9',
  'MjEzODQxODg2OQ==': 'eyJleHBcimF0aW9uIjoiMjAyNi0wNS0wMVQwMDowMDowMCswNTozMCJ9',
  'MTcxMDg4NDE0OA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MTcyMTAyODI4': 'eyJleHBcimF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjMyODExMTUzMw==': 'eyJleHBcimF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'OTA4MzQ5NTM2': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'NDAxMjkzNTg3': 'eyJleHBcimF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjExNDA2NDAxNA==': 'eyJleHBcimF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjkwOTg3NTcyNQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0xMlQwMDowMDowMCswNTozMCJ9',
  'MTQxOTQ2NjI3Mg==': 'eyJleHBcimF0aW9uIjoiMjAyNS0wNy0xMlQwMDowMDowMCswNTozMCJ9',
  'MzI4MzEwODcxMg==': 'eyJleHBpcmF0aW9uIjoiMjAyOC0wNC0xNFQxMjowMDowMCswNTozMCJ9',
  'MTE1MzE4NjE4MA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0xNVQwMDowMDowMCswNTozMCJ9'
};


let skipAnimations = true;

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    skipAnimations = true;
  }
});

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
  const apiPath = p1.c.map(atob).join('');
  return base + apiPath + '?uid=' + encodeURIComponent(id);
}

async function f1(id) {
  try {
    const res = await fetch(g4(id));
    if (!res.ok) {
      console.log('Fetch failed with status', res.status);
      return 'Unknown';
    }
    const d = await res.json();
    console.log('API response for f1:', d);  // Debug log
    return d.response?.PlayerNickname || 'Unknown';
  } catch (e) {
    console.log('Fetch error:', e);
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

function sleep(ms) {
  if (skipAnimations) return Promise.resolve();
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendLike() {
  const input = document.getElementById('custom-uid');
  const respDiv = document.getElementById('response-custom');
  const btn = document.getElementById('send-button');
  const uid = input.value.trim();
  const now = new Date();
  const reg = g2();

  respDiv.innerHTML = "";

  if (!/^\d+$/.test(uid)) {
    respDiv.innerHTML = `
      <div class="response-error animate-fade-in">
        <div class="response-text">Oops! 😅 That doesn't look like a valid UID. Please enter numbers only.</div>
        <button onclick="copyResponse(this)" class="copy-button mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-4 rounded transition duration-200">
          Copy Response
        </button>
      </div>`;
    return;
  }

  btn.disabled = true;
  input.disabled = true;

  if (!reg[uid]) {
    respDiv.innerHTML = `
      <div class="response-error animate-fade-in">
        <div class="response-text">Hmm... 🤔 Looks like you're not registered yet. Give it a try after registering!</div>
        <button onclick="copyResponse(this)" class="copy-button mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-4 rounded transition duration-200">
          Copy Response
        </button>
      </div>`;

    btn.disabled = false;
    input.disabled = false;
    return;
  }

  const { e } = reg[uid];
  if (now > e) {
    respDiv.innerHTML = `
      <div class="response-error animate-fade-in">
        <div class="response-text">Hey! 👋 Your registration has expired. Let’s get you renewed and back in action! 💫</div>
        <button onclick="copyResponse(this)" class="copy-button mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-4 rounded transition duration-200">
          Copy Response
        </button>
      </div>`;

    btn.disabled = false;
    input.disabled = false;
    return;
  }

  btn.textContent = 'Sending...';
  respDiv.innerHTML = `
    <div class="flex items-center justify-center p-4">
      <div class="spinner"></div>
    </div>`;

  try {
    const res = await fetch(g3(uid));
    const dt = await res.json();

    if (dt.status === 3) {
      const daysRemaining = g5(e);
      const expStr = e.toLocaleString('en-US', { 
        timeZone: 'Asia/Colombo', 
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true 
      });

      respDiv.innerHTML = `
        <div class="response-warning animate-fade-in space-y-3 text-yellow-600">
          <div class="response-text text-lg font-semibold mb-2">${dt.message}</div>
          <div class="space-y-1 text-yellow-500 text-sm">
            <p>⏳ You’ve hit your like limit for now, but no worries!</p>
            <p>📅 Your registration is still active for <strong>${daysRemaining}</strong> day${daysRemaining !== 1 ? 's' : ''}.</p>
            <p>🕒 Try again after 1:30 AM Sri Lankan time and keep the love going. 💖</p>
            <p>💡 Pro Tip: Consistency = growth!</p>
          </div>
          <button onclick="copyResponse(this)" class="copy-button mt-4 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-4 rounded transition duration-200">
            Copy Response
          </button>
        </div>`;
      
    } else if (dt.status === 1 && dt.response) {
      const nick = await f1(uid);
      const days = g5(e);

      respDiv.innerHTML = `
        <div class="response-success animate-success">
          <div class="flex items-center justify-center mb-4">
            <div class="checkmark"></div>
          </div>
            <div class="response-text text-green-700" style="line-height: 1.5;">
              <p style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.6em;">
                🎉 Like sent successfully!
              </p>
              <p>👤 <strong>Player:</strong> <strong>${nick}</strong></p>
              <p>🆔 <strong>UID:</strong> <strong>${dt.response.UID}</strong></p>
              <p>🚀 <strong>Level:</strong> <strong>${dt.response.PlayerLevel}</strong></p>
              <p>❤️ <strong>Likes Given:</strong> <strong id="likes-count">0</strong></p>
              <p>🔄 <strong>Likes Before → After:</strong> <strong>${dt.response.LikesbeforeCommand} → ${dt.response.LikesafterCommand}</strong></p>
              <p>📅 <strong>Days Left:</strong> <strong>${days} day${days !== 1 ? 's' : ''}</strong></p>
              <p>✅ <strong>Status:</strong> <strong>All good!</strong></p>
            </div>
          <button onclick="copyResponse(this)" class="copy-button mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-4 rounded transition duration-200">
            Copy Response
          </button>
        </div>`;
      animateCounter("likes-count", dt.response.LikesGivenByAPI);

    } else {
      respDiv.innerHTML = `
        <div class="response-error animate-fade-in">
          <div class="response-text">Uh oh 😕 Something went wrong. Please try again in a bit!</div>
          <button onclick="copyResponse(this)" class="copy-button mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-4 rounded transition duration-200">
            Copy Response
          </button>
        </div>`;
    }
  } catch (err) {
    respDiv.innerHTML = `
      <div class="response-error animate-fade-in">
        <div class="response-text">Whoops! 😓 An error occurred: ${err.message}</div>
        <button onclick="copyResponse(this)" class="copy-button mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-4 rounded transition duration-200">
          Copy Response
        </button>
      </div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Like';
    input.disabled = false;
  }
}

function colorizeDays(days) {
  const value = `<strong>${days}</strong>`;
  if (days < 10) return `<span style="color:red;font-weight:bold">${value}</span>`;
  if (days >= 10 && days <= 25) return `<span style="color:yellow;font-weight:bold">${value}</span>`;
  return `<span style="color:lime;font-weight:bold">${value}</span>`;
}

function copyResponse(btn) {
  const container = btn.closest('#response-custom');
  if (!container) {
    console.error('Response container not found');
    return;
  }
  const resp = container.querySelector('.response-text');
  if (!resp) {
    console.error('Response text not found');
    return;
  }

  const txt = resp.textContent.trim();
  if (!txt) {
    console.warn('No text to copy');
    return;
  }

  btn.disabled = true;

  navigator.clipboard.writeText(txt)
    .then(() => {
      btn.textContent = 'Copied!';
      btn.style.backgroundColor = '#22c55e';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = 'Copy Response';
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 2000);
    })
    .catch((err) => {
      console.error('Copy failed:', err);
      btn.disabled = false;
    });
}


const backgrounds = [
  "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20256/3fe7feec69108f571f70f3be93a84752.jpg",
  "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20255/792f0508b08f3f324bd37eefcd07e2ed.jpg",
  "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20257/8f6e52a93de5d9b1a3d7ee40a2b6c2b7.jpg",
  "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20257/ffa91215eddb0386c037ce126e597a99.jpg"
];
let bgIndex = 0;
const body = document.body;

function switchBackground() {
  bgIndex = (bgIndex + 1) % backgrounds.length;
  body.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
  const delay = Math.floor(Math.random() * 5000) + 5000;
  setTimeout(switchBackground, delay);
}

window.addEventListener('DOMContentLoaded', () => {
  body.style.backgroundImage = `url('${backgrounds[0]}')`;
  setTimeout(switchBackground, 5000);
  window.sendLike = sendLike;
  window.copyResponse = copyResponse;
});
