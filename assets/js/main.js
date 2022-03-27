'use strict'


{
  // aタグ要素の参照を取得
const scrollBtn = document.querySelectorAll('a[href^="#"]');


// 各aタグにクリックイベントを設定
for ( let i = 0; i < scrollBtn.length; i++ ) {
scrollBtn[i].addEventListener('click', (e) => {
  // デフォルトのイベントをキャンセル
  e.preventDefault();

  let href = scrollBtn[i].getAttribute('href');
  const target = document.querySelector(href);

  // 対象（aタグ）のY軸の絶対座標を取得
  const elemY = target.getBoundingClientRect().top;
  // 現在のスクロール量を取得
  const scrollY = window.pageYOffset;

  // bufferをたす
  const buffer = 40;
  // 対象までのスクロール量を算出
  const top = elemY + scrollY - buffer;


  window.scroll({
    top: top, // スクロール量の設定
    behavior: 'smooth' // スクロール動作の設定
  });
});
}
}


//loading animを初回読み込み時だけ実行するためのcookie判定
function setCookie(key,value) {
  document.cookie = key + '=' + value + ';';
}
function getCookie(key) {
  const cookies = document.cookie;
  const cookiesAry = cookies.split(';');

  for(let i = 0; i < cookiesAry.length; i++) {
    let cookie = cookiesAry[i].split('=');
    if(cookie[0] === key) {
      return cookie;
    }
  }
}
const keyName= 'visited';
const keyValue= true;
const cookie = getCookie(keyName);

if(typeof cookie === 'undefined' || cookie[1] !== keyValue){
    //Cookieをセットする
    setCookie(keyName, keyValue);

    //初回アクセス時の処理
    window.onload =function() {
      const loader = document.getElementById('p-loading');
      loader.classList.add('loaded');
    }
} 

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.create({
  start: 'top -80',
  end: 99999,
  toggleClass: {
    className: "-scrolled",
    targets: ".l-header, .p-header__button a"
  }
});

function animateFrom(elem, direction) {
  direction = direction || 1;
  var x = 0;
  var y = direction * 100;
  if(elem.classList.contains('gs_reveal_fromLeft')) {
    x = -100;
    y = 0;
  } else if(elem.classList.contains('gs_reveal_fromRight')) {
    x = 100;
    y = 0;
  }
  elem.style.transform = "translate(" + x + "px," + y + "px)";
  elem.style.opacity = '0';
  gsap.fromTo(elem, {x: x, y: y, autoAlpha: 0},{
    duration: 1.25,
    x: 0,
    y: 0,
    autoAlpha: 1,
    ease: "expo",
    overwhite: "auto"
  });
}

function hide(elem) {
  gsap.set(elem, {autoAlpha: 0});
}

gsap.utils.toArray(".gs_reveal").forEach(function(elem) {
  hide(elem);

  ScrollTrigger.create({
    trigger: elem,
    onEnter: function() { animateFrom(elem)},
    onEnterBack: function() { animateFrom(elem, -1)},
    onLeave: function() {hide(elem)}
  });
});

window.addEventListener('load', function() {
  let elems = document.getElementById('p-mv__lead').querySelectorAll('[data-text]');
  window.setTimeout(function() {
    for(var i = 0; i < elems.length; i++) {
      elems[i].classList.add('js-text');
    }
  },300);
});


// console.clear();

gsap.defaults({overwrite: 'auto'});

gsap.set(".p-skill__left > *", {xPercent: -50, yPercent: -50});

// Set up our scroll trigger
const ST = ScrollTrigger.create({
  trigger: ".l-skill__container",
  start: "top 40",
  end: "bottom center",
  onUpdate: getCurrentSection,
  pin: ".p-skill__left",
  // markers: true,
});

const contentMarkers = gsap.utils.toArray(".js-contentMarker");

// Set up our content behaviors
contentMarkers.forEach(marker => {
  marker.content = document.querySelector(`#${marker.dataset.markerContent}`);
  
  if(marker.content.tagName === "H3") {
    gsap.set(marker.content, {transformOrigin: "left center"});
    
    marker.content.enter = function() {
      gsap.fromTo(marker.content, {autoAlpha: 0, rotateY: 50}, {duration: 0.8, autoAlpha: 1, rotateY: 0});
    }
  }
  
  marker.content.leave = function() {
    gsap.to(marker.content, {duration: 0.1, autoAlpha: 0});
  }
  
});

// Handle the updated position
let lastContent;
function getCurrentSection() {
  let newContent;
  const currScroll = scrollY;
  
  // Find the current section
  contentMarkers.forEach(marker => {
    if(currScroll > marker.offsetTop) {
      newContent = marker.content;
    }
  });
  
  // If the current section is different than that last, animate in
  if(newContent
  && (lastContent == null 
     || !newContent.isSameNode(lastContent))) {
    // Fade out last section
    if(lastContent) {
      lastContent.leave();
    }
    
    // Animate in new section
    newContent.enter();
    
    lastContent = newContent;
  }
  
}

const media = window.matchMedia("screen and (max-width: 600px)");
ScrollTrigger.addEventListener("refreshInit", checkSTState);
checkSTState();

function checkSTState() {
  if(media.matches) {
    ST.disable();
  } else {
    ST.enable();
  }
}
