(function () {
  "use strict";

  var R = window.ROADMAP;
  var STORE = "aieng-roadmap-v1";

  var state = { done: {}, filter: "all", query: "" };

  // ---------- storage ----------
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || "{}");
      state.done = saved.done || {};
    } catch (e) {}
  }
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({ done: state.done }));
    } catch (e) {}
  }

  // ---------- data helpers ----------
  function pad(i) { return String(i + 1).padStart(2, "0"); }
  function leafId(si, gi, li) { return si + "-" + gi + "-" + li; }

  function stageStats(si) {
    var total = 0, done = 0;
    R.stages[si].groups.forEach(function (g, gi) {
      g.leaves.forEach(function (_, li) {
        total++;
        if (state.done[leafId(si, gi, li)]) done++;
      });
    });
    return { done: done, total: total };
  }
  function overallStats() {
    var d = 0, t = 0;
    R.stages.forEach(function (_, si) { var s = stageStats(si); d += s.done; t += s.total; });
    return { done: d, total: t };
  }
  function nextStage() {
    for (var i = 0; i < R.stages.length; i++) {
      var s = stageStats(i);
      if (s.done < s.total) return i;
    }
    return -1;
  }

  // ---------- dom helpers ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function callout(cls, label, text) {
    var d = el("div", cls);
    d.appendChild(el("b", null, label));
    d.appendChild(el("span", null, text));
    return d;
  }

  // ---------- build: root -> phase -> stage -> topic groups, in learning order ----------
  var treeEl = document.getElementById("tree");

  function buildPhaseMark(phase) {
    var m = el("div", "n phase-mark p" + phase.id);
    m.dataset.phase = phase.id;
    m.appendChild(el("strong", null, phase.name));
    m.appendChild(el("span", null, phase.blurb));
    return m;
  }

  function buildGroup(si, gi) {
    var g = R.stages[si].groups[gi];
    var kid = el("div", "kid");
    kid.dataset.g = gi;
    var card = el("section", "branch");

    var h4 = el("h4");
    h4.appendChild(el("b", null, g.name));
    h4.appendChild(el("span"));
    card.appendChild(h4);
    var bar = el("div", "bar-s");
    bar.appendChild(el("i"));
    card.appendChild(bar);

    var ul = el("ul", "leaves");
    g.leaves.forEach(function (name, li) {
      var id = leafId(si, gi, li);
      var item = el("li");
      item.dataset.text = name.toLowerCase();
      var label = el("label");
      var input = el("input");
      input.type = "checkbox";
      input.checked = !!state.done[id];
      input.addEventListener("change", function () { toggleLeaf(id, input.checked); });
      label.appendChild(input);
      label.appendChild(el("span", null, name));
      item.appendChild(label);
      ul.appendChild(item);
    });
    card.appendChild(ul);
    kid.appendChild(card);
    kid.appendChild(el("span", "tail"));
    return kid;
  }

  function buildStage(si) {
    var st = R.stages[si];
    var art = el("article", "stage p" + st.phase);
    art.id = "stage-" + (si + 1);

    var node = el("div", "n s-node");
    var head = el("div", "s-head");
    head.appendChild(el("span", "s-num", pad(si)));
    head.appendChild(el("h3", "s-title", st.title));
    head.appendChild(el("span", "s-frac"));
    node.appendChild(head);
    var bar = el("div", "bar-s");
    bar.appendChild(el("i"));
    node.appendChild(bar);
    node.appendChild(el("p", "s-sum", st.summary));
    node.appendChild(callout("build", "Build this", st.build));
    art.appendChild(node);

    var kids = el("div", "kids");
    st.groups.forEach(function (_, gi) { kids.appendChild(buildGroup(si, gi)); });
    art.appendChild(kids);
    return art;
  }

  function buildTree() {
    treeEl.textContent = "";
    treeEl.appendChild(el("div", "n root", "AI Engineer"));
    var lastPhase = -1;
    R.stages.forEach(function (st, si) {
      if (st.phase !== lastPhase) {
        treeEl.appendChild(buildPhaseMark(R.phases[st.phase]));
        lastPhase = st.phase;
      }
      treeEl.appendChild(buildStage(si));
    });
  }

  // connectors need to know which visible group is first / last in its row
  function markEnds(kids) {
    var vis = Array.prototype.filter.call(kids.children, function (k) { return !k.hidden; });
    vis.forEach(function (k, i) {
      k.classList.toggle("first", i === 0 && vis.length > 1);
      k.classList.toggle("last", i === vis.length - 1 && vis.length > 1);
      k.classList.toggle("only", vis.length === 1);
    });
  }

  // ---------- update: counts, filter ----------
  function updateTree() {
    var q = state.query.trim().toLowerCase();
    var anyVisible = false;
    var phaseVisible = {};
    var next = nextStage();

    R.stages.forEach(function (st, si) {
      var art = document.getElementById("stage-" + (si + 1));
      var stats = stageStats(si);
      art.classList.toggle("complete", stats.done === stats.total);
      art.classList.toggle("next", si === next);
      art.querySelector(".s-frac").textContent = stats.done + "/" + stats.total;
      art.querySelector(".s-node .bar-s i").style.width = (stats.done / stats.total * 100) + "%";

      var stageVisible = false;
      art.querySelectorAll(".kid").forEach(function (kid) {
        var gi = Number(kid.dataset.g), gDone = 0, gVisible = false;
        kid.querySelectorAll(".leaves li").forEach(function (item, lj) {
          var checked = !!state.done[leafId(si, gi, lj)];
          if (checked) gDone++;
          var okQuery = q === "" || item.dataset.text.indexOf(q) !== -1;
          var okFilter = state.filter === "all" || (state.filter === "done" ? checked : !checked);
          var show = okQuery && okFilter;
          item.hidden = !show;
          if (show) gVisible = true;
        });
        var total = st.groups[gi].leaves.length;
        kid.hidden = !gVisible;
        kid.querySelector(".branch").classList.toggle("full", gDone === total);
        kid.querySelector("h4 span").textContent = gDone + "/" + total;
        kid.querySelector(".bar-s i").style.width = (gDone / total * 100) + "%";
        if (gVisible) stageVisible = true;
      });
      markEnds(art.querySelector(".kids"));
      art.hidden = !stageVisible;
      if (stageVisible) { anyVisible = true; phaseVisible[st.phase] = true; }
    });

    treeEl.querySelectorAll(".phase-mark").forEach(function (m) {
      m.hidden = !phaseVisible[m.dataset.phase];
    });
    document.getElementById("empty").hidden = anyVisible;
  }

  function updateOverall() {
    var s = overallStats();
    var pct = Math.round(s.done / s.total * 100);
    document.getElementById("pct").textContent = pct + "%";
    document.getElementById("count").textContent = s.done + " of " + s.total + " topics";
    document.getElementById("meter-fill").style.width = pct + "%";
    document.getElementById("meter").setAttribute("aria-valuenow", String(pct));
    var cont = document.getElementById("continue");
    var n = nextStage();
    cont.textContent = n === -1 ? "All done" : "Continue: " + pad(n);
    cont.disabled = n === -1;
  }

  function refresh() {
    updateTree();
    updateOverall();
  }

  // ---------- actions ----------
  function toggleLeaf(id, checked) {
    if (checked) state.done[id] = 1; else delete state.done[id];
    save();
    refresh();
  }
  function revealStage(si) {
    var el = document.getElementById("stage-" + (si + 1));
    if (el && !el.hidden) el.scrollIntoView({ block: "start" });
  }

  // ---------- wiring ----------
  function wire() {
    document.getElementById("continue").addEventListener("click", function () {
      var n = nextStage();
      if (n !== -1) revealStage(n);
    });
    document.getElementById("q").addEventListener("input", function (e) {
      state.query = e.target.value;
      updateTree();
    });
    document.querySelectorAll("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.filter = b.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(function (x) {
          var on = x === b;
          x.classList.toggle("on", on);
          x.setAttribute("aria-pressed", String(on));
        });
        updateTree();
      });
    });
    document.getElementById("reset").addEventListener("click", function () {
      state.done = {};
      save();
      document.querySelectorAll(".leaves input").forEach(function (i) { i.checked = false; });
      refresh();
    });
    window.addEventListener("hashchange", openFromHash);
  }

  function openFromHash() {
    var m = /^#stage-(\d+)$/.exec(location.hash);
    if (!m) return;
    var si = Number(m[1]) - 1;
    if (si >= 0 && si < R.stages.length) revealStage(si);
  }

  // ---------- start ----------
  load();
  buildTree();
  wire();
  refresh();
  openFromHash();
})();
