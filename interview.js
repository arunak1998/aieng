(function () {
  "use strict";

  var STAGES = window.ROADMAP.stages;
  var ALL = window.QUESTIONS.map(function (q, i) {
    return { id: i, stage: q[0], q: q[1], a: q[2] };
  });
  var STORE = "aieng-interview-v1";

  // stage: -1 means all stages
  var state = { stage: 0, query: "", known: {}, open: {} };

  function pad(i) { return String(i + 1).padStart(2, "0"); }

  // ---------- storage ----------
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE) || "{}");
      state.known = s.known || {};
      if (typeof s.stage === "number") state.stage = s.stage;
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ known: state.known, stage: state.stage })); } catch (e) {}
  }

  // ---------- data ----------
  function matches(item) {
    var q = state.query.trim().toLowerCase();
    if (q === "") return true;
    return item.q.toLowerCase().indexOf(q) !== -1 || item.a.toLowerCase().indexOf(q) !== -1;
  }
  function stageItems(si) {
    return ALL.filter(function (x) { return x.stage === si; });
  }
  function stageCounts(si) {
    var items = stageItems(si);
    return {
      total: items.length,
      known: items.filter(function (x) { return state.known[x.id]; }).length,
      found: items.filter(matches).length
    };
  }

  // ---------- small dom helpers ----------
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // ---------- rail ----------
  var railEl = document.getElementById("rail");
  function railNode(label, num, counts, active, onClick, phase) {
    var b = el("button", "rail-node" + (phase === undefined ? "" : " p" + phase) + (active ? " on" : "") + (counts.total && counts.known === counts.total ? " done" : ""));
    b.type = "button";
    b.setAttribute("aria-pressed", String(active));
    b.appendChild(el("span", "rn-dot", num));
    b.appendChild(el("span", "rn-t", label));
    var c = state.query.trim() !== "" ? counts.found + " found" : counts.known + "/" + counts.total;
    b.appendChild(el("span", "rn-c", c));
    b.addEventListener("click", onClick);
    return b;
  }
  function renderRail() {
    railEl.textContent = "";
    var allCounts = { total: ALL.length, known: 0, found: ALL.filter(matches).length };
    allCounts.known = ALL.filter(function (x) { return state.known[x.id]; }).length;
    railEl.appendChild(railNode("All stages", "∗", allCounts, state.stage === -1, function () { selectStage(-1); }));
    var lastPhase = -1;
    STAGES.forEach(function (st, si) {
      if (st.phase !== lastPhase) {
        railEl.appendChild(el("div", "rail-phase p" + st.phase, window.ROADMAP.phases[st.phase].name));
        lastPhase = st.phase;
      }
      railEl.appendChild(railNode(st.short, pad(si), stageCounts(si), state.stage === si, function () { selectStage(si); }, st.phase));
    });
  }

  // ---------- question flow ----------
  var mainEl = document.getElementById("qmain");

  function questionCard(item, n) {
    var known = !!state.known[item.id];
    var open = !!state.open[item.id];
    var li = el("li", "tl" + (known ? " known" : "") + (open ? " open" : ""));
    li.appendChild(el("span", "tl-dot", known ? "✓" : String(n)));

    var card = el("div", "tl-card");
    var q = el("button", "tl-q");
    q.type = "button";
    q.setAttribute("aria-expanded", String(open));
    q.appendChild(el("span", "tl-text", item.q));
    q.appendChild(el("span", "chev", "▸"));
    q.addEventListener("click", function () {
      state.open[item.id] = !state.open[item.id];
      render();
    });
    card.appendChild(q);

    if (open) {
      var ans = el("div", "tl-a");
      ans.appendChild(el("p", "", item.a));
      var k = el("button", "btn" + (known ? " on" : ""), known ? "Known ✓" : "Mark as known");
      k.type = "button";
      k.addEventListener("click", function () {
        if (state.known[item.id]) delete state.known[item.id]; else state.known[item.id] = 1;
        save();
        render();
      });
      ans.appendChild(k);
      card.appendChild(ans);
    }
    li.appendChild(card);
    return li;
  }

  function stageBlock(si, showIntro) {
    var items = stageItems(si).filter(matches);
    if (items.length === 0) return null;
    var st = STAGES[si];
    var c = stageCounts(si);
    var block = el("section", "qstage p" + st.phase);

    var head = el("div", "qhead");
    var title = el("h2", "", pad(si) + "  " + st.title);
    head.appendChild(title);
    if (showIntro) head.appendChild(el("p", "qintro", st.summary));
    head.appendChild(el("span", "chip", c.known + " of " + c.total + " known"));
    block.appendChild(head);

    var ol = el("ol", "timeline");
    items.forEach(function (item, i) { ol.appendChild(questionCard(item, i + 1)); });
    block.appendChild(ol);
    return block;
  }

  function renderFlow() {
    mainEl.textContent = "";
    var sel = state.stage === -1 ? STAGES.map(function (_, i) { return i; }) : [state.stage];
    var any = false;
    sel.forEach(function (si) {
      var block = stageBlock(si, state.stage !== -1);
      if (block) { mainEl.appendChild(block); any = true; }
    });
    if (!any) {
      mainEl.appendChild(el("p", "empty", "No questions match your search here. Clear the search or choose All stages."));
      return;
    }
    // next / previous stage links when viewing one stage
    if (state.stage !== -1 && state.query.trim() === "") {
      var nav = el("div", "stage-nav");
      if (state.stage > 0) {
        var p = el("button", "btn", "← " + STAGES[state.stage - 1].short);
        p.type = "button";
        p.addEventListener("click", function () { selectStage(state.stage - 1); });
        nav.appendChild(p);
      }
      if (state.stage < STAGES.length - 1) {
        var n = el("button", "btn primary", "Next: " + STAGES[state.stage + 1].short + " →");
        n.type = "button";
        n.addEventListener("click", function () { selectStage(state.stage + 1); });
        nav.appendChild(n);
      }
      mainEl.appendChild(nav);
    }
  }

  // ---------- overall stat ----------
  function renderStat() {
    var known = ALL.filter(function (x) { return state.known[x.id]; }).length;
    var pct = Math.round(known / ALL.length * 100);
    document.getElementById("known-pct").textContent = pct + "%";
    document.getElementById("known-count").textContent = known + " of " + ALL.length + " known";
    document.getElementById("meter-fill").style.width = pct + "%";
    document.getElementById("meter").setAttribute("aria-valuenow", String(pct));
  }

  function render() {
    renderRail();
    renderFlow();
    renderStat();
  }

  function selectStage(si) {
    state.stage = si;
    save();
    render();
    window.scrollTo({ top: document.querySelector(".qlayout").offsetTop - 70 });
  }

  // ---------- start ----------
  load();
  if (state.stage < -1 || state.stage >= STAGES.length) state.stage = 0;

  document.getElementById("dq").addEventListener("input", function (e) {
    state.query = e.target.value;
    // searching looks across everything
    if (state.query.trim() !== "" && state.stage !== -1) state.stage = -1;
    render();
  });
  document.getElementById("clear-known").addEventListener("click", function () {
    state.known = {};
    save();
    render();
  });
  render();
})();
