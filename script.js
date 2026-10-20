const tweetInput = document.getElementById("tweetInput");
const tweetBtn = document.getElementById("tweetBtn");
const counter = document.getElementById("counter");
const feed = document.getElementById("feed");
const tweetsCount = document.getElementById("tweetsCount");
const searchInput = document.getElementById("searchInput");
const followList = document.getElementById("followList");
const themeBtn = document.getElementById("themeBtn");
const sidePostBtn = document.getElementById("sidePostBtn");
const tabs = document.querySelectorAll(".tab");
const menuItems = document.querySelectorAll(".menu-item");

const me = { name: "Shoaib", username: "@shoaib" };
const colors = ["#1d9bf0", "#7856ff", "#12b76a", "#f59e0b", "#ff4f81", "#06b6d4"];

let currentFilter = "all";
let searchText = "";

function minutesAgo(m) {
  return Date.now() - m * 60 * 1000;
}

// لو في تغريدات متخزنة نجيبها، غير كده نبدأ بشوية تغريدات
let tweets = JSON.parse(localStorage.getItem("tweets_v2"));

if (!tweets) {
  tweets = [
    {
      id: 1,
      name: "Ahmed Ali",
      username: "@ahmed_dev",
      text: "بدأت أتعلم React النهاردة وحاسس إن الموضوع ممتع جدا #React #frontend",
      likes: 24,
      retweets: 6,
      liked: false,
      retweeted: false,
      createdAt: minutesAgo(25),
    },
    {
      id: 2,
      name: "Sara Mohamed",
      username: "@sara_ui",
      text: "الـ CSS Grid خلّت عمل الـ layout أسهل بكتير من الأول #CSS",
      likes: 18,
      retweets: 3,
      liked: false,
      retweeted: false,
      createdAt: minutesAgo(90),
    },
    {
      id: 3,
      name: "Developer",
      username: "@Developer",
      text: "أحسن طريقة تتعلم بيها البرمجة إنك تبني مشاريع حقيقية #web_dev",
      likes: 12,
      retweets: 3,
      liked: false,
      retweeted: false,
      createdAt: minutesAgo(300),
    },
  ];
}

const suggestions = [
  { name: "Omar Hassan", username: "@omar_js", following: false },
  { name: "Mona Adel", username: "@mona_codes", following: false },
  { name: "Khaled Samir", username: "@khaled_web", following: false },
];

function saveTweets() {
  localStorage.setItem("tweets_v2", JSON.stringify(tweets));
}

function getColor(name) {
  return colors[name.charCodeAt(0) % colors.length];
}

