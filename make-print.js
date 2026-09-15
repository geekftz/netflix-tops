/* 从 netflix-top100.html 提取数据，生成 A4 打印优化版 HTML */
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "netflix-top100.html"), "utf8");
const chartText = src.match(/const CHART = (\[[\s\S]*?\]);/)[1];
const showsText = src.match(/const SHOWS = (\[[\s\S]*?\]);/)[1];
const CHART = eval(chartText);
const SHOWS = eval(showsText);

const krCount = SHOWS.filter(s => s.k).length;
const offCount = SHOWS.filter(s => s.off).length;
const countryCount = new Set(SHOWS.map(s => s.c)).size;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>Netflix 历史剧集 TOP 135 总榜</title>
<style>
  @page { size: A4; margin: 12mm 12mm 14mm; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif; color:#1c1c1e; font-size:9.5pt; line-height:1.6; }
  .cover { text-align:center; padding:14mm 0 8mm; border-bottom:2.5pt solid #e50914; margin-bottom:7mm; }
  .cover .brand { color:#e50914; font-weight:900; letter-spacing:4px; font-size:11pt; }
  .cover h1 { font-size:24pt; font-weight:900; margin:3mm 0 2mm; }
  .cover .sub { color:#666; font-size:9pt; }
  .cover .date { color:#999; font-size:8pt; margin-top:2mm; }
  .stats { display:flex; justify-content:center; gap:5mm; margin-top:6mm; }
  .stat { border:1pt solid #eee; border-radius:2mm; padding:2.5mm 5mm; }
  .stat b { display:block; font-size:15pt; color:#e50914; }
  .stat span { font-size:7.5pt; color:#777; }
  h2 { font-size:13pt; font-weight:900; margin:7mm 0 3mm; padding-left:2.5mm; border-left:3pt solid #e50914; break-after:avoid; }
  h2 .en { font-size:8pt; color:#999; font-weight:400; margin-left:2mm; }
  h3.grp { font-size:10.5pt; font-weight:800; color:#fff; background:#1c1c1e; display:inline-block; padding:1.2mm 3mm; border-radius:1mm; margin:5mm 0 1mm; break-after:avoid; }
  table { width:100%; border-collapse:collapse; font-size:9pt; }
  th { background:#f4f4f5; text-align:left; padding:1.8mm 2mm; font-size:8.5pt; color:#555; border-bottom:1.2pt solid #ddd; }
  td { padding:1.8mm 2mm; border-bottom:0.5pt solid #eee; vertical-align:top; }
  tr { break-inside:avoid; }
  .num { font-weight:800; color:#e50914; }
  .num.blue { color:#0b6bcb; }
  .krchip { display:inline-block; background:#e8f2ff; color:#0b57a4; font-size:7.5pt; font-weight:700; padding:0.3mm 1.6mm; border-radius:1mm; margin-left:1.5mm; }
  .offchip { display:inline-block; background:#fff8e1; color:#8a6d00; font-size:7.5pt; font-weight:700; padding:0.3mm 1.6mm; border-radius:1mm; margin-left:1.5mm; }
  .entry { display:flex; gap:4mm; padding:3mm 0; border-bottom:0.6pt solid #eee; break-inside:avoid; }
  .e-rank { flex:0 0 9mm; text-align:center; font-size:14pt; font-weight:900; color:#e50914; line-height:1.2; }
  .e-rank .of { display:block; font-size:6.5pt; color:#bbb; font-weight:400; }
  .e-poster { flex:0 0 19mm; }
  .e-poster img { width:19mm; height:28mm; object-fit:cover; border-radius:1.2mm; background:#f0f0f1; display:block; }
  .e-ph { width:19mm; height:28mm; border-radius:1.2mm; background:linear-gradient(150deg,#8b0000,#e50914); color:#fff; display:flex; align-items:center; justify-content:center; font-size:14pt; font-weight:900; }
  .e-body { flex:1; }
  .e-title { font-size:11pt; font-weight:900; }
  .e-title .orig { font-size:8pt; color:#999; font-weight:400; margin-left:1.5mm; }
  .e-meta { font-size:8pt; color:#777; margin:0.6mm 0; }
  .e-metric { font-size:8.5pt; font-weight:800; color:#e50914; margin:0.6mm 0; }
  .e-metric.blue { color:#0b6bcb; }
  .e-metric .note { font-weight:400; color:#999; font-size:7.5pt; }
  .e-cast { font-size:8pt; color:#555; margin:0.6mm 0; }
  .e-cast b { color:#888; }
  .e-desc { font-family:"Songti SC","Noto Serif CJK SC",serif; font-size:8.5pt; color:#333; line-height:1.7; }
  .footer { margin-top:8mm; padding-top:4mm; border-top:1pt solid #ddd; font-size:7.5pt; color:#999; line-height:1.8; }
</style>
</head>
<body>
<div class="cover">
  <div class="brand">NETFLIX</div>
  <h1>Netflix 历史剧集 TOP ${SHOWS.length} 总榜</h1>
  <div class="sub">Most-Watched Netflix Series of All Time · 观看量数据来自 Netflix 官方 Top10 榜单与半年度观看时长报告</div>
  <div class="date">数据截至 2026 年 8 月官方榜单 · 整理于 2026 年 9 月</div>
  <div class="stats">
    <div class="stat"><b>${SHOWS.length}</b><span>收录剧集</span></div>
    <div class="stat"><b>${krCount}</b><span>其中韩剧</span></div>
    <div class="stat"><b>${offCount}</b><span>官方历史TOP10在榜</span></div>
    <div class="stat"><b>${countryCount}</b><span>国家/地区</span></div>
    <div class="stat"><b>2013–2026</b><span>年份跨度</span></div>
  </div>
</div>

<h2>一、Netflix 官方历史 TOP 10（按季 · 上线 91 天观看量）</h2>
<table>
  <thead><tr><th style="width:8mm">#</th><th>剧集（季）</th><th style="width:26mm">91天观看量</th><th style="width:18mm">备注</th></tr></thead>
  <tbody id="chartBody"></tbody>
</table>

<h2>二、韩剧专区索引<span class="en">全部 ${krCount} 部韩剧速览，按综合热度排序</span></h2>
<table>
  <thead><tr><th style="width:12mm">总排名</th><th>剧名</th><th style="width:16mm">年份</th><th style="width:34mm">观看数据</th><th style="width:22mm">题材</th></tr></thead>
  <tbody id="kdBody"></tbody>
</table>

<h2>三、完整榜单<span class="en">含上映年份、简介、主演、封面与观看数据</span></h2>
<div id="list"></div>

<div class="footer">
  <b>数据说明</b><br>
  1. 「91天观看量（Views）」为 Netflix 官方口径：上线 91 天内观看次数（观看时长 ÷ 单季时长）；「观看时长」为 Netflix 半年度参与度报告口径（累计小时）。两种口径不可直接比较。<br>
  2. 标注「★官方历史TOP10」的剧集为截至 2026 年 8 月仍在 Netflix 官方历史总榜的作品；同一剧集多季在榜时取最高单季数据。<br>
  3. 综合排名以官方数据为锚，兼顾影响力与口碑排序；数据来源：Netflix Top10、Netflix Engagement Report、What's on Netflix、维基百科及公开报道。封面来自 TVmaze 公开接口。<br>
  4. 本文档仅用于学习交流，不存储任何版权内容。
</div>

<script>
const CHART = ${chartText};
const SHOWS = ${showsText};
const fmt = v => v==null ? "" : (v>=100 ? (v/100).toFixed(2).replace(/0+$/,"").replace(/\\.$/,"")+" 亿" : (v*100).toFixed(0).replace(/(\\d)(?=(\\d{3})+$)/g,"$1,")+" 万");
const metricText = s => s.v!=null ? {txt:\`91天观看量 \${fmt(s.v)}\`, note:s.mn||"", cls:""} : (s.h!=null ? {txt:\`观看时长 \${fmt(s.h)} 小时\`, note:s.mn||"", cls:"blue"} : null);

/* 官方 TOP10 表 */
document.querySelector("#chartBody").innerHTML = CHART.map((c,i)=>
  \`<tr><td class="num">\${i+1}</td><td>\${c.name}\${c.kr?'<span class="krchip">韩剧</span>':''}</td><td class="num\${c.kr?' blue':''}">\${fmt(c.v)}</td><td>\${c.kr?'韩国':''}</td></tr>\`
).join("");

/* 韩剧索引表 */
document.querySelector("#kdBody").innerHTML = SHOWS.filter(s=>s.k).sort((a,b)=>a.r-b.r).map(s=>{
  const m = metricText(s);
  return \`<tr><td class="num">#\${s.r}</td><td><b>\${s.cn}</b> <span style="color:#999;font-size:8pt">\${s.t}</span></td><td>\${s.ys}</td><td class="num \${m?m.cls:''}">\${m?m.txt:'全球热播'}</td><td>\${s.g.slice(0,2).join(' / ')}</td></tr>\`;
}).join("");

/* 完整榜单 */
const groups = [{from:1,label:"第一梯队 · 官方数据榜（TOP 1–30）"},{from:31,label:"全球经典剧集（TOP 31–87）"},{from:88,label:"韩剧精选（TOP 88–135）"}];
let html = "";
SHOWS.forEach(s=>{
  const grp = groups.find(g=>g.from===s.r);
  if (grp) html += \`<h3 class="grp">\${grp.label}</h3>\`;
  const m = metricText(s);
  html += \`
  <div class="entry">
    <div class="e-rank">\${s.r}<span class="of">/ 135</span></div>
    <div class="e-poster" id="ph_\${s.r}"><div class="e-ph">\${(s.cn||s.t).charAt(0)}</div></div>
    <div class="e-body">
      <div class="e-title">\${s.cn}<span class="orig">\${s.t}</span>\${s.k?'<span class="krchip">韩剧</span>':''}\${s.off?'<span class="offchip">★ 官方历史TOP10</span>':''}</div>
      <div class="e-meta">\${s.ys} · \${s.c} · \${s.lg} · \${s.ty} · \${s.g.join(' / ')}</div>
      \${m ? \`<div class="e-metric \${m.cls}">\${m.txt}<span class="note">\${m.note?' · '+m.note:''}</span></div>\` : ''}
      <div class="e-cast"><b>主演：</b>\${s.cast.join(' / ')}</div>
      <div class="e-desc">\${s.d}</div>
    </div>
  </div>\`;
});
document.querySelector("#list").innerHTML = html;

/* 海报加载（TVmaze，8并发，429重试一次） */
function tfetch(url, ms){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), ms||8000);
  return fetch(url,{signal:ctrl.signal}).finally(()=>clearTimeout(t));
}
async function posterURL(s){
  const q = encodeURIComponent(s.q || s.t);
  const tryOnce = async (retried)=>{
    const res = await tfetch(\`https://api.tvmaze.com/search/shows?q=\${q}\`, 8000);
    if (res.status===429 && !retried){ await new Promise(r=>setTimeout(r,1800)); return tryOnce(true); }
    if (!res.ok) return null;
    const arr = await res.json();
    if (!arr || !arr.length) return null;
    let best=arr[0].show, bs=-1;
    for (const it of arr.slice(0,6)){
      const sh=it.show; let sc=0;
      const py = sh.premiered ? parseInt(sh.premiered.slice(0,4)) : null;
      if (py===s.y) sc+=4; else if (py && Math.abs(py-s.y)<=1) sc+=1;
      const qn=(s.q||s.t).toLowerCase().replace(/[^a-z0-9]/g,""), sn=(sh.name||"").toLowerCase().replace(/[^a-z0-9]/g,"");
      if (sn===qn) sc+=3; else if (sn.includes(qn)||qn.includes(sn)) sc+=1;
      if (sh.image) sc+=2;
      if (sc>bs){ bs=sc; best=sh; }
    }
    return best.image && (best.image.medium || best.image.original) || null;
  };
  try { return await tryOnce(false); } catch(e){ return null; }
}
(async ()=>{
  const queue = SHOWS.slice(); let active = 0;
  await new Promise(done=>{
    const pump = ()=>{
      while (active < 8 && queue.length){
        const s = queue.shift(); active++;
        posterURL(s).then(url=>{
          if (url){
            const box = document.getElementById("ph_"+s.r);
            const img = new Image();
            img.onload = ()=>{ box.innerHTML=""; box.appendChild(img); };
            img.src = url;
          }
        }).finally(()=>{ active--; pump(); });
      }
      if (!queue.length && !active) done();
    };
    pump();
  });
  document.title = "READY";
})();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "netflix-top100-print.html"), html);
console.log("print html written,", SHOWS.length, "shows,", krCount, "k-dramas");
