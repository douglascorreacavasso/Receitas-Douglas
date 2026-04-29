/* ── SHARED STATE & UTILITIES ── */
const THERMO = {
  get tmb(){ return parseFloat(localStorage.getItem('thermo_tmb')||2089) },
  get tdee(){ return parseFloat(localStorage.getItem('thermo_tdee')||2900) },
  get sex(){ return localStorage.getItem('thermo_sex')||'M' },
  get nome(){ return localStorage.getItem('thermo_nome')||'' },
  set(tmb,tdee,sex,nome){
    localStorage.setItem('thermo_tmb',tmb);
    localStorage.setItem('thermo_tdee',tdee);
    localStorage.setItem('thermo_sex',sex);
    localStorage.setItem('thermo_nome',nome||'');
  }
};

function getExtras(){
  const h = THERMO.tmb/24;
  return {
    barra: Math.round(h*0.08*5),
    goma:  Math.round(h*0.06*4),
    shot:  Math.round(h*0.05*3)
  };
}

function imcCat(v){
  if(v<18.5)return'Abaixo do peso';
  if(v<25)return'Peso normal';
  if(v<30)return'Sobrepeso';
  if(v<35)return'Obesidade grau I';
  if(v<40)return'Obesidade grau II';
  return'Obesidade grau III';
}

function toast(msg, duration=3000){
  let t=document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), duration);
}

