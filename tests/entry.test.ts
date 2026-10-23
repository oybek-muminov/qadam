import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Window } from "happy-dom";
import { mountApp } from "../src/app.ts";
import { parseAccountRoute } from "../src/subjects.ts";

function setup(hash = "") {
  const window = new Window({ url: `http://127.0.0.1:1435/${hash}` });
  Object.assign(globalThis, { window, document: window.document });
  window.document.body.innerHTML = '<div id="app"></div>';
  const root = window.document.querySelector("#app")!;
  const cleanup = mountApp(root as unknown as HTMLElement);
  const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
  };
  return { window, root, cleanup, settle };
}

test("public landing explains future services without exposing onboarding or credentials", () => {
  const { root, cleanup } = setup();
  assert.match(root.querySelector("h1")!.textContent, /Milliy sertifikat/);
  assert.match(root.textContent, /Avval fizika/);
  assert.match(root.textContent, /Boshqa fanlar bosqichma-bosqich/);
  assert.equal(root.querySelectorAll(".service-card").length, 4);
  assert.match(root.textContent, /Rejalashtirilgan xizmatlar/);
  assert.equal(root.querySelectorAll("input, form, iframe").length, 0);
  assert.equal(root.querySelectorAll("[data-path]").length, 0);
  for (const anchor of root.querySelectorAll("a")) {
    const href = anchor.getAttribute("href")!;
    assert.ok(href.startsWith("#"));
    if (!href.startsWith("#/account/"))
      assert.ok(root.querySelector(href), `target ${href}`);
  }
  cleanup();
});

test("repeated account entry, switching and cancellation return focus without collecting data", async () => {
  const { root, window, cleanup, settle } = setup();
  for (let repeat = 0; repeat < 3; repeat++) {
    (root.querySelector("#hero-register") as any).click();
    await settle();
    assert.equal(window.location.hash, "#/account/register");
    assert.match(root.querySelector("h1")!.textContent, /Ro‘yxatdan o‘tish/);
    assert.match(root.textContent, /hisob yaratilmaydi/);
    assert.equal(root.querySelectorAll("input, form").length, 0);
    assert.equal(window.document.activeElement?.tagName, "H1");
    (root.querySelector(".switch-account") as any).click();
    await settle();
    assert.match(root.querySelector("h1")!.textContent, /^Kirish$/);
    (root.querySelector(".back-link") as any).click();
    await settle();
    assert.ok(root.querySelector(".hero"));
    assert.equal(window.document.activeElement?.id, "hero-register");
  }
  assert.equal(window.localStorage.length, 0);
  assert.equal(window.sessionStorage.length, 0);
  cleanup();
});

test("direct account URLs, returning to landing history state, and unknown URLs are safe", async () => {
  const { root, window, cleanup, settle } = setup("#/account/login");
  assert.equal(root.querySelector("h1")!.textContent, "Kirish");
  // Simulates the URL/hashchange supplied by browser Back; no browser is launched.
  window.location.hash = "services";
  await settle();
  assert.ok(root.querySelector("#services"));
  assert.equal(window.document.activeElement?.id, "services");
  window.location.hash = "/account/register";
  await settle();
  assert.match(root.querySelector("h1")!.textContent, /Ro‘yxatdan/);
  (root.querySelector(".endpoint-content .solid-button") as any).click();
  await settle();
  assert.ok(root.querySelector(".hero"));
  assert.equal(parseAccountRoute("#/physics/start"), null);
  assert.equal(parseAccountRoute("#/account/invalid"), null);
  cleanup();
});

test("mobile navigation expands natively and closes after a section is chosen", async () => {
  const { root, cleanup, settle } = setup();
  const details = root.querySelector("details")!;
  assert.ok(details.querySelector("summary[aria-label]"));
  (details.querySelector("summary") as any).click();
  assert.equal(details.hasAttribute("open"), true);
  (details.querySelector('a[href="#services"]') as any).click();
  await settle();
  assert.equal(details.hasAttribute("open"), false);
  assert.ok(root.querySelector("#services"));
  cleanup();
});

test("responsive CSS contracts cover narrow phones, tablet and desktop (not layout rendering)", () => {
  const css = readFileSync(
    new URL("../src/style.css", import.meta.url),
    "utf8",
  );
  for (const width of [360, 390, 768, 1440]) {
    const { window, cleanup } = setup();
    window.happyDOM.setWindowSize({ width, height: 900 });
    const style = window.document.createElement("style");
    style.textContent = css;
    window.document.head.append(style);
    const menu = window.document.querySelector(".mobile-menu")!;
    const desktopNav = window.document.querySelector(".desktop-nav")!;
    assert.equal(
      window.getComputedStyle(menu).display,
      width <= 780 ? "block" : "none",
    );
    assert.equal(
      window.getComputedStyle(desktopNav).display,
      width <= 780 ? "none" : "flex",
    );
    assert.equal(window.matchMedia("(max-width: 580px)").matches, width <= 580);
    assert.equal(window.matchMedia("(max-width: 780px)").matches, width <= 780);
    cleanup();
  }
  assert.match(css, /grid-template-columns: minmax\(0,\s*1fr\)/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  // There are no third-party runtime resources or credential API calls.
  const source = readFileSync(
    new URL("../src/app.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage/);
});
