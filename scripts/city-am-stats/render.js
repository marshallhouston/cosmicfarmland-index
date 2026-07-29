// ---- scoring breakdown + per-hole detail (full field, Sunday) ----
// Both tables are the whole 39-player flight regardless of the picker above:
// they answer "what did everyone make", not "compare these names". Everything
// is derived from the same embedded cards the rest of the page runs on.
(function(){
  const BK = [
    {lab:'Eagle',  short:'Eag',  col:'var(--eagle)',           fill:'var(--eagle)',                           t:d=>d<=-2},
    {lab:'Birdie', short:'Bird', col:'var(--birdie)',          fill:'var(--birdie)',                          t:d=>d===-1},
    {lab:'Par',    short:'Par',  col:'var(--text-secondary)',  fill:'var(--line-dim)',                        t:d=>d===0},
    {lab:'Bogey',  short:'Bog',  col:'var(--bogey)',           fill:'var(--bogey)',                           t:d=>d===1},
    {lab:'Double', short:'Dbl',  col:'var(--dbl)',             fill:'var(--dbl)',                             t:d=>d===2},
    {lab:'Triple', short:'Trip', col:'var(--dbl)',             fill:'color-mix(in srgb,var(--dbl),#000 24%)', t:d=>d===3},
    {lab:'Quad',   short:'Quad', col:'var(--bad)',             fill:'color-mix(in srgb,var(--dbl),#000 42%)', t:d=>d===4},
    {lab:'5+',     short:'5+',   col:'var(--bad)',             fill:'color-mix(in srgb,var(--dbl),#000 58%)', t:d=>d>=5},
  ];
  const bIdx = d => { for(let j=0;j<BK.length;j++) if(BK[j].t(d)) return j; return BK.length-1; };
  const bar = counts =>
    `<div class="dbar" role="img" aria-label="score distribution: `
    + counts.map((c,i)=>c?`${c} ${BK[i].lab.toLowerCase()}`:null).filter(Boolean).join(', ') + `">`
    + counts.map((c,i)=> c?`<span style="flex:${c};background:${BK[i].fill}" title="${BK[i].lab}: ${c}"></span>`:'').join('')
    + `</div>`;
  const cnt = (c,i)=> `<td class="num${c?'':' z'}"${c?` style="color:${BK[i].col}"`:''}>${c||'·'}</td>`;

  // one row per player, in finishing order, plus a flight-total row
  let dh = `<thead><tr><th class="num">Pos</th><th>Player</th><th class="num">Sun</th><th class="num">To&nbsp;par</th>`
    + BK.map(b=>`<th class="num" style="color:${b.col}">${b.short}</th>`).join('')
    + `<th>Distribution</th></tr></thead><tbody>`;
  const total = BK.map(()=>0);
  P.forEach(p=>{
    const counts = BK.map(()=>0);
    p.r2.forEach((s,i)=>{ const j = bIdx(s-PAR[i]); counts[j]++; total[j]++; });
    const sun = p.r2.reduce((a,b)=>a+b,0), me = p.player===ME;
    dh += `<tr${me?' style="background:var(--me);font-weight:600"':''}>`
      + `<td class="num">${p.pos}</td><td>${short(p.player)}</td>`
      + `<td class="num">${sun}</td><td class="num">${fmt(sun-70)}</td>`
      + counts.map((c,i)=>cnt(c,i)).join('') + `<td>${bar(counts)}</td></tr>`;
  });
  dh += `<tr><td class="tot"></td><td class="tot"><b>Flight total</b></td><td class="num tot"></td><td class="num tot"></td>`
    + total.map((c,i)=>`<td class="num tot" style="color:${BK[i].col};font-weight:600">${c}</td>`).join('')
    + `<td class="tot">${bar(total)}</td></tr>`;
  document.getElementById('dist').innerHTML = dh + `</tbody>`;

  document.getElementById('distleg').innerHTML =
    BK.map(b=>`<span><i style="background:${b.fill}"></i>${b.lab}</span>`).join('');

  // one row per hole: field average, best, worst, and the outcome spread
  let hh = `<thead><tr><th class="num">Hole</th><th class="num">Par</th><th>Yds</th><th class="num">Rank</th>`
    + `<th class="num">Avg</th><th class="num">Best</th><th class="num">Worst</th>`
    + BK.map(b=>`<th class="num" style="color:${b.col}">${b.short}</th>`).join('')
    + `<th>Distribution</th></tr></thead><tbody>`;
  for(let i=0;i<18;i++){
    const scores = P.map(p=>p.r2[i]);
    const counts = BK.map(()=>0);
    scores.forEach(s=>counts[bIdx(s-PAR[i])]++);
    const avg = scores.reduce((a,b)=>a+b,0)/scores.length;
    const best = Math.min(...scores), worst = Math.max(...scores), d = avg-PAR[i], m = D.meta[i];
    hh += `<tr><td class="num">${i+1}</td><td class="num">${PAR[i]}</td><td class="sub2">${m.yards}</td>`
      + `<td class="num">#${m.rank}</td>`
      + `<td class="num">${avg.toFixed(2)} <span class="sub2">${(d>=0?'+':'')+d.toFixed(2)}</span></td>`
      + `<td class="num" style="color:${BK[bIdx(best-PAR[i])].col}">${best}</td>`
      + `<td class="num" style="color:${BK[bIdx(worst-PAR[i])].col}">${worst}</td>`
      + counts.map((c,j)=>cnt(c,j)).join('') + `<td>${bar(counts)}</td></tr>`;
  }
  document.getElementById('holestats').innerHTML = hh + `</tbody>`;
})();
