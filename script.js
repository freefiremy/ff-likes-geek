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
  'MjA1MjU4MDEzMg==': 'eyJleHBpcmF0aWluIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9', 
  'Mjg3NDI5MDk2NQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9', 
  'MTg5NTAyODg1NA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0xNlQxMjoyNzowMCswNTozMCJ9', 
  'MzY1NDM2Njk2': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0zMVQxOTo0MTowMCswNTozMCJ9', 
  'NzUzNTI0ODM5': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wMVQxOTo0MTowMCswNTozMCJ9', 
  'OTIzODI0NzQx': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0zMFQwMDowMDowMCswNTozMCJ9', 
  'NTE0NTY0NDc4Ng==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wN1QwMDowMDowMCswNTozMCJ9' ,
  'MTkxODMwMTkxNA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wM1QwMDowMDowMCswNTozMCJ9',
  'Mjg4MjQyNTI1': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNS0wMVQwMDowMDowMCswNTozMCJ9',
  'MjEzODQxODg2OQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNS0wMVQwMDowMDowMCswNTozMCJ9',
  'MTcxMDg4NDE0OA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9'

};



let skipAnimations = false;

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    skipAnimations = true;
  }
});


// ========== BASIC HELPERS ==========
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

// Utility sleep function
function sleep(ms) {
  if (skipAnimations) return Promise.resolve();
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ========== DARK MODE & HACKER MESSAGE SEQUENCE ==========

// Formatted multi-line hacker messages
const hackerMessages = [
  "Hmmm... why is it so hard to send Likes?",
  "Looks like you haven't registered your UID yet.",
  "This UID doesn't exist in our secure vault.",
  "🔍 Searching Free Fire likes registry...",
  "❌ UID not found. Try again with a correct ID."
];

// Optional: auto-wrap long messages (used below)
function formatMessage(msg, maxLen = 40) {
  const words = msg.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + word).length > maxLen) {
      lines.push(line.trim());
      line = '';
    }
    line += word + ' ';
  }
  if (line.trim()) lines.push(line.trim());
  return lines.join('\n');
}

// Show the dark overlay, creating or reusing it
function createDarkOverlay() {
  let overlay = document.getElementById("dark-overlay");
  let textDiv = document.getElementById("hacker-text");

  // If overlay doesn't exist, create it
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "dark-overlay";
    overlay.className = "fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-1000";
    overlay.style.padding = '0';
    overlay.style.pointerEvents = 'auto';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.98)'; // FULL DARK
    document.body.appendChild(overlay);
  } else {
    // Reset dark background in case it's transparent from loading
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
  }

  // If hacker-text doesn't exist, create and append it
  if (!textDiv) {
    textDiv = document.createElement("div");
    textDiv.id = "hacker-text";
    textDiv.className = "text-green-400 font-mono text-base sm:text-lg leading-relaxed whitespace-pre-wrap text-left p-4 max-w-[90vw]";
    overlay.appendChild(textDiv);
  }

  // Reset styles and text
  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'auto';
  textDiv.textContent = '';

  return textDiv;
}




// Typewriter effect for hacker text
async function typeMessage(container, message) {
  container.textContent = "";
  if (skipAnimations) {
    container.textContent = message; // instantly show full message
  } else {
    for (let i = 0; i < message.length; i++) {
      container.textContent += message.charAt(i);
      await sleep(40);
    }
  }
}


// Show hacker message sequence
async function showHackerSequence() {
  const hackerText = createDarkOverlay(); // returns text box inside overlay
  for (const msg of hackerMessages) {
    await typeMessage(hackerText, formatMessage(msg));
    await sleep(2000);
  }
  await sleep(3000);

  const overlay = hackerText.parentElement;
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.98)'; // keep background fully dark after fade
  hackerText.textContent = '';
  skipAnimations = false;

}




// Show max likes reached sequence with days remaining and expiration info
async function showMaxLikesSequence(expirationDate, message) {
  const hackerText = createDarkOverlay();


  const now = new Date();
  const daysRemaining = g5(expirationDate);
  const expStr = expirationDate.toLocaleString('en-US', { 
    timeZone: 'Asia/Colombo', 
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true 
  });

  const lines = [
    message,
    `Days until registration expires: ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`,
    `Expiration date/time (Sri Lanka): ${expStr}`,
    "Try again after 1:30 AM Sri Lankan time ⏰",
    "Or maybe many others already liked your profile...",
    "Come back tomorrow to send more Likes!"
  ];

  for (const line of lines) {
    await typeMessage(hackerText, line); //show in red (error)
    await sleep(1800);
  }

  await sleep(2000);
  hackerText.parentElement.style.opacity = '0';
  hackerText.parentElement.style.pointerEvents = 'none';
  hackerText.textContent = '';

  skipAnimations = false;

}

