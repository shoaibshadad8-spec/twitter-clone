const tweetInput = document.getElementById("tweetInput");
const tweetBtn = document.getElementById("tweetBtn");
const counter = document.getElementById("counter");
const feed = document.getElementById("feed");
const tweetsCount = document.getElementById("tweetsCount");
const tabs = document.querySelectorAll(".tab");

let currentFilter = "all";

// لو في تغريدات متخزنة نجيبها، غير كده نبدأ بشوية تغريدات
let tweets = JSON.parse(localStorage.getItem("tweets"));

if (!tweets) {
  tweets = [
    {
      id: 1,
      name: "User Name",
      username: "@username",
      text: "HTML CSS",
      likes: 5,
      retweets: 2,
      liked: false,
      retweeted: false,
      time: "منذ ساعة",
    },
    {
      id: 2,
      name: "Developer",
      username: "@Developer",
      text: "صفحة التغريدات",
      likes: 12,
      retweets: 3,
      liked: false,
      retweeted: false,
      time: "منذ ساعتين",
    },
  ];
}

function saveTweets() {
  localStorage.setItem("tweets", JSON.stringify(tweets));
}

function showTweets() {
  feed.innerHTML = "";

  let list = tweets;
  if (currentFilter === "liked") {
    list = tweets.filter(function (t) {
      return t.liked;
    });
  }

  tweetsCount.textContent = tweets.length + " تغريدة";

  if (list.length === 0) {
    feed.innerHTML = '<p class="empty">لا توجد تغريدات هنا</p>';
    return;
  }

  list.forEach(function (tweet) {
    const card = document.createElement("div");
    card.className = "tweet-card";

    card.innerHTML =
      '<div class="avatar">' + tweet.name.charAt(0).toUpperCase() + "</div>" +
      '<div class="tweet-body">' +
        '<div class="user-info">' +
          "<strong></strong>" +
          "<span></span>" +
          '<span class="time"></span>' +
          '<button class="delete-btn" data-id="' + tweet.id + '">حذف</button>' +
        "</div>" +
        '<p class="tweet-text"></p>' +
        '<div class="tweet-stats">' +
          '<button class="like-btn ' + (tweet.liked ? "active" : "") + '" data-id="' + tweet.id + '">' +
            (tweet.liked ? "♥" : "♡") + " " + tweet.likes +
          "</button>" +
          '<button class="retweet-btn ' + (tweet.retweeted ? "active" : "") + '" data-id="' + tweet.id + '">' +
            "⟳ " + tweet.retweets +
          "</button>" +
        "</div>" +
      "</div>";

    // نحط النصوص بـ textContent عشان لو حد كتب كود html ميشتغلش
    card.querySelector("strong").textContent = tweet.name;
    card.querySelectorAll(".user-info span")[0].textContent = tweet.username;
    card.querySelector(".time").textContent = "· " + tweet.time;
    card.querySelector(".tweet-text").textContent = tweet.text;

    feed.appendChild(card);
  });
}

function addTweet() {
  const text = tweetInput.value.trim();
  if (text === "") return;

  const newTweet = {
    id: Date.now(),
    name: "Shoaib",
    username: "@shoaib",
    text: text,
    likes: 0,
    retweets: 0,
    liked: false,
    retweeted: false,
    time: "الآن",
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

// بدل ما نحط event على كل زرار، بنحطه مرة واحدة على الـ feed
feed.addEventListener("click", function (e) {
  const id = e.target.dataset.id;
  if (!id) return;

  const tweet = findTweet(id);

  if (e.target.classList.contains("like-btn")) {
    tweet.liked = !tweet.liked;
    tweet.likes += tweet.liked ? 1 : -1;
  }

  if (e.target.classList.contains("retweet-btn")) {
    tweet.retweeted = !tweet.retweeted;
    tweet.retweets += tweet.retweeted ? 1 : -1;
  }

  if (e.target.classList.contains("delete-btn")) {
    if (!confirm("متأكد إنك عايز تحذف التغريدة؟")) return;
    tweets = tweets.filter(function (t) {
      return t.id !== Number(id);
    });
  }

  saveTweets();
  showTweets();
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

updateCounter();
showTweets();
