import { firstSubject, parseAccountRoute, services } from "./subjects.ts";

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const book =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/></svg>';
const icons: Record<string, string> = {
  book,
  compass:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="m8 12 3 3 5-6M9 3v3h6V3"/></svg>',
};

function physicsArt() {
  return `<div class="physics-art" aria-hidden="true">
    <span class="art-kicker">OLAMNI ANGLASHDAN BOSHLAYMIZ</span>
    <svg class="orbit" viewBox="0 0 460 350" fill="none">
      <defs><radialGradient id="sphere" cx=".3" cy=".25"><stop stop-color="#f4f7cc"/><stop offset=".55" stop-color="#d2e397"/><stop offset="1" stop-color="#759b69"/></radialGradient><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" stroke="#224b3c" stroke-opacity=".06"/></pattern></defs>
      <rect width="460" height="350" fill="url(#grid)"/>
      <ellipse cx="230" cy="302" rx="75" ry="10" fill="#244d3c" opacity=".05"/>
      <g stroke="#658a70" stroke-width="1.2"><ellipse cx="230" cy="175" rx="169" ry="61" transform="rotate(-28 230 175)"/><ellipse cx="230" cy="175" rx="158" ry="66" transform="rotate(38 230 175)"/><ellipse cx="230" cy="175" rx="146" ry="65" transform="rotate(91 230 175)"/></g>
      <circle cx="230" cy="175" r="53" fill="url(#sphere)"/>
      <circle cx="85" cy="227" r="9" fill="#254f40"/><circle cx="337" cy="251" r="7" fill="#b8cb85"/><circle cx="231" cy="29" r="7" fill="#254f40"/>
      <path d="M371 75h14m-7-7v14M82 107h10m-5-5v10" stroke="#7c9a75" stroke-width="1.5"/>
      <circle cx="359" cy="119" r="2.5" fill="#7c9a75"/>
    </svg>
    <div class="art-caption"><span class="tiny-line"></span><span>Kichik qadam. Chuqur tushuncha.</span></div>
  </div>`;
}

