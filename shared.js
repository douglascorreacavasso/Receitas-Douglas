/* ═══════════════════════════════════════
   RECEITAS DO DOUG — shared.js (VERSÃO FINAL CORRIGIDA)
═══════════════════════════════════════ */

// Chaves do LocalStorage
const TK = 'thermo_tmb';
const DK = 'thermo_tdee';
const SK = 'thermo_sex';

// Getters Seguros (evitam NaN se o utilizador ainda não calculou)
const getTMB  = () => parseFloat(localStorage.getItem(TK)) || 1800;
const getTDEE = () => parseFloat(localStorage.getItem(DK)) || 2400;
const getSex  = () => localStorage.getItem(SK) || 'M';

/**
 * Salva o perfil no navegador
 */
function saveProfile(tmb, tdee, sex) {
  localStorage.setItem(TK, tmb);
  localStorage.setItem(DK, tdee);
  localStorage.setItem(SK, sex);
}

/**
 * LÓGICA TERMOGÉNICA AJUSTADA
 * O cálculo agora usa um multiplicador mais realista para mostrar o impacto.
 * A base é o metabolismo por hora (TMB/24).
 */
function getExtras() {
  const h = getTMB() / 24;
  return {
    // Multiplicadores baseados na densidade de ativos de cada receita
    barra: Math.round(h * 0.45), // Aprox 35-50 kcal por dose (em vez de 6-10)
    goma:  Math.round(h * 0.35),
    shot:  Math.round(h * 0.30)
  };
}

/**
 * Retorna as calorias específicas por versão
 */
function getVersionKcal() {
  const E = getExtras();
  return {
    v1: Math.round(E.barra * 0.70),
    v2: Math.round(E.barra * 0.85),
    v3: E.barra,
    goma: E.goma,
    shot: E.shot
  };
}

/**
 * NOVA FUNÇÃO: SIMULADOR DE DOSES E TEMPO
 * Calcula o impacto acumulado que pediste (1 dose, 2 doses, 1 semana, etc)
 */
function calcularSimulacao(tipoReceita, doses, dias) {
  const vKcal = getVersionKcal();
  const kcalBase = vKcal[tipoReceita] || vKcal.v3; // usa v3 como padrão para barras
  
  const totalKcal = kcalBase * doses * dias;
  const gorduraG = (totalKcal / 7.7).toFixed(0); // 7.7kcal = 1g de gordura corporal

  return {
    totalKcal: Math.round(totalKcal),
    gorduraG: gorduraG
  };
}

/**
 * Classificação de IMC
 */
function imcCat(v) {
  if (v < 18.5) return 'Abaixo do peso';
  if (v < 25)   return 'Peso normal';
  if (v < 30)   return 'Sobrepeso';
  if (v < 35)   return 'Obesidade Grau I';
  if (v < 40)   return 'Obesidade Grau II';
  return 'Obesidade Grau III';
}

/**
 * Decoração de fundo (Efeito de partículas)
 */
function buildDeco(layer) {
  if (!layer) return;
  layer.innerHTML = ''; // Limpa antes de criar
  const items = ['🔥','🌡️','⚡','🍋','🍫','⚗️','✨','🌙'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    const e = items[Math.floor(Math.random() * items.length)];
    el.style.cssText = `
      position: absolute;
      left: ${Math.random() * 95}%;
      top: ${Math.random() * 95}%;
      opacity: 0.1;
      font-size: ${15 + Math.random() * 20}px;
      pointer-events: none;
      z-index: 0;
      animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
    `;
    el.textContent = e;
    layer.appendChild(el);
  }
}

/**
 * Feedback Toast
 */
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/**
 * GERAÇÃO DE PDF / IMPRESSÃO
 */
function imprimirReceita(tipo) {
  const v = getVersionKcal();
  const tmb = getTMB();
  const doses = [1, 2, 3];
  
  // Conteúdo básico para o PDF
  const info = {
    v1: { n: 'Barra V1 Base', k: v.v1, c: '#f5a623' },
    v2: { n: 'Barra V2 Ultra', k: v.v2, c: '#f5a623' },
    v3: { n: 'Barra V3 Ultimate', k: v.v3, c: '#f5a623' },
    goma: { n: 'Goma de Limão', k: v.goma, c: '#11c27a' },
    shot: { n: 'Shot Gelificado', k: v.shot, c: '#8b5cf6' },
    sono: { n: 'Bala do Sono', k: 0, c: '#3b9eff' }
  };

  const r = info[tipo];
  
  let tabelaHTML = '';
  if (r.k > 0) {
    tabelaHTML = `
      <table style="width:100%; border-collapse:collapse; margin-top:20px;">
        <tr style="background:${r.c}; color:white;">
          <th style="padding:10px;">Doses/Dia</th>
          <th>Extra/Semana</th>
          <th>Extra/Mês</th>
          <th>Queima Estimada (Mês)</th>
        </tr>
        ${doses.map(d => {
          const s = calcularSimulacao(tipo, d, 7);
          const m = calcularSimulacao(tipo, d, 30);
          return `
            <tr>
              <td style="padding:10px; border-bottom:1px solid #ddd;">${d} dose(s)</td>
              <td style="border-bottom:1px solid #ddd;">${s.totalKcal} kcal</td>
              <td style="border-bottom:1px solid #ddd;">${m.totalKcal} kcal</td>
              <td style="border-bottom:1px solid #ddd;">~${(m.gorduraG/1000).toFixed(2)}kg gordura</td>
            </tr>
          `;
        }).join('')}
      </table>
    `;
  }

  const win = window.open('', '_blank');
  win.document.write(`
    <html>
    <head><title>Receita - ${r.n}</title></head>
    <body style="font-family:sans-serif; padding:40px; line-height:1.6;">
      <h1 style="color:${r.c}">${r.n}</h1>
      <p>Este plano é personalizado para uma TMB de <strong>${tmb.toFixed(0)} kcal</strong>.</p>
      ${tabelaHTML}
      <p style="margin-top:30px; font-size:12px; color:gray;">Gerado por Receitas do Doug - Use com moderação.</p>
    </body>
    </html>
  `);
  win.document.close();
  win.print();
}