// Show loading spinner overlay for n ms
async function showLoadingOverlay(duration = 2500) {
  const hackerText = createDarkOverlay();
  const overlay = hackerText.parentElement;
  hackerText.textContent = '';

  // Remove any existing spinner first
  const oldSpinner = overlay.querySelector(".spinner");
  if (oldSpinner) oldSpinner.remove();

  // Add spinner element
  const spinner = document.createElement('div');
  spinner.className = 'spinner'; // make sure spinner CSS is defined
  overlay.appendChild(spinner);

  await sleep(duration);

  overlay.style.opacity = '0';
  overlay.style.backgroundColor = 'rgba(0,0,0,100)';
  await sleep(1000);
  overlay.style.pointerEvents = 'none';

  // Clean up spinner but keep the hacker-text
  const newSpinner = overlay.querySelector(".spinner");
  if (newSpinner) newSpinner.remove();
  hackerText.textContent = '';
}


// ========== MAIN FUNCTION ==========
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
    <div class="response-text">Oops! 😔 Please enter a valid numeric UID!</div>
    <button onclick="copyResponse(this)" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
  </div>`;

    return;
  }

  btn.disabled = true;
  input.disabled = true;

  await showLoadingOverlay(2500);

  if (!reg[uid]) {
    await showHackerSequence();
    respDiv.innerHTML = `
  <div class="response-error animate-fade-in">
    <div class="response-text">You're not registered yet... 😔</div>
    <button onclick="copyResponse(this)" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
  </div>`;

    btn.disabled = false;
    input.disabled = false;
    return;
  }

  const { e } = reg[uid];
  if (now > e) {
    respDiv.innerHTML = `
  <div class="response-error animate-fade-in">
    <div class="response-text">Your registration has expired. Please renew! 💕</div>
    <button onclick="copyResponse(this)" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
  </div>`;


    btn.disabled = false;
    input.disabled = false;
    return;
  }

  btn.textContent = 'Sending...';
  respDiv.innerHTML = `<div class="flex items-center justify-center p-4"><div class="spinner"></div></div>`;

  try {
    const res = await fetch(g3(uid));
    const dt = await res.json();

    if (dt.status === 3) {
      // Max likes reached: show full hacker messages with details
      await showLoadingOverlay(2000);
      await showMaxLikesSequence(e, dt.message);

      // Also show in normal response box
      const daysRemaining = g5(e);
      const expStr = e.toLocaleString('en-US', { 
        timeZone: 'Asia/Colombo', 
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true 
      });
      respDiv.innerHTML = `
        <div class="response-error animate-fade-in space-y-1">
          <div class="response-text">
            <div>${dt.message}</div>
            <div>Days until registration expires: <strong>${daysRemaining}</strong> day${daysRemaining !== 1 ? 's' : ''}</div>
            <div>Expiration date/time (Sri Lanka): <strong>${expStr}</strong></div>
            <div>Try again after 1:30 AM Sri Lankan time ⏰</div>
            <div>Or maybe many others already liked your profile...</div>
            <div>Come back tomorrow to send more Likes!</div>
          </div>
          <button onclick="copyResponse(this)" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
        </div>`;

    } else if (dt.status === 1 && dt.response) {
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
          <button onclick="copyResponse(this)" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
        </div>`;
      animateCounter("likes-count", dt.response.LikesGivenByAPI);
    } else {
      respDiv.innerHTML = `
  <div class="response-error animate-fade-in">
    <div class="response-text">Something went wrong, please try again later.</div>
    <button onclick="copyResponse(this)" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
  </div>`;

    }
  } catch (err) {
    respDiv.innerHTML = `
  <div class="response-error animate-fade-in">
    <div class="response-text">Error: ${err.message}</div>
    <button onclick="copyResponse(this)" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded">Copy Response</button>
  </div>`;

  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Like';
    input.disabled = false;
  }
}

// ========== DAY COLOR ==========
function colorizeDays(days) {
  const value = `<strong>${days}</strong>`;
  if (days < 10) return `<span style="color:red;font-weight:bold">${value}</span>`;
  if (days >= 10 && days <= 25) return `<span style="color:yellow;font-weight:bold">${value}</span>`;
  return `<span style="color:lime;font-weight:bold">${value}</span>`;
}


// ========== COPY RESPONSE ==========
function copyResponse(btn) {
  const resp = btn.closest('#response-custom').querySelector('.response-text');
  if (!resp) return;
  const txt = resp.innerText.trim();
  btn.disabled = true;
  navigator.clipboard.writeText(txt)
    .then(() => {
      btn.textContent = 'Copied!';
      btn.classList.replace('bg-gray-600', 'bg-green-500');
      setTimeout(() => {
        btn.textContent = 'Copy Response';
        btn.classList.replace('bg-green-500', 'bg-gray-600');
        btn.disabled = false;
      }, 2000);
    })
    .catch(() => {
      console.error('Copy failed');
      btn.disabled = false;
    });
}



// ========== BACKGROUND SWITCHING ==========
const backgrounds = [
  "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20256/3fe7feec69108f571f70f3be93a84752.jpg",
  "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20255/792f0508b08f3f324bd37eefcd07e2ed.jpg"
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
