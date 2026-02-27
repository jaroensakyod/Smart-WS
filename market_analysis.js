(function () {
    'use strict';

    const modal = document.getElementById('marketDashboardModal');
    if (!modal) return;

    const closeBtn = document.getElementById('marketDashboardClose');
    const refreshBtn = document.getElementById('btnRefreshMarketData');
    const analyzeBtn = document.getElementById('btnAnalyzeNiche');
    const keywordInput = document.getElementById('marketKeywordInput');

    const trendingRoot = document.getElementById('marketTrendingList');
    const seasonalRoot = document.getElementById('marketSeasonalList');
    const resultRoot = document.getElementById('marketOpportunityResult');

    function getData() {
        return window.SMARTWS_MARKET_TRENDS || { updatedAt: '-', niches: [], seasonal: [] };
    }

    function calcOpportunityScore(demand, competition) {
        const d = Math.max(1, Number(demand) || 1);
        const c = Math.max(1, Number(competition) || 1);
        const raw = (d / c) * 36;
        return Math.max(1, Math.min(100, Math.round(raw)));
    }

    function scoreLabel(score) {
        if (score >= 70) return 'สูงมาก';
        if (score >= 45) return 'น่าสนใจ';
        if (score >= 25) return 'กลาง';
        return 'ต่ำ';
    }

    function buildTrending() {
        if (!trendingRoot) return;
        const data = getData();
        trendingRoot.innerHTML = '';

        data.niches
            .slice()
            .sort((a, b) => calcOpportunityScore(b.demand, b.competition) - calcOpportunityScore(a.demand, a.competition))
            .forEach(item => {
                const score = calcOpportunityScore(item.demand, item.competition);
                const row = document.createElement('div');
                row.className = 'market-item';
                row.innerHTML = `
                    <div><strong>${item.keyword}</strong></div>
                    <div class="market-item-meta">${item.platform} • demand ${item.demand} • competition ${item.competition} • score ${score}</div>
                    <div class="market-item-meta">season: ${item.season}</div>
                `;

                const btn = document.createElement('button');
                btn.className = 'action-btn load-btn';
                btn.style.marginTop = '6px';
                btn.textContent = 'Generate This';
                btn.addEventListener('click', () => {
                    const target = document.getElementById(item.generator || '');
                    modal.style.display = 'none';
                    target?.click();
                });
                row.appendChild(btn);
                trendingRoot.appendChild(row);
            });
    }

    function buildSeasonal() {
        if (!seasonalRoot) return;
        const data = getData();
        seasonalRoot.innerHTML = '';
        data.seasonal.forEach(item => {
            const row = document.createElement('div');
            row.className = 'market-item';
            row.innerHTML = `<div><strong>${item.month}</strong> — ${item.focus}</div><div class="market-item-meta">แนะนำ: ${item.action}</div>`;
            seasonalRoot.appendChild(row);
        });
    }

    function analyzeKeyword() {
        if (!resultRoot) return;
        const kw = String(keywordInput?.value || '').trim().toLowerCase();
        if (!kw) {
            resultRoot.textContent = 'กรอกคีย์เวิร์ดก่อน เช่น tracing worksheet, scissor skills';
            return;
        }
        const data = getData();
        const hit = data.niches.find(item => item.keyword.toLowerCase().includes(kw) || kw.includes(item.keyword.toLowerCase()));

        if (hit) {
            const score = calcOpportunityScore(hit.demand, hit.competition);
            resultRoot.innerHTML = `Keyword: <strong>${kw}</strong><br>Opportunity Score: <strong>${score}/100 (${scoreLabel(score)})</strong><br>Platform: ${hit.platform}<br>Insight: demand ${hit.demand} vs competition ${hit.competition}`;
            return;
        }

        const tokens = kw.split(/\s+/).filter(Boolean);
        const demandHint = Math.min(90, 30 + tokens.length * 10 + (kw.includes('worksheet') ? 12 : 0) + (kw.includes('tracing') ? 14 : 0));
        const competitionHint = Math.max(18, 75 - tokens.length * 7 - (kw.includes('niche') ? 10 : 0));
        const score = calcOpportunityScore(demandHint, competitionHint);
        resultRoot.innerHTML = `Keyword: <strong>${kw}</strong><br>Opportunity Score (estimated): <strong>${score}/100 (${scoreLabel(score)})</strong><br>Demand hint: ${demandHint}<br>Competition hint: ${competitionHint}`;
    }

    function open() {
        modal.style.display = 'flex';
        buildTrending();
        buildSeasonal();
    }

    function close() {
        modal.style.display = 'none';
    }

    document.getElementById('btnOpenMarketDashboard')?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    refreshBtn?.addEventListener('click', () => {
        buildTrending();
        buildSeasonal();
    });
    analyzeBtn?.addEventListener('click', analyzeKeyword);
    keywordInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            analyzeKeyword();
        }
    });
    modal.addEventListener('click', (e) => {
        if (e.target?.id === 'marketDashboardModal') close();
    });
})();