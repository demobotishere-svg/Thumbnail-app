const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(``, {
  url: "https://thumbnail-application.vercel.app/",
  runScripts: "dangerously",
  resources: "usable"
});

dom.window.addEventListener('error', event => {
  console.error("DOM ERROR:", event.error || event.message);
});

dom.window.console.error = (...args) => {
  console.error("CONSOLE ERROR:", ...args);
};

dom.window.console.log = (...args) => {
  console.log("CONSOLE LOG:", ...args);
};

setTimeout(() => {
  console.log("Done waiting");
}, 10000);