// عشان لو حد كتب كود html في التغريدة ميشتغلش
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// تلوين الهاشتاج
function formatText(text) {
  const safe = escapeHtml(text);
  return safe.replace(/#([\p{L}\p{N}_]+)/gu, '<span class="hashtag">#$1</span>');
}

function timeAgo(time) {
  const seconds = Math.floor((Date.now() - time) / 1000);

  if (seconds < 60) return "الآن";
  if (seconds < 3600) return "منذ " + Math.floor(seconds / 60) + " دقيقة";
  if (seconds < 86400) return "منذ " + Math.floor(seconds / 3600) + " ساعة";
  return "منذ " + Math.floor(seconds / 86400) + " يوم";
}

function showTweets() {
  feed.innerHTML = "";
  tweetsCount.textContent = tweets.length + " تغريدة";

  const list = tweets.filter(function (t) {
    if (currentFilter === "liked" && !t.liked) return false;

    if (searchText !== "") {
      const all = (t.text + t.name + t.username).toLowerCase();
      if (!all.includes(searchText)) return false;
    }

    return true;
  });

  if (list.length === 0) {
    feed.innerHTML = '<p class="empty">لا توجد تغريدات هنا</p>';
    return;
  }

  list.forEach(function (tweet) {
    const card = document.createElement("div");
    card.className = "tweet-card";

    // زرار الحذف يظهر بس على تغريداتي أنا
    let deleteBtn = "";
    if (tweet.username === me.username) {
      deleteBtn = '<button class="delete-btn" data-id="' + tweet.id + '">حذف</button>';
    }

    card.innerHTML =
      '<div class="avatar" style="background:' + getColor(tweet.name) + '">' +
        escapeHtml(tweet.name.charAt(0).toUpperCase()) +
      "</div>" +
      '<div class="tweet-body">' +
        '<div class="user-info">' +
          "<strong>" + escapeHtml(tweet.name) + "</strong>" +
          "<span>" + escapeHtml(tweet.username) + "</span>" +
          "<span>· " + timeAgo(tweet.createdAt) + "</span>" +
          deleteBtn +
        "</div>" +
        '<p class="tweet-text">' + formatText(tweet.text) + "</p>" +
        '<div class="tweet-stats">' +
          '<button class="like-btn ' + (tweet.liked ? "active" : "") + '" data-id="' + tweet.id + '">' +
            (tweet.liked ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>') + " " + tweet.likes +
          "</button>" +
          '<button class="retweet-btn ' + (tweet.retweeted ? "active" : "") + '" data-id="' + tweet.id + '">' +
            '<i class="fa-solid fa-retweet"></i> ' + tweet.retweets +
          "</button>" +
        "</div>" +
      "</div>";

    feed.appendChild(card);
  });
}

function showFollow() {
  followList.innerHTML = "";

  suggestions.forEach(function (user, index) {
    const item = document.createElement("div");
    item.className = "follow-item";

    item.innerHTML =
      '<div class="avatar small" style="background:' + getColor(user.name) + '">' +
        user.name.charAt(0) +
      "</div>" +
      '<div class="follow-info">' +
        "<strong>" + user.name + "</strong>" +
        "<span>" + user.username + "</span>" +
      "</div>" +
      '<button class="follow-btn ' + (user.following ? "following" : "") + '" data-index="' + index + '">' +
        (user.following ? "تتابعه" : "متابعة") +
      "</button>";

    followList.appendChild(item);
  });
}

function addTweet() {
  const text = tweetInput.value.trim();
  if (text === "") return;

  const newTweet = {
    id: Date.now(),
    name: me.name,
    username: me.username,
    text: text,
    likes: 0,
    retweets: 0,
    liked: false,
    retweeted: false,
    createdAt: Date.now(),
  };

  tweets.unshift(newTweet);
  saveTweets();

  tweetInput.value = "";
  updateCounter();
  showTweets();
}

function updateCounter() {
  const left = 280 - tweetInput.value.length;
  counter.textContent = left;

  if (left <= 20) {
    counter.classList.add("warning");
  } else {
    counter.classList.remove("warning");
  }

  tweetBtn.disabled = tweetInput.value.trim() === "";
}

function findTweet(id) {
  return tweets.find(function (t) {
    return t.id === Number(id);
  });
}

tweetInput.addEventListener("input", updateCounter);
tweetBtn.addEventListener("click", addTweet);

// Ctrl + Enter عشان تنشر بسرعة
tweetInput.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "Enter") {
    addTweet();
  }
});

// بدل ما نحط event على كل زرار، بنحطه مرة واحدة على الـ feed
feed.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn || !btn.dataset.id) return;

  const tweet = findTweet(btn.dataset.id);
  if (!tweet) return;

  if (btn.classList.contains("like-btn")) {
    tweet.liked = !tweet.liked;
    tweet.likes += tweet.liked ? 1 : -1;
  }

  if (btn.classList.contains("retweet-btn")) {
    tweet.retweeted = !tweet.retweeted;
    tweet.retweets += tweet.retweeted ? 1 : -1;
  }

  if (btn.classList.contains("delete-btn")) {
    if (!confirm("متأكد إنك عايز تحذف التغريدة؟")) return;
    tweets = tweets.filter(function (t) {
      return t.id !== Number(btn.dataset.id);
    });
  }

  saveTweets();
  showTweets();
});

followList.addEventListener("click", function (e) {
  const index = e.target.dataset.index;
  if (index === undefined) return;

  suggestions[index].following = !suggestions[index].following;
  showFollow();
});

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (t) {
      t.classList.remove("active");
    });
    tab.classList.add("active");
    currentFilter = tab.dataset.filter;
    showTweets();
  });
});

searchInput.addEventListener("input", function () {
  searchText = searchInput.value.trim().toLowerCase();
  showTweets();
});

// القايمة الجانبية
menuItems.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    menuItems.forEach(function (m) {
      m.classList.remove("active");
    });
    item.classList.add("active");
  });
});

sidePostBtn.addEventListener("click", function () {
  tweetInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// الوضع الفاتح والغامق
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

function updateThemeIcon() {
  if (document.body.classList.contains("dark")) {
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  updateThemeIcon();
});

updateThemeIcon();
updateCounter();
showFollow();
showTweets();

// نحدث الوقت كل دقيقة (منذ 5 دقائق ... إلخ)
setInterval(showTweets, 60000);
