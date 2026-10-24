const engines = [
  ["Google", "G", "#eef4ff", "#4285f4"],
  ["Bing", "b", "#e6f8fa", "#00849a"],
  ["DuckDuckGo", "D", "#fff0e9", "#db5836"],
  ["Yahoo", "Y!", "#f4ecff", "#6300d9"],
  ["Qwant", "Q", "#f3ecff", "#5c18c8"],
  ["Perplexity", "✳", "#e6f5f3", "#177e83"],
  ["Startpage", "S", "#e9eeff", "#5669d9"],
  ["Yandex", "Я", "#ffefea", "#e94738"],
  ["Brave", "Br", "#fff0e8", "#f45c31"]
];
const grid = document.getElementById("demo-engines");
const selected = document.getElementById("selected-name");
for (const [name, mark, bg, fg] of engines) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "demo-engine";
  button.setAttribute("aria-label", name);
  button.setAttribute("aria-pressed", String(name === "Google"));
  if (name === "Google") button.classList.add("active");
  const logo = document.createElement("span");
  logo.className = "demo-mark";
  logo.style.setProperty("--bg", bg);
  logo.style.setProperty("--fg", fg);
  const image = document.createElement("img");
  image.src = `assets/engines/${name.toLowerCase()}.png`;
  image.alt = "";
  image.addEventListener("error", () => { logo.textContent = mark; });
  logo.append(image);
  button.append(logo, document.createTextNode(name));
  button.addEventListener("click", () => {
    selected.textContent = name;
    for (const item of grid.children) {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    }
  });
  grid.append(button);
}