export function mountApp(root: HTMLElement) {
  let showingAccount = false;
  let lastTrigger = "header-register";
  const trackTrigger = (event: Event) => {
    const target = event.target as Element;
    const link = target.closest<HTMLAnchorElement>("a[data-account]");
    if (link?.id) lastTrigger = link.id;
    if (target.closest(".mobile-menu nav a"))
      root.querySelector("details")?.removeAttribute("open");
  };
  root.addEventListener("click", trackTrigger);

  function render(focus = false) {
    const account = parseAccountRoute(window.location.hash);
    const header = `<header class="site-header" id="top"><a class="brand" href="#top" aria-label="Qadam — bosh sahifa"><span class="brand-mark">${book}</span><span>Qadam</span></a><nav class="desktop-nav" aria-label="Asosiy navigatsiya"><a href="#about">Platforma haqida</a><a href="#services">Xizmatlar</a></nav><div class="account-actions"><a id="header-login" data-account href="#/account/login" class="login-link">Kirish</a><a id="header-register" data-account href="#/account/register" class="solid-button small">Ro‘yxatdan o‘tish</a></div><details class="mobile-menu"><summary aria-label="Menyuni ochish yoki yopish"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary><nav aria-label="Mobil navigatsiya"><a href="#about">Platforma haqida</a><a href="#services">Xizmatlar</a></nav></details></header>`;
    const footer = `<footer class="site-footer"><a class="footer-brand" href="#top">Qadam</a><span>Bilim sari birinchi qadam.</span><span class="footer-note">Tanishuv prototipi</span></footer>`;
    if (account) {
      const title = account === "login" ? "Kirish" : "Ro‘yxatdan o‘tish";
      root.innerHTML = `${header}<main id="main-content" class="endpoint"><a class="back-link" href="#top">${arrow}Bosh sahifaga qaytish</a><section class="endpoint-content"><div class="endpoint-icon">${book}</div><p class="eyebrow">HISOBGA KIRISH KO‘RINISHI</p><h1 tabindex="-1">${title}</h1><p class="endpoint-intent">Tayyorgarlik yo‘lingiz shu yerdan boshlanadi.</p><aside class="prototype-note"><span class="note-label">Keyingi bosqichda</span><p>Hisobga kirish va ro‘yxatdan o‘tish keyingi bosqichda qo‘shiladi. Hozir siz tanishtiruv sahifasining prototipini ko‘ryapsiz.</p><p>Bu yerda hisob yaratilmaydi va shaxsiy ma’lumot so‘ralmaydi.</p></aside><a class="solid-button" href="#top">Tanishtiruvga qaytish ${arrow}</a><a class="switch-account" href="#/account/${account === "login" ? "register" : "login"}">${account === "login" ? "Ro‘yxatdan o‘tish ko‘rinishi" : "Kirish ko‘rinishi"}</a></section></main>${footer}`;
      showingAccount = true;
    } else {
      if (focus && !showingAccount) return;
      root.innerHTML = `${header}<main id="main-content"><section class="hero" aria-labelledby="welcome-title"><div class="hero-copy"><p class="eyebrow"><span class="subject-dot"></span>MAQSADINGIZ SARI, BIRGA</p><h1 id="welcome-title" tabindex="-1">Milliy sertifikat<br>fanlariga tayyorlanish uchun <em>yagona platforma.</em></h1><p class="hero-description">Bilimni mustahkamlashdan imtihonga tayyorgarlikkacha — o‘zingizga mos yo‘l bilan o‘rganing.</p><div class="hero-actions"><a id="hero-register" data-account class="solid-button" href="#/account/register">Ro‘yxatdan o‘tish ${arrow}</a><a class="text-link" href="#services">Xizmatlar bilan tanishish</a></div><p class="availability"><span></span>Avval ${firstSubject.name.toLowerCase()}. Boshqa fanlar bosqichma-bosqich qo‘shiladi.</p></div>${physicsArt()}</section>
      <section class="about-section" id="about" aria-labelledby="about-title"><div><p class="eyebrow">BIR MAQSAD. TURLI YO‘LLAR.</p><h2 id="about-title">Tayyorgarlik sizga<br>mos bo‘lishi kerak.</h2></div><div class="about-copy"><p>Kimdir ilk mavzudan boshlaydi. Kimdir bilimidagi bo‘shliqlarni to‘ldiradi. Platforma milliy sertifikat fanlariga tayyorgarlikning shu turli ehtiyojlarini bir joyda birlashtirish uchun yaratilmoqda.</p><p class="subtle">Dastlab fizika yo‘nalishi ishlab chiqiladi. Keyinchalik boshqa fanlarga ham bitta hisob orqali o‘tish rejalashtirilgan.</p></div></section>
      <section class="services-section" id="services" aria-labelledby="services-title"><div class="section-heading"><div><p class="eyebrow">O‘RGANISH IMKONIYATLARI</p><h2 id="services-title">Maqsadingizga mos tayyorgarlik.</h2></div><span class="planned-badge">Rejalashtirilgan xizmatlar</span></div><div class="service-grid">${services.map((item, index) => `<article class="service-card"><div class="service-top"><span class="service-icon">${icons[item.icon]}</span><span class="service-number">0${index + 1}</span></div><h3>${item.title}</h3><p>${item.description}</p></article>`).join("")}</div></section>
      <section class="how-section" aria-labelledby="how-title"><div class="section-heading"><div><p class="eyebrow">ODDIY VA IZCHIL</p><h2 id="how-title">Bu qanday ishlaydi?</h2></div><p>Kelajakdagi o‘quv jarayoni</p></div><ol class="steps"><li><span>01</span><div><h3>Hisob ochasiz</h3><p>Bitta hisob — barcha yo‘nalishlar uchun.</p></div></li><li><span>02</span><div><h3>Yo‘lingizni tanlaysiz</h3><p>Noldan boshlash yoki bilimni tekshirish.</p></div></li><li><span>03</span><div><h3>Izchil tayyorlanasiz</h3><p>Mavzular, mashqlar va sinovlar orqali.</p></div></li></ol></section>
      <section class="closing"><div><p class="eyebrow">BIRINCHI QADAM — QIZIQISH</p><h2>O‘rganishga joy oching.</h2><p>Biz esa tayyorgarlik yo‘lini bosqichma-bosqich quramiz.</p></div><a id="closing-register" data-account class="solid-button" href="#/account/register">Ro‘yxatdan o‘tish ${arrow}</a></section></main>${footer}`;
      showingAccount = false;
    }
    document.title = `${account ? (account === "login" ? "Kirish" : "Ro‘yxatdan o‘tish") + " — prototip" : "Milliy sertifikatga tayyorgarlik"} — Qadam`;
    if (focus) {
      const target = account
        ? root.querySelector<HTMLElement>("h1")
        : root.querySelector<HTMLElement>(`#${lastTrigger}`);
      target?.focus({ preventScroll: true });
      // Recreated sections need explicit scrolling when returning from account preview.
      if (
        !account &&
        ["#about", "#services", "#main-content"].includes(window.location.hash)
      ) {
        const section = root.querySelector<HTMLElement>(window.location.hash);
        section?.setAttribute("tabindex", "-1");
        section?.focus({ preventScroll: true });
        section?.scrollIntoView();
      }
      if (account) window.scrollTo({ top: 0, behavior: "instant" });
      else if (window.location.hash === "#top")
        window.scrollTo({ top: 0, behavior: "instant" });
    }
  }
  const handleRoute = () => render(true);
  window.addEventListener("hashchange", handleRoute);
  render();
  return () => {
    window.removeEventListener("hashchange", handleRoute);
    root.removeEventListener("click", trackTrigger);
  };
}
