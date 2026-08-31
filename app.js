const state = {
  data: null,
  projectId: null,
  section: "overview",
  query: ""
};

const app = document.querySelector("#app");
const projectSelect = document.querySelector("#projectSelect");
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

function currentProject() {
  return state.data.projects.find(project => project.id === state.projectId) || state.data.projects[0];
}

function formatDate(value) {
  if (!value) return "未確認";
  try {
    return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

async function hydrateRelease(project) {
  const release = project.release;
  if (!release?.githubRepo) return;

  release.latestReleaseUrl ||= `https://github.com/${release.githubRepo}/releases/latest`;
  release.version ||= "GitHubで確認";
  release.status = "loading";

  try {
    const response = await fetch(`https://api.github.com/repos/${release.githubRepo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);

    const latest = await response.json();
    const pattern = release.assetPattern ? new RegExp(release.assetPattern, "i") : null;
    const asset = pattern ? latest.assets?.find(item => pattern.test(item.name)) : null;

    release.version = latest.tag_name || latest.name || release.version;
    release.date = latest.published_at || latest.created_at;
    release.latestReleaseUrl = latest.html_url || release.latestReleaseUrl;
    release.assetName = asset?.name || release.assetName || "Releaseページで確認";
    release.directDownloadUrl = asset?.browser_download_url || "";
    release.releaseNotes = latest.body || "";
    release.status = "ok";
  } catch (error) {
    release.status = "error";
    console.warn("Release lookup failed", project.id, error);
  }
}

function pageHead(project, title, description) {
  return `
    <header class="page-head">
      <div>
        <h1>${esc(title)}</h1>
        <p>${esc(description)}</p>
      </div>
      <span class="badge">${esc(project.status || "公開中")}</span>
    </header>`;
}

function linkButton(url, label, primary = false) {
  if (!url) return "";
  return `<a class="${primary ? "primary-button" : "secondary-button"}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
}

function renderOverview(project) {
  const release = project.release || {};
  return `
    ${pageHead(project, project.name, project.summary)}
    <div class="quick-actions">
      <button class="action" data-jump="download"><strong>最新版を入手</strong><span>推奨Setup.exeとRelease情報を見る</span></button>
      <button class="action" data-jump="errors"><strong>エラーを解決</strong><span>症状やエラー表示から対処方法を探す</span></button>
      <button class="action" data-jump="settings"><strong>設定を理解</strong><span>英語表記や分かりにくい設定を日本語で確認</span></button>
    </div>

    <section class="section">
      <h2>現在の情報</h2>
      <div class="panel">
        <div class="row"><strong>最新バージョン</strong><div>${esc(release.version || "未確認")}${release.status === "error" ? ' <span class="muted small">（自動取得失敗）</span>' : ""}</div></div>
        <div class="row"><strong>公開日</strong><div>${esc(formatDate(release.date))}</div></div>
        <div class="row"><strong>対応環境</strong><div>${esc((project.platforms || []).join(" / ") || "未設定")}</div></div>
        <div class="row"><strong>GitHub</strong><div><a href="${esc(project.repositoryUrl)}" target="_blank" rel="noopener noreferrer">リポジトリを見る</a></div></div>
      </div>
    </section>

    <section class="section">
      <h2>このガイドで分かること</h2>
      <div class="panel">
        <div class="row"><strong>ダウンロード</strong><div>どのファイルを選べばよいか、最新版はどれか。</div></div>
        <div class="row"><strong>はじめ方</strong><div>初回インストールから基本利用まで。</div></div>
        <div class="row"><strong>エラー対処</strong><div>表示されたエラーや症状に対して、まず何を試すか。</div></div>
        <div class="row"><strong>設定・用語</strong><div>英語名を画面の表記と対応させて日本語で理解する。</div></div>
      </div>
    </section>`;
}

function renderDownload(project) {
  const release = project.release || {};
  return `
    ${pageHead(project, "ダウンロード", `${project.name} の最新版と更新方法を確認できます。`)}
    <section class="section">
      <h2>最新版</h2>
      <div class="panel">
        <div class="row"><strong>バージョン</strong><div>${esc(release.version || "GitHubで確認")}</div></div>
        <div class="row"><strong>公開日</strong><div>${esc(formatDate(release.date))}</div></div>
        <div class="row"><strong>一般ユーザー向け</strong><div>${esc(release.assetName || "ReleaseページでSetup.exeを確認")}</div></div>
      </div>
      <div class="button-row">
        ${linkButton(release.directDownloadUrl, "Setup.exeをダウンロード", true)}
        ${linkButton(release.latestReleaseUrl, release.directDownloadUrl ? "Releaseページを見る" : "最新版Releaseを開く", !release.directDownloadUrl)}
      </div>
      ${release.status === "error" ? '<p class="muted small">GitHub APIから最新版を自動取得できませんでした。Releaseページから最新版を確認してください。</p>' : ""}
    </section>

    ${release.unsignedWarning ? `<section class="section"><div class="notice"><strong>Windowsの警告について</strong><p>${esc(release.unsignedWarning)}</p></div></section>` : ""}

    <section class="section">
      <h2>更新するとき</h2>
      <div class="panel">
        ${(project.updateSteps || []).map((step, index) => `<div class="row"><strong>${index + 1}</strong><div>${esc(step)}</div></div>`).join("")}
      </div>
    </section>`;
}

function renderStart(project) {
  return `
    ${pageHead(project, "はじめ方", "初回インストールから基本利用までを順番に確認できます。")}
    <section class="section">
      <div class="panel">
        ${(project.startSteps || []).map((step, index) => `<div class="row"><strong>STEP ${index + 1}</strong><div>${esc(step)}</div></div>`).join("") || '<div class="empty">手順はまだ登録されていません。</div>'}
      </div>
    </section>`;
}

function renderErrors(project) {
  return `
    ${pageHead(project, "エラー対処", "エラー表示や症状から、原因と最初に試すことを確認できます。")}
    <section class="section">
      <div class="error-list">
        ${(project.errors || []).map(error => `
          <details>
            <summary><span class="error-id">${esc(error.id)}</span>${esc(error.title)}</summary>
            <div class="details-body">
              ${error.message ? `<p><strong>表示例:</strong> <span class="term">${esc(error.message)}</span></p>` : ""}
              <p><strong>どういう状態？</strong> ${esc(error.meaning)}</p>
              <p><strong>まず試す:</strong> ${esc(error.firstAction)}</p>
              ${error.causes?.length ? `<p><strong>主な原因:</strong> ${esc(error.causes.join(" / "))}</p>` : ""}
              ${error.safeNote ? `<p class="small muted">${esc(error.safeNote)}</p>` : ""}
            </div>
          </details>`).join("") || '<div class="empty">エラー情報はまだ登録されていません。</div>'}
      </div>
    </section>`;
}

function renderSettings(project) {
  return `
    ${pageHead(project, "設定・用語", "画面に出る英語表記や専門用語を、日本語の意味と目安まで確認できます。")}
    <section class="section">
      <div class="table-wrap">
        <table>
          <thead><tr><th>画面の表記</th><th>日本語</th><th>意味</th><th>目安</th></tr></thead>
          <tbody>
            ${(project.settings || []).map(item => `<tr><td><span class="term">${esc(item.label)}</span></td><td><strong>${esc(item.ja)}</strong></td><td>${esc(item.description)}</td><td>${esc(item.recommendation || "-")}</td></tr>`).join("") || '<tr><td colspan="4">設定用語はまだ登録されていません。</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderFaq(project) {
  return `
    ${pageHead(project, "FAQ", "よくある質問と答えをまとめています。")}
    <section class="section"><div class="faq-list">
      ${(project.faq || []).map(item => `<details><summary>${esc(item.q)}</summary><div class="details-body"><p>${esc(item.a)}</p></div></details>`).join("") || '<div class="empty">FAQはまだ登録されていません。</div>'}
    </div></section>`;
}

function renderUpdates(project) {
  return `
    ${pageHead(project, "更新情報", "ガイドで把握している主な変更点と注意事項です。")}
    <section class="section">
      ${(project.changelog || []).map(item => `<div class="panel"><div class="row"><strong>${esc(item.version)}</strong><div>${esc(item.date || "")}</div></div>${(item.items || []).map(text => `<div class="row"><strong>変更</strong><div>${esc(text)}</div></div>`).join("")}</div>`).join("") || '<div class="empty">更新情報はまだ登録されていません。</div>'}
    </section>`;
}

function searchableItems(project) {
  return [
    { section: "overview", title: project.name, text: project.summary },
    ...(project.errors || []).map(item => ({ section: "errors", title: `${item.id} ${item.title}`, text: `${item.message || ""} ${item.meaning} ${item.firstAction} ${(item.causes || []).join(" ")}` })),
    ...(project.settings || []).map(item => ({ section: "settings", title: `${item.label} / ${item.ja}`, text: `${item.description} ${item.recommendation || ""}` })),
    ...(project.faq || []).map(item => ({ section: "faq", title: item.q, text: item.a }))
  ];
}

function renderSearch(project) {
  const query = state.query.trim().toLowerCase();
  if (!query) return "";
  const hits = searchableItems(project).filter(item => `${item.title} ${item.text}`.toLowerCase().includes(query));
  return `
    <section class="search-results">
      <h2>「${esc(state.query)}」の検索結果</h2>
      ${hits.length ? hits.map(hit => `<div class="search-hit"><button data-search-jump="${esc(hit.section)}">${esc(hit.title)}</button><p>${esc(hit.text)}</p></div>`).join("") : '<p class="muted">一致する項目がありません。エラー番号や英語表記をそのまま入力してみてください。</p>'}
    </section>`;
}

function setSection(section) {
  state.section = section;
  navButtons.forEach(button => button.classList.toggle("active", button.dataset.section === section));
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  const project = currentProject();
  const renderers = {
    overview: renderOverview,
    download: renderDownload,
    start: renderStart,
    errors: renderErrors,
    settings: renderSettings,
    faq: renderFaq,
    updates: renderUpdates
  };

  app.innerHTML = renderSearch(project) + (renderers[state.section] || renderOverview)(project);

  app.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", () => setSection(button.dataset.jump)));
  app.querySelectorAll("[data-search-jump]").forEach(button => button.addEventListener("click", () => {
    state.query = "";
    searchInput.value = "";
    setSection(button.dataset.searchJump);
  }));

  document.querySelector("#footerUpdated").textContent = `ガイド更新: ${project.updated || state.data.updated || "-"}`;
}

async function init() {
  try {
    const response = await fetch("./data/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`projects.json ${response.status}`);
    state.data = await response.json();

    if (!state.data.projects?.length) throw new Error("No projects");
    state.projectId = state.data.projects[0].id;
    projectSelect.innerHTML = state.data.projects.map(project => `<option value="${esc(project.id)}">${esc(project.name)}</option>`).join("");

    projectSelect.addEventListener("change", () => {
      state.projectId = projectSelect.value;
      setSection("overview");
    });
    navButtons.forEach(button => button.addEventListener("click", () => setSection(button.dataset.section)));
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value;
      render();
    });

    render();
    await Promise.allSettled(state.data.projects.map(hydrateRelease));
    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = '<div class="empty"><strong>ガイドデータを読み込めませんでした。</strong><p>ページを再読み込みしてください。</p></div>';
  }
}

init();
