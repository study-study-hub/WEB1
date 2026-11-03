/* ============================================================
   蜀韵成都 —— 交互脚本
   功能模块：
   1. 轮播图：自动播放 / 左右切换 / 圆点跳转 / 悬停暂停 / 触屏滑动
   2. 页头：滚动后白底阴影效果
   3. 移动端：汉堡菜单展开与收起
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
    一、轮播图模块
    ============================================================ */
  var banner = document.getElementById("banner");   // 轮播图整体容器
  var slides = banner.querySelectorAll(".slide");    // 所有轮播图
  var dots = banner.querySelectorAll(".dot");       // 指示圆点
  var prevBtn = document.getElementById("prevBtn");  // 上一张按钮
  var nextBtn = document.getElementById("nextBtn");  // 下一张按钮

  var current = 0;                // 当前显示的轮播图下标（从 0 开始）
  var timer = null;               // 自动播放定时器
  var AUTO_INTERVAL = 5000;       // 自动切换间隔：5 秒

  /* 切换到第 index 张轮播图（取模运算实现首尾循环） */
  function goTo(index) {
    current = (index + slides.length) % slides.length;
    // 切换轮播图的高亮状态
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === current);
    });
    // 同步切换指示圆点的高亮状态
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
    });
  }

  /* 切换到下一页 / 上一页 */
  function nextSlide() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  /* 启动自动播放（先清除旧定时器，避免叠加） */
  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(nextSlide, AUTO_INTERVAL);
  }
  /* 停止自动播放 */
  function stopAutoPlay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  /* 绑定“上一张 / 下一张”按钮事件 */
  nextBtn.addEventListener("click", function () { nextSlide(); startAutoPlay(); });
  prevBtn.addEventListener("click", function () { prevSlide(); startAutoPlay(); });

  /* 绑定指示圆点：点击跳转到对应轮播图 */
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      goTo(parseInt(dot.dataset.index, 10));
      startAutoPlay();
    });
  });

  /* 鼠标悬停时暂停自动播放，移开后恢复 */
  banner.addEventListener("mouseenter", stopAutoPlay);
  banner.addEventListener("mouseleave", startAutoPlay);

  /* 触屏滑动切换：手指左滑下一张、右滑上一张 */
  var startX = null;             // 记录触摸起始横坐标
  banner.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
  }, { passive: true });

  banner.addEventListener("touchend", function (event) {
    if (startX === null) { return; }
    var diffX = event.changedTouches[0].clientX - startX;   // 计算滑动距离
    if (diffX > 50) { prevSlide(); }       // 右滑超过 50px → 上一张
    else if (diffX < -50) { nextSlide(); } // 左滑超过 50px → 下一张
    startAutoPlay();
    startX = null;
  }, { passive: true });

  // 页面加载完毕，开始自动播放
  startAutoPlay();

  /* ============================================================
    二、页头滚动效果
    ============================================================ */
  var header = document.getElementById("header");

  /* 滚动超过 60px 时，页头添加 .scrolled（白底 + 阴影），否则移除 */
  function handleScroll() {
    header.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();   // 页面初始化时先执行一次

  /* ============================================================
    三、移动端汉堡菜单
    ============================================================ */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  /* 点击汉堡按钮：展开 / 收起导航菜单 */
  navToggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);      // 按钮三条线变形为“×”
    navToggle.setAttribute("aria-expanded", isOpen); // 无障碍属性
    header.classList.toggle("menu-open", isOpen);   // 页头变为白底便于阅读
  });

  /* 点击菜单中的任意链接后自动收起菜单 */
  nav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      header.classList.remove("menu-open");
    });
  });

  /* 点击菜单以外的区域时自动收起菜单 */
  document.addEventListener("click", function (event) {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      header.classList.remove("menu-open");
    }
  });

  /* 占位链接（href="#"）暂不跳转，待子页面建成后替换为真实地址 */
  nav.querySelectorAll("a[href=\"#\"]").forEach(function (link) {
    link.addEventListener("click", function (event) { event.preventDefault(); });
  });
})();
