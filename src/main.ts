import "./style.css";
import { mountApp } from "./app.ts";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("App root is missing");
mountApp(root);
