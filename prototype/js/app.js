(function (global) {
  const data = () => global.ENL_DATA;
  const store = () => global.ENL_STORE;

  const STAGE_MAP = {
    listen: { name: "入门泛听", order: 1 },
    scene: { name: "情景输入", order: 2 },
    advance: { name: "进阶", order: 3 }
  };

  const TYPE_LABEL = {
    local: "本地视频",
    direct: "直链播放",
    web: "B站入口",
    folder: "文件夹备忘"
  };

  function stageName(id) {
    return (STAGE_MAP[id] && STAGE_MAP[id].name) || id;
  }

  function getSeriesById(id) {
    return data().series.find((s) => s.id === id);
  }

  function getAgeMeta(filterId) {
    return data().ageFilters.find((a) => a.id === filterId) || data().ageFilters[0];
  }

  function matchAge(series, filterId) {
    if (!filterId || filterId === "all") return true;
    const f = getAgeMeta(filterId);
    if (f.min == null) return true;
    // overlap of ranges
    return series.ageMin <= f.max && series.ageMax >= f.min;
  }

  function filteredSeries(filterId) {
    return data()
      .series.filter((s) => matchAge(s, filterId))
      .slice()
      .sort((a, b) => {
        const sa = STAGE_MAP[a.stage].order - STAGE_MAP[b.stage].order;
        if (sa !== 0) return sa;
        return a.orderInStage - b.orderInStage;
      });
  }

  function recommend(filterId, limit) {
    limit = limit || 2;
    const list = filteredSeries(filterId);
    const doing = list.filter((s) => store().getProgress(s.id).status === "doing");
    if (doing.length) return doing.slice(0, limit);

    const todo = list.filter((s) => store().getProgress(s.id).status !== "done");
    const byStage = ["listen", "scene", "advance"];
    const picked = [];
    for (let i = 0; i < byStage.length && picked.length < limit; i++) {
      const stageItems = todo
        .filter((s) => s.stage === byStage[i])
        .sort((a, b) => a.orderInStage - b.orderInStage);
      for (const item of stageItems) {
        if (picked.length >= limit) break;
        picked.push(item);
      }
    }
    return picked;
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function renderShell(active) {
    const appName = data().appName;
    return {
      appName,
      navHtml: `
      <nav class="tabbar" aria-label="主导航">
        <a class="tab ${active === "home" ? "active" : ""}" href="index.html"><span class="ico">🏠</span><span>首页</span></a>
        <a class="tab ${active === "path" ? "active" : ""}" href="path.html"><span class="ico">🗺️</span><span>路径</span></a>
        <a class="tab ${active === "library" ? "active" : ""}" href="library.html"><span class="ico">📚</span><span>系列</span></a>
        <a class="tab ${active === "mine" ? "active" : ""}" href="mine.html"><span class="ico">👤</span><span>我的</span></a>
      </nav>`
    };
  }

  function renderAgeChips(selectedId, onAttr) {
    return data()
      .ageFilters.map((f) => {
        const active = f.id === selectedId ? "active" : "";
        return `<button type="button" class="chip ${active}" data-age="${f.id}" ${onAttr || ""}>${f.label}</button>`;
      })
      .join("");
  }

  function statusLabel(status) {
    return { todo: "未开始", doing: "进行中", done: "已完成" }[status] || status;
  }

  function seriesCard(s, extra) {
    const p = store().getProgress(s.id);
    const fav = p.favorite ? "♥" : "";
    return `
      <a class="series-card" href="detail.html?id=${s.id}" style="--accent:${s.accentColor}">
        <div class="series-cover">${s.nameZh.slice(0, 1)}</div>
        <div class="series-body">
          <div class="series-title">${s.nameZh} <span class="en">${s.nameEn}</span> ${fav}</div>
          <div class="series-meta">
            <span class="tag">${s.ageLabel}</span>
            <span class="tag tag-stage">${stageName(s.stage)}</span>
            <span class="tag tag-status">${statusLabel(p.status)}</span>
          </div>
          <p class="series-summary">${s.summary}</p>
          ${extra || ""}
        </div>
      </a>`;
  }

  function bindAgeChips(container, onChange) {
    if (!container) return;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-age]");
      if (!btn) return;
      const id = btn.getAttribute("data-age");
      store().setAgeFilter(id);
      container.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
      onChange && onChange(id);
    });
  }

  function resourceTypeLabel(t) {
    return TYPE_LABEL[t] || t;
  }

  global.ENL = {
    STAGE_MAP,
    TYPE_LABEL,
    stageName,
    getSeriesById,
    getAgeMeta,
    matchAge,
    filteredSeries,
    recommend,
    qs,
    renderShell,
    renderAgeChips,
    statusLabel,
    seriesCard,
    bindAgeChips,
    resourceTypeLabel
  };
})(window);
