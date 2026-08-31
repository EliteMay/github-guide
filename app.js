const state = {
  data: null,
  section: "overview",
  query: ""
};

const app = document.querySelector("#app");
const searchInput = document.querySelector("#globalSearch");
const navButtons = [...document.querySelectorAll("#sideNav button")];

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sectionById(id) {
  return state.data.sections.find(section => section.id === id) || state.data.sections[0];
}

function setSection(id) {
  state.section = id;
  navButtons.forEach(button => button.classList.toggle("active", button.dataset.section === id));
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function pageHead(section) {
  return `
    <header class="page-head">
      <div>
        <h1>${esc(section.title)}</h1>
        <p>${esc(section.description || "")}</p>
      </div>
      ${section.badge ? `<span class="badge">${esc(section.badge)}</span>` : ""}
    </header>`;
}

function docsLink(url) {
  if (!url) return "";
  return `<div class="button-row"><a class="secondary-button" href="${esc(url)}" target="_blank" rel="noopener noreferrer">GitHub公式ドキュメント</a></div>`;
}

function renderImages(images = []) {
  if (!images.length) return "";
  return `
    <div class="guide-images">
      ${images.map(image => `
        <figure class="guide-image">
          <a href="${esc(image.href || image.src)}" target="_blank" rel="noopener noreferrer">
            <img src="${esc(image.src)}" alt="${esc(image.alt || image.caption || "ガイド画像")}" loading="lazy">
          </a>
          ${image.caption ? `<figcaption>${esc(image.caption)}</figcaption>` : ""}
          ${image.sourceUrl ? `<a class="image-source" href="${esc(image.sourceUrl)}" target="_blank" rel="noopener noreferrer">画像の出典</a>` : ""}
        </figure>`).join("")}
    </div>`;
}

function renderLinks(links = []) {
  if (!links.length) return "";
  return `<div class="button-row">${links.map((link, index) => `<a class="${index === 0 ? "primary-button" : "secondary-button"}" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join("")}</div>`;
}

function renderEntry(entry) {
  return `
    <div class="panel guide-entry">
      <div class="row"><strong>${esc(entry.title)}</strong><div>${esc(entry.summary || "")}</div></div>
      ${entry.path ? `<div class="row"><strong>場所</strong><div><span class="term">${esc(entry.path)}</span></div></div>` : ""}
      ${entry.steps?.length ? `<div class="row"><strong>やり方</strong><div>${entry.steps.map((step, i) => `<div>${i + 1}. ${esc(step)}</div>`).join("")}</div></div>` : ""}
      ${entry.note ? `<div class="row"><strong>覚えておく</strong><div>${esc(entry.note)}</div></div>` : ""}
      ${entry.example ? `<div class="row"><strong>例</strong><div><span class="term">${esc(entry.example)}</span></div></div>` : ""}
      ${entry.images?.length ? `<div class="row visual-row"><strong>画像</strong><div>${renderImages(entry.images)}</div></div>` : ""}
      ${entry.links?.length ? `<div class="row"><strong>開く</strong><div>${renderLinks(entry.links)}</div></div>` : ""}
    </div>
    ${docsLink(entry.officialUrl)}`;
}

function renderOverview(section) {
  const quick = state.data.quickActions || [];
  return `
    ${pageHead(section)}
    <div class="quick-actions">
      ${quick.map(item => `<button class="action" data-jump="${esc(item.section)}"><strong>${esc(item.title)}</strong><span>${esc(item.description)}</span></button>`).join("")}
    </div>
    <section class="section">
      <h2>GitHubで迷ったときの考え方</h2>
      <div class="panel">
        ${(section.entries || []).map(entry => `<div class="row"><strong>${esc(entry.title)}</strong><div>${esc(entry.summary)}</div></div>`).join("")}
      </div>
    </section>`;
}

function renderDefault(section) {
  return `
    ${pageHead(section)}
    <section class="section">
      ${(section.entries || []).map(renderEntry).join("") || '<div class="empty">まだ項目がありません。</div>'}
    </section>`;
}

function renderTerms(section) {
  return `
    ${pageHead(section)}
    <section class="section">
      <div class="table-wrap">
        <table>
          <thead><tr><th>GitHub表記</th><th>日本語イメージ</th><th>何に使う？</th><th>注意</th></tr></thead>
          <tbody>
            ${(section.entries || []).map(item => `<tr><td><span class="term">${esc(item.title)}</span></td><td><strong>${esc(item.ja)}</strong></td><td>${esc(item.summary)}</td><td>${esc(item.note || "-")}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderErrors(section) {
  return `
    ${pageHead(section)}
    <section class="section">
      <div class="error-list">
        ${(section.entries || []).map(item => `
          <details>
            <summary><span class="error-id">${esc(item.code || "CHECK")}</span>${esc(item.title)}</summary>
            <div class="details-body">
              ${item.message ? `<p><strong>表示例:</strong> <span class="term">${esc(item.message)}</span></p>` : ""}
              <p><strong>意味:</strong> ${esc(item.summary)}</p>
              <p><strong>まず確認:</strong> ${esc(item.firstAction || "")}</p>
              ${item.steps?.length ? `<p><strong>対処:</strong></p>${item.steps.map((step, i) => `<div>${i + 1}. ${esc(step)}</div>`).join("")}` : ""}
              ${item.note ? `<p class="small muted">${esc(item.note)}</p>` : ""}
              ${renderImages(item.images || [])}
              ${renderLinks(item.links || [])}
              ${item.officialUrl ? `<p><a href="${esc(item.officialUrl)}" target="_blank" rel="noopener noreferrer">GitHub公式ドキュメント</a></p>` : ""}
            </div>
          </details>`).join("")}
      </div>
    </section>`;
}

function searchableItems() {
  return state.data.sections.flatMap(section =>
    (section.entries || []).map(entry => ({
      section: section.id,
      title: entry.title,
      text: [entry.ja, entry.summary, entry.path, entry.note, entry.example, entry.message, entry.firstAction, ...(entry.steps || [])].filter(Boolean).join(" ")
    }))
  );
}

function renderSearch() {
  const query = state.query.trim().toLowerCase();
  if (!query) return "";

  const hits = searchableItems().filter(item => `${item.title} ${item.text}`.toLowerCase().includes(query));
  return `
    <section class="search-results">
      <h2>「${esc(state.query)}」の検索結果</h2>
      ${hits.length ? hits.map(hit => `
        <div class="search-hit">
          <button data-search-jump="${esc(hit.section)}">${esc(hit.title)}</button>
          <p>${esc(hit.text)}</p>
        </div>`).join("") : '<p class="muted">一致する項目がありません。GitHubに表示された英語をそのまま検索してみてください。</p>'}
    </section>`;
}

function render() {
  const section = sectionById(state.section);
  let body;
  if (section.id === "overview") body = renderOverview(section);
  else if (section.id === "terms") body = renderTerms(section);
  else if (section.id === "errors") body = renderErrors(section);
  else body = renderDefault(section);

  app.innerHTML = renderSearch() + body;

  app.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", () => setSection(button.dataset.jump)));
  app.querySelectorAll("[data-search-jump]").forEach(button => button.addEventListener("click", () => {
    state.query = "";
    searchInput.value = "";
    setSection(button.dataset.searchJump);
  }));

  document.querySelector("#footerUpdated").textContent = `更新: ${state.data.updated}`;
}

async function loadSupplementalGuide() {
  try {
    const response = await fetch("./data/osu-hub.json", { cache: "no-store" });
    if (!response.ok) return;
    const supplemental = await response.json();
    const target = state.data.sections.find(section => section.id === supplemental.targetSection);
    if (target && supplemental.entries?.length) {
      target.entries = [...supplemental.entries, ...(target.entries || [])];
    }
    if (supplemental.quickAction) {
      state.data.quickActions = [supplemental.quickAction, ...(state.data.quickActions || [])];
    }
  } catch (error) {
    console.warn("Supplemental guide could not be loaded", error);
  }
}

async function init() {
  try {
    const response = await fetch("./data/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`guide data ${response.status}`);
    state.data = await response.json();
    await loadSupplementalGuide();

    navButtons.forEach(button => button.addEventListener("click", () => setSection(button.dataset.section)));
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value;
      render();
    });

    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = '<div class="empty"><strong>ガイドを読み込めませんでした。</strong><p>ページを再読み込みしてください。</p></div>';
  }
}

init();