function gerarPDF(tipo){
  const E = getExtras();
  const tmb2=Math.round(THERMO.tmb), tdee2=Math.round(THERMO.tdee);
  const cfg = {
    'v1':{nome:'Barra Termogênica V1 · Base',cor:'#D97706',corBg:'#fff8ee',corTx:'#7a3f00',
      kcal:Math.round(E.barra*.70),dur:'~4h',dose:'1 barra · 30–45 min antes das refeições · máx 3/dia',
      ings:[['Cacau em pó 100%','15g'],['Canela de Ceilão','2g'],['Mel cru','15ml'],
            ['Glucomanana em pó','4g (¼ col. sopa)'],['Psyllium husk','3g'],['Gengibre em pó','2g'],
            ['Pimenta caiena','0,5g'],['Extrato chá verde (EGCG)','200mg'],['L-Glutamina','500mg']],
      passos:['Misture todos os pós secos num bowl: cacau, glucomanana, psyllium, gengibre, caiena, EGCG, glutamina, canela.',
              'Adicione mel + 120ml de água morna. Mexa RÁPIDO — a glucomanana gelifica em 2–3 min!',
              'Despeje em forma retangular com plástico filme. Alise. Camada de 1,5cm. Geladeira 2h.',
              'Corte em barras de 5cm × 3cm quando frias. Embalar individualmente em papel manteiga.']},
    'v2':{nome:'Barra Termogênica V2 Ultra · Anti-cortisol',cor:'#D97706',corBg:'#fff8ee',corTx:'#7a3f00',
      kcal:Math.round(E.barra*.86),dur:'~5h',dose:'1 barra · 30–45 min antes das refeições · máx 3/dia',
      ings:[['Cacau em pó 100%','15g'],['Ashwagandha KSM-66','600mg'],['Canela de Ceilão','2g'],
            ['Mel cru','15ml'],['Glucomanana + psyllium + gengibre','doses V1'],
            ['Capsaicina + EGCG + glutamina','doses V1'],['Manteiga de cacau (coating)','30g'],
            ['Alga kelp em pó (coating)','1g'],['Pó de arroz (polvilhado)','10g'],
            ['Ashwagandha extra (polvilhado)','200mg']],
      passos:['Base: misture cacau, ashwagandha, canela, mel + ingredientes V1. Geladeira 2h.',
              'Corte as barras frias. Posicione sobre grade com papel manteiga.',
              'Coating: derreta manteiga de cacau em banho-maria (~35°C). Adicione kelp + canela.',
              'Mergulhe cada barra no coating. Trabalhe em lotes de 2–3 — endurece rápido.',
              'Freezer 10 min. Polvilhe com pó de arroz + ashwagandha + pitada de caiena.']},
    'v3':{nome:'Barra Termogênica V3 Ultimate',cor:'#D97706',corBg:'#fff8ee',corTx:'#7a3f00',
      kcal:E.barra,dur:'~5h+',dose:'1 barra · 30–45 min antes das refeições · máx 3/dia',
      ings:[['Tudo da V2','—'],['L-Carnitina tartarato','1.000mg'],['CLA em pó','1g'],
            ['Extrato café verde','500mg'],['Laranja amarga em pó','100mg'],
            ['Picolinato de cromo','250µg'],['Taurina','500mg'],['L-Tirosina','300mg'],
            ['Alho em pó','400mg'],['Piperina','50mg'],
            ['Combo pimentas: caiena 1,5g + pimenta-preta 0,5g + dedo-de-moça 0,5g','por barra']],
      passos:['Misture TODOS os pós secos. Adicione mel + 150ml água morna. Mexa RÁPIDO.',
              'Forma retangular + plástico filme. Camada 1,5cm. Geladeira 2h.',
              'Corte em barras 5cm × 3cm.',
              'Coating: manteiga de cacau 35°C + kelp + canela. Mergulhar por lotes.',
              'Freezer 10 min. Polvilhar com pó de arroz + ashwagandha + pitada de caiena.']},
    'goma':{nome:'Goma Mastigável de Limão',cor:'#059669',corBg:'#f0fdf4',corTx:'#064e3b',
      kcal:E.goma,dur:'~4h',dose:'3 gomas · mastigar devagar · 30 min antes das refeições',
      ings:[['Gelatina sem sabor','14g (total)'],['Agar-agar em pó','3g (total)'],
            ['Suco de limão fresco','60ml (total)'],['Pimenta caiena','80mg / goma'],
            ['Extrato chá verde (EGCG)','100mg / goma'],['Gengibre em pó','150mg / goma'],
            ['Mel ou stevia','a gosto']],
      passos:['Ferva 80ml de água. Adicione 3g agar-agar, mexa 2 min. Esfriar até ~50°C.',
              'Em outro bowl: 14g gelatina + 60ml suco de limão. Aguardar 5 min.',
              'Despeje agar (50°C) sobre a gelatina. Mexa até dissolver. Adicione mel.',
              'ABAIXO DE 45°C: adicione caiena + EGCG + gengibre. Mexa bem.',
              'Despeje nas forminhas de silicone. Geladeira 2h. Rende ~25 gomas.']},
    'shot':{nome:'Shot Gelificado Neutro',cor:'#7C3AED',corBg:'#f5f3ff',corTx:'#3b0764',
      kcal:E.shot,dur:'~3h',dose:'1 shot de 40ml · 30 min antes das refeições · beber 200ml água junto',
      ings:[['Gelatina sem sabor','20g (total)'],['Agar-agar em pó','5g (total)'],
            ['Água filtrada','350ml (total)'],['Pimenta caiena','120mg / shot'],
            ['Extrato chá verde (EGCG)','200mg / shot'],['Gengibre em pó','200mg / shot'],
            ['Piperina (pimenta-preta)','30mg / shot']],
      passos:['Ferva 250ml de água. Adicione 5g agar-agar, mexa 2 min. Esfriar até 50°C.',
              'Em bowl separado: 20g gelatina + 100ml água fria. Aguardar 5 min.',
              'Misture agar + gelatina. ABAIXO DE 45°C: adicione todos os ativos em pó.',
              'Despeje em potinhos de 50ml com tampa. Geladeira 2h. Rende ~10 shots.']},
    'sono':{nome:'Bala de Goma do Sono V2',cor:'#DB2777',corBg:'#fdf2f8',corTx:'#500724',
      kcal:null,dur:'Sono profundo 7–8h',dose:'3–4 balas · 45–60 min antes de dormir',
      ings:[['Gelatina sem sabor','14g total'],['Agar-agar em pó','3g total'],
            ['Suco de limão fresco','60ml total'],['Valeriana em pó','80–120mg / bala'],
            ['Camomila em pó','20–30mg / bala'],['Magnésio glicinato','200mg / bala'],
            ['L-Teanina','150mg / bala'],['Glicina em pó','1.000mg / bala'],
            ['5-HTP','50mg / bala'],['Melatonina (gotas)','ajustar por lote'],
            ['Mel ou stevia','a gosto']],
      passos:['Ferva 80ml água. Adicione 3g agar-agar, mexa 2 min. Esfriar até 50°C.',
              'Em bowl: 14g gelatina + 60ml suco de limão. Aguardar 5 min.',
              'Em 70ml água quente: infundir valeriana + camomila por 10 min tampado. Coar.',
              'Misture agar + gelatina + chá morno. Adicione mel. Mexa.',
              'ABAIXO DE 45°C: adicione magnésio + L-teanina + glicina + 5-HTP.',
              '⚠️ CRÍTICO — ABAIXO DE 38°C: adicione a melatonina (destrói-se acima de 40°C!).',
              'Despeje nas forminhas. Geladeira 2h. Rende ~25 balas.']}
  };

  const r = cfg[tipo];
  if(!r){ toast('Tipo inválido'); return; }
  const eK=r.kcal||0, eS=eK*7, eM=eK*30, gM=r.kcal?(eM/7700).toFixed(2):'—';

  const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Receita: ${r.nome}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;padding:28px;background:#fff;color:#1a1a1a;font-size:13px;max-width:820px;margin:0 auto}
h1{color:${r.cor};font-size:22px;margin-bottom:4px;font-weight:700}
.meta{color:#999;font-size:11px;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:12px}
h2{color:${r.cor};font-size:12px;font-weight:700;margin:22px 0 8px;border-bottom:2px solid ${r.cor};padding-bottom:5px;text-transform:uppercase;letter-spacing:.06em}
.kbox{background:${r.corBg};border:1.5px solid ${r.cor};border-radius:10px;padding:16px 20px;margin-bottom:20px}
.kbox strong{color:${r.cor};font-size:14px;display:block;margin-bottom:10px}
.kg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.ki{text-align:center}.kv{font-size:20px;font-weight:700;color:${r.cor}}.kl{font-size:11px;color:#777;margin-top:2px}
table{width:100%;border-collapse:collapse;margin-bottom:14px}
th{background:${r.cor};color:#fff;padding:9px 12px;text-align:left;font-size:12px;font-weight:600}
td{padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px}
tr:nth-child(even) td{background:#fafafa}
.qty{font-weight:700;color:${r.cor};text-align:right}
.step{display:flex;gap:12px;margin-bottom:10px;align-items:flex-start}
.sn{min-width:26px;height:26px;border-radius:50%;background:${r.cor};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;margin-top:1px}
.st{font-size:13px;line-height:1.65;color:#333}
.dose-box{margin-top:18px;padding:12px 16px;border-left:4px solid ${r.cor};background:${r.corBg};border-radius:0 8px 8px 0;font-size:12px;color:${r.corTx}}
.dose-box strong{display:block;margin-bottom:4px;font-size:13px}
footer{margin-top:28px;font-size:11px;color:#bbb;border-top:1px solid #eee;padding-top:12px;text-align:center}
@media print{body{padding:14px}.no-print{display:none}}
</style></head><body>
<h1>${r.nome}</h1>
<div class="meta">Gerado pelo App Termogênico · Mifflin-St Jeor · TMB: ${tmb2} kcal/dia · Gasto total: ${tdee2} kcal/dia · Sexo: ${THERMO.sex==='M'?'Masculino':'Feminino'}${THERMO.nome?' · '+THERMO.nome:''}</div>
<div class="kbox">
  <strong>⚡ Gasto calórico calculado para o seu perfil</strong>
  <div class="kg">
    <div class="ki"><div class="kv">${r.kcal?'+'+r.kcal+' kcal':'—'}</div><div class="kl">Extra por dose</div></div>
    <div class="ki"><div class="kv">~${eS} kcal</div><div class="kl">Extra / semana</div></div>
    <div class="ki"><div class="kv">~${eM} kcal</div><div class="kl">Extra / mês</div></div>
    <div class="ki"><div class="kv">~${gM} kg</div><div class="kl">Gordura / mês</div></div>
  </div>
</div>
<h2>Ingredientes — por unidade</h2>
<table><tr><th>Ingrediente</th><th style="text-align:right;width:180px">Quantidade</th></tr>
${r.ings.map(([n,q])=>`<tr><td>${n}</td><td class="qty">${q}</td></tr>`).join('')}
</table>
<h2>Modo de preparo</h2>
${r.passos.map((s,i)=>`<div class="step"><div class="sn">${i+1}</div><div class="st">${s}</div></div>`).join('')}
<div class="dose-box"><strong>📋 Dose recomendada</strong>${r.dose}<br><strong style="margin-top:6px;display:block">⏱ Duração do efeito</strong>${r.dur}</div>
<footer>App Termogênico · Receita gerada com base no perfil informado · Estimativas baseadas em estudos com capsaicina, EGCG e gengibre · Variação real ±30%</footer>
</body></html>`;

  const w=window.open('','_blank','width=860,height=720');
  if(w){ w.document.write(html); w.document.close(); setTimeout(()=>{ w.focus(); w.print(); },700); toast('PDF pronto! Use Ctrl+P para salvar.'); }
  else{ const b=new Blob([html],{type:'text/html'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='receita_'+tipo+'.html'; a.click(); toast('Arquivo salvo! Abra no navegador e imprima como PDF.'); }
}
