const encodedApiKey = 'YXN0dXRlMmsz';
const apiParts = {
  likeBase: ['aHR0cHM6Ly9saWtlcy4=', 'YXBpLmZyZWVmaXJl', 'b2ZmaWNpYWwuY29tL2FwaS9zZy8='],
  nameProxy: ['aHR0cHM6Ly9hcGku', 'YWxsb3JpZ2lucy53aW4=', 'L3Jhdz91cmw9'],
  nameApi: ['aHR0cHM6Ly9ub2RlanMt', 'aW5mby52ZXJjZWwuYXBw', 'L2luZm8=']
};
const encodedUids = {
  'NjY3MzUyNjc4': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9', // UID: 667352678, Expires: 2026-07-14 12:27:00 +05:30, User: Sara
  'MjgwNTM2NTcwMg==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9', // UID: 2805365702, Expires: 2026-07-14 12:27:00 +05:30, User: Snow
  'MjUwNjE0OTg4MA==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9', // UID: 2506149880, Expires: 2026-07-14 12:27:00 +05:30, User: Podi
  'MjA1MjU4MDEzMg==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9', // UID: 2052580132, Expires: 2026-07-14 12:27:00 +05:30, User: Geek
  'Mjg3NDI5MDk2NQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9', // UID: 2874290965, Expires: 2026-07-14 12:27:00 +05:30, User: Liyon
  // UID's by Geek
  'MTg5NTAyODg1NA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0xNlQxMjoyNzowMCswNTozMCJ9', // UID: 1895028854, Expires: 2025-08-16 12:27:00 +05:30, Paid, started 2025-06-16
  // UID's by Snow
  'MzY1NDM2Njk2': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0xMFQxMjoyNzowMCswNTozMCJ9' // UID: 365436696, Expires: 2025-08-10 12:27:00 +05:30, Paid, started 2025-06-10
};
const whatsappContacts = [
  { name: 'GEEK', number: '+94701974205' }
];
function getApiKey() {
  return atob(encodedApiKey)
}
function getRegisteredUids() {
  const decoded = {};
  for (const key in encodedUids) {
    const uid = atob(key);
    const data = JSON.parse(atob(encodedUids[key]));
    decoded[uid] = {
      expiration: new Date(data.expiration)
    }
  }
  return decoded
}
function getLikeApiUrl(uid) {
  return apiParts.likeBase.map(part => atob(part)).join('') + uid + '?key=' + encodeURIComponent(getApiKey())
}
function getNameApiUrl(uid) {
  const proxy = apiParts.nameProxy.map(part => atob(part)).join('');
  const api = apiParts.nameApi.map(part => atob(part)).join('') + `?uid=${uid}`;
  return proxy + encodeURIComponent(api)
}
async function fetchPlayerName(uid) {
  try {
    const response = await fetch(getNameApiUrl(uid));
    if (!response.ok)
      return 'Unknown';
    const data = await response.json();
    return data?.data?.player_info?.nikname || 'Unknown'
  } catch {
    return 'Unknown'
  }
}
function getRemainingDays(expiration) {
  const currentDate = new Date();
  const timeDiff = expiration - currentDate;
  return Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)))
}
async function sendLike() {
  const uidInput = document.getElementById('custom-uid');
  const responseDiv = document.getElementById('response-custom');
  const button = document.querySelector('button[onclick="sendLike()"]');
  const uid = uidInput.value.trim();
  const currentDate = new Date();
  const registeredUids = getRegisteredUids();
  responseDiv.innerHTML = `<div class="flex items-center justify-center p-4"><div class="spinner"></div></div>`;
  if (!uid || !/^\d+$/.test(uid)) {
    responseDiv.innerHTML = `<div class="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 animate-fade-in">Oops! 😔 Please enter a valid numeric UID, dear friend! 💕</div>`;
    return
  }
  if (!registeredUids[uid]) {
    responseDiv.innerHTML = `<div class="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 animate-fade-in">I'm sorry brother, you haven't registered for likes yet... 😔 Let's get you set up! 💪</div>`;
    return
  }
  const {expiration} = registeredUids[uid];
  const remainingDays = getRemainingDays(expiration);
  if (currentDate > expiration) {
    responseDiv.innerHTML = `<div class="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 animate-fade-in">Oh no! 😢 Your registration for UID ${uid} has expired, dear friend. Please renew to continue enjoying likes! 💕</div>`;
    return
  }
  button.disabled = true;
  button.textContent = 'Sending...';
  uidInput.disabled = true;
  try {
    const response = await fetch(getLikeApiUrl(uid));
    const data = await response.json();
    if (data.status === 1 && data.response) {
      const playerName = await fetchPlayerName(uid);
      responseDiv.innerHTML = `<div class="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 animate-success"><div class="flex items-center justify-center mb-4"><div class="checkmark"></div></div><div class="response-text space-y-2"><p class="text-blue-200"><span class="text-lg">🔹</span> <strong>Player Nickname:</strong> ${playerName}</p><p class="text-blue-200"><span class="text-lg">🔸</span> <strong>UID:</strong> ${data.response.UID}</p><p class="text-blue-200"><span class="text-lg">🆙</span> <strong>Player Level:</strong> ${data.response.PlayerLevel}</p><p class="text-blue-200"><span class="text-lg">❤️</span> <strong>Likes Given:</strong> ${data.response.LikesGivenByAPI}</p><p class="text-blue-200"><span class="text-lg">🔢</span> <strong>Before:</strong> ${data.response.LikesbeforeCommand} → <strong>After:</strong> ${data.response.LikesafterCommand}</p><p class="text-blue-200"><span class="text-lg">📅</span> <strong>Days Remaining:</strong> ${remainingDays} day${remainingDays !== 1 ? 's' : ''}</p><p class="text-green-400"><span class="text-lg">✅</span> <strong>Status:</strong> Success</p></div><button onclick="copyResponse()" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded transition-all duration-200">Copy Response</button></div>`
    } else if (data.status === 3) {
      const expiresAt = data.expires_at && !isNaN(new Date(data.expires_at)) ? new Date(data.expires_at).toLocaleString('en-US', {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }) : 'Not provided';
      responseDiv.innerHTML = `<div class="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 animate-fade-in"><div class="response-text space-y-2"><p class="text-yellow-400"><span class="text-lg">🔸</span> <strong>UID:</strong> ${uid}</p><p class="text-yellow-400"><span class="text-lg">⚠️</span> <strong>Message:</strong> ${data.message}</p><p class="text-yellow-400"><span class="text-lg">📊</span> <strong>Status:</strong> ${data.status}</p><p class="text-yellow-400"><span class="text-lg">📅</span> <strong>Days Remaining:</strong> ${remainingDays} day${remainingDays !== 1 ? 's' : ''}</p></div><button onclick="copyResponse()" class="copy-button mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded transition-all duration-200">Copy Response</button></div>`
    } else {
      responseDiv.innerHTML = `<div class="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 animate-fade-in">Oh dear! 😔 Something went wrong. Please try again or contact our team! 💕</div>`
    }
  } catch (error) {
    responseDiv.innerHTML = `<div class="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 animate-fade-in">Oh dear! 😔 An error occurred: ${error.message}. Please try again or contact our team! 💕</div>`
  } finally {
    button.disabled = false;
    button.textContent = 'Send Like';
    uidInput.disabled = false
  }
}
function copyResponse() {
  const responseDiv = document.getElementById('response-custom');
  const responseText = responseDiv.querySelector('.response-text');
  if (responseText) {
    const textToCopy = responseText.innerText.replace(/Copy Response$/, '').trim();
    navigator.clipboard.writeText(textToCopy).then( () => {
      const button = responseDiv.querySelector('.copy-button');
      button.textContent = 'Copied!';
      button.classList.remove('bg-gray-600', 'hover:bg-gray-700');
      button.classList.add('bg-green-500', 'hover:bg-green-600');
      setTimeout( () => {
        button.textContent = 'Copy Response';
        button.classList.remove('bg-green-500', 'hover:bg-green-600');
        button.classList.add('bg-gray-600', 'hover:bg-gray-700')
      }
      , 2000)
    }
    ).catch(err => {
      console.error('Failed to copy')
    }
    )
  }
}
window.sendLike = sendLike;
window.copyResponse = copyResponse;