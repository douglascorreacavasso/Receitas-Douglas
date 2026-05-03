/* ═══════════════════════════════════════
   RECEITAS DO DOUG — shared.js (VERSÃO CORRIGIDA v2)
═══════════════════════════════════════ */

const TK = 'thermo_tmb';
const DK = 'thermo_tdee';
const SK = 'thermo_sex';

const getTMB  = () => parseFloat(localStorage.getItem(TK)) || 1800;
const getTDEE = () => parseFloat(localStorage.getItem(DK)) || 2400;
const getSex  = () => localStorage.getItem(SK) || 'M';

function saveProfile(tmb, tdee, sex) {
  localStorage.setItem(TK, tmb);
  localStorage.setItem(DK, tdee);
  localStorage.setItem(SK, sex);
}

function getExtras() {
  const h = getTMB() / 24;
  return {
    barra:    Math.round(h * 0.45),
    goma:     Math.round(h * 0.35),
    shot:     Math.round(h * 0.30),
    cryo:     Math.round(h * 0.52), // Turbo mix + mentol térmico + glucomanana
    ignition: Math.round(h * 0.58)  // Turbo mix + álcool vasodilatador + absorção acelerada
  };
}

function getVersionKcal() {
  const E = getExtras();
  return {
    v1:       Math.round(E.barra * 0.70),
    v2:       Math.round(E.barra * 0.85),
    v3:       E.barra,
    goma:     E.goma,
    shot:     E.shot,
    cryo:     E.cryo,
    ignition: E.ignition
  };
}

function calcularSimulacao(tipoReceita, doses, dias) {
  const vKcal = getVersionKcal();
  const kcalBase = vKcal[tipoReceita] || vKcal.v3;
  const totalKcal = kcalBase * doses * dias;
  const gorduraG = (totalKcal / 7.7).toFixed(0);
  return { totalKcal: Math.round(totalKcal), gorduraG };
}

function imcCat(v) {
  if (v < 18.5) return 'Abaixo do peso';
  if (v < 25)   return 'Peso normal';
  if (v < 30)   return 'Sobrepeso';
  if (v < 35)   return 'Obesidade Grau I';
  if (v < 40)   return 'Obesidade Grau II';
  return 'Obesidade Grau III';
}

function buildDeco(layer) {
  if (!layer) return;
  layer.innerHTML = '';
  const items = ['🔥','🌡️','⚡','🍋','🍫','⚗️','✨','🌙'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;left:${Math.random()*95}%;top:${Math.random()*95}%;opacity:0.1;font-size:${15+Math.random()*20}px;pointer-events:none;z-index:0;animation:float ${3+Math.random()*4}s ease-in-out infinite;`;
    el.textContent = items[Math.floor(Math.random() * items.length)];
    layer.appendChild(el);
  }
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ═══════════════════════════
   DADOS COMPLETOS DAS RECEITAS
═══════════════════════════ */
const RECEITAS = {
  v1: {
    nome: 'Barra Termogênica V1 Base',
    emoji: '🍫',
    cor: '#f5a623',
    subtitulo: 'Iniciante · 9 ativos essenciais · ~4h de efeito',
    descricao: 'Ideal para começar e testar tolerância. Sabor suave de cacau.',
    ingredientes: [
      { nome: 'Cacau 100%',               acao: 'Base · reduz cortisol',          qtd: '15g' },
      { nome: 'Canela de Ceilão',         acao: 'Sensibilidade insulínica',        qtd: '2g' },
      { nome: 'Mel cru',                  acao: 'Liga os ingredientes',            qtd: '15ml' },
      { nome: 'Glucomanana em pó',        acao: 'Saciedade + gelifica',            qtd: '4g' },
      { nome: 'Psyllium husk',            acao: 'Fibra + textura',                 qtd: '3g' },
      { nome: 'Gengibre em pó',           acao: 'Termogênese +3%',                qtd: '2g' },
      { nome: 'Pimenta caiena',           acao: 'Capsaicina · TRPV1',              qtd: '0,5g' },
      { nome: 'EGCG (extrato chá verde)', acao: 'Oxidação de gordura +4%',         qtd: '200mg' },
      { nome: 'L-Glutamina',              acao: 'Proteção muscular',               qtd: '500mg' },
    ],
    preparo: [
      'Misture todos os pós secos em um bowl: cacau, canela, glucomanana, psyllium, gengibre, caiena, EGCG e L-glutamina.',
      'Adicione mel + 80ml de água morna. Mexa vigorosamente até obter massa homogênea.',
      'Despeje em forma. Espalhe em camada de ~1,5cm de altura.',
      'Geladeira por 2h. Cortar em barras de ~30g. Embrulhar individualmente com papel manteiga.',
    ],
    dose: '1 barra · 30–45 min antes das refeições · máx 3 barras/dia',
    armazenamento: 'Geladeira: 7 dias · Freezer: 30 dias · Rende: ~8–10 barras',
  },
  v2: {
    nome: 'Barra Termogênica V2 Ultra Anti-Cortisol',
    emoji: '🍫',
    cor: '#f5a623',
    subtitulo: 'Intermediário · V1 + Ashwagandha + Coating · ~4,5h',
    descricao: 'Tudo da V1 + ashwagandha KSM-66, alga kelp e coating de cacau 70%.',
    ingredientes: [
      { nome: 'Cacau 100%',               acao: 'Base · reduz cortisol',           qtd: '15g' },
      { nome: 'Canela de Ceilão',         acao: 'Sensibilidade insulínica',         qtd: '2g' },
      { nome: 'Mel cru',                  acao: 'Liga os ingredientes',             qtd: '15ml' },
      { nome: 'Glucomanana em pó',        acao: 'Saciedade + gelifica',             qtd: '4g' },
      { nome: 'Psyllium husk',            acao: 'Fibra + textura',                  qtd: '3g' },
      { nome: 'Gengibre em pó',           acao: 'Termogênese +3%',                 qtd: '2g' },
      { nome: 'Pimenta caiena',           acao: 'Capsaicina · TRPV1',               qtd: '0,5g' },
      { nome: 'EGCG (extrato chá verde)', acao: 'Oxidação de gordura +4%',          qtd: '200mg' },
      { nome: 'L-Glutamina',              acao: 'Proteção muscular',                qtd: '500mg' },
      { nome: 'Ashwagandha KSM-66',       acao: '↓ cortisol 20–30% em 8 semanas',  qtd: '600mg' },
      { nome: 'Alga Kelp',                acao: 'Iodo orgânico · produção T3/T4',   qtd: '150mg' },
      { nome: 'Manteiga de cacau',        acao: 'Coating · retarda absorção',        qtd: '20g' },
      { nome: 'Cacau 70% (cobertura)',    acao: 'Coating · endurece no frio',        qtd: '15g' },
    ],
    preparo: [
      'Misture todos os pós da V1 + ashwagandha + kelp em um bowl.',
      'Adicione mel + 80ml água morna. Mexa vigorosamente até formar massa homogênea.',
      'Forma. Camada 1,5cm. Geladeira 2h. Cortar em barras.',
      'Coating: derreta cacau 70% + manteiga de cacau em banho-maria. Mergulhe as barras. Freezer 10 min.',
      'Guardar embrulhado com papel manteiga. Geladeira ou freezer.',
    ],
    dose: '1 barra · 30–45 min antes das refeições · máx 3 barras/dia',
    armazenamento: 'Geladeira: 10 dias · Freezer: 45 dias · Rende: ~8–10 barras',
  },
  v3: {
    nome: 'Barra Termogênica V3 Ultimate',
    emoji: '🚀',
    cor: '#f5a623',
    subtitulo: 'Avançado · 20+ ativos · Combo 3 pimentas · ~5h+',
    descricao: 'A versão mais completa. Carnitina, CLA, café verde, 3 pimentas e muito mais.',
    ingredientes: [
      { nome: 'Cacau 100%',               acao: 'Base',                             qtd: '15g' },
      { nome: 'Canela de Ceilão',         acao: 'Sensibilidade insulínica',          qtd: '2g' },
      { nome: 'Mel cru',                  acao: 'Liga os ingredientes',              qtd: '15ml' },
      { nome: 'Glucomanana em pó',        acao: 'Saciedade + gelifica',              qtd: '4g' },
      { nome: 'Psyllium husk',            acao: 'Fibra + textura',                   qtd: '3g' },
      { nome: 'EGCG (extrato chá verde)', acao: 'Oxidação de gordura',               qtd: '200mg' },
      { nome: 'L-Glutamina',              acao: 'Proteção muscular',                 qtd: '500mg' },
      { nome: 'Ashwagandha KSM-66',       acao: '↓ cortisol 20–30%',               qtd: '600mg' },
      { nome: 'Alga Kelp',                acao: 'Iodo · metabolismo',                qtd: '150mg' },
      { nome: 'L-Carnitina tartarato',    acao: 'Transporte gordura → mitocôndria', qtd: '1.000mg' },
      { nome: 'CLA em pó',               acao: 'Oxidação de gordura',               qtd: '1g' },
      { nome: 'Extrato café verde',       acao: 'Ácido clorogênico',                 qtd: '500mg' },
      { nome: 'Laranja amarga',           acao: 'Sinefrina · queima',                qtd: '100mg' },
      { nome: 'Picolinato de cromo',      acao: 'Controle glicêmico',                qtd: '250µg' },
      { nome: 'Taurina',                  acao: 'Metabolismo lipídico',              qtd: '500mg' },
      { nome: 'Piperina',                 acao: '+20% biodisponibilidade',           qtd: '50mg' },
      { nome: 'Pimenta caiena',           acao: 'Capsaicina principal',              qtd: '1,5g' },
      { nome: 'Pimenta-preta em pó',      acao: 'Piperina · absorção',               qtd: '0,5g' },
      { nome: 'Dedo-de-moça em pó',       acao: 'Dihidrocapsaicina',                 qtd: '0,5g' },
      { nome: 'Manteiga de cacau',        acao: 'Coating',                           qtd: '20g' },
      { nome: 'Cacau 70% (cobertura)',    acao: 'Coating · sabor',                   qtd: '15g' },
    ],
    preparo: [
      'Misture TODOS os pós secos — todos da V2 + carnitina, CLA, café verde, laranja amarga, cromo, taurina, piperina e as 3 pimentas.',
      'Mel + ashwagandha + 150ml água morna. Mexa RÁPIDO — a glucomanana gelifica rapidamente!',
      'Forma. Camada 1,5cm. Geladeira 2h. Cortar em barras.',
      'Coating: cacau 70% + manteiga de cacau. Mergulhar barras. Freezer 10 min. Polvilhar cacau em pó.',
    ],
    dose: '1 barra · 30–45 min antes das refeições · máx 3/dia · ⚠️ comece na dose mínima de pimenta',
    armazenamento: 'Geladeira: 10 dias · Freezer: 60 dias · Rende: ~10 barras',
  },
  goma: {
    nome: 'Goma Mastigável de Limão',
    emoji: '🍋',
    cor: '#11c27a',
    subtitulo: 'Mastigável · Absorção dupla · ~4h de efeito',
    descricao: 'Discreta e prática. Mastigar devagar libera os ativos gradualmente pela mucosa bucal e trato digestivo.',
    ingredientes: [
      { nome: 'Gelatina sem sabor',       acao: 'Estrutura elástica',           qtd: '14g (lote 25)' },
      { nome: 'Agar-agar em pó',          acao: 'Textura firme · vegano',       qtd: '3g (lote)' },
      { nome: 'Suco de limão fresco',     acao: 'Sabor + vitamina C',           qtd: '60ml (lote)' },
      { nome: 'Pimenta caiena',           acao: 'Capsaicina · termogênese',     qtd: '2g (lote)' },
      { nome: 'Extrato chá verde (EGCG)', acao: 'Oxidação de gordura',          qtd: '2,5g (lote)' },
      { nome: 'Gengibre em pó',           acao: 'Termogênese + digestão',       qtd: '3,75g (lote)' },
    ],
    preparo: [
      'Ferva 80ml água. Adicione 3g agar-agar, mexa por 2 min. Deixar esfriar até ~50°C.',
      'Bowl separado: gelatina + suco de limão. Aguardar 5 min para hidratar.',
      'Misture agar + gelatina + mel. Mexa até incorporar completamente.',
      '⚠️ ABAIXO DE 45°C: adicione caiena + EGCG + gengibre. Mexa bem. (EGCG degrada acima de 45°C!)',
      'Forminhas silicone. Geladeira 2h. Rende ~25 gomas.',
    ],
    dose: '3 gomas · mastigar devagar (2–3 min cada) · 30 min antes das refeições · máx 3 doses/dia',
    armazenamento: 'Geladeira: 15 dias · Freezer: 90 dias · Rende: ~25 gomas/lote',
  },
  shot: {
    nome: 'Shot Gelificado Neutro',
    emoji: '⚗️',
    cor: '#8b5cf6',
    subtitulo: 'Dose concentrada · 40ml · ~3h de efeito',
    descricao: 'Absorção rápida (~15 min). Ideal para pré-treino. Beber com 200ml de água.',
    ingredientes: [
      { nome: 'Gelatina sem sabor', acao: 'Estrutura gelificada',       qtd: '20g (lote 10)' },
      { nome: 'Agar-agar em pó',   acao: 'Textura firme',               qtd: '5g (lote)' },
      { nome: 'Água filtrada',     acao: 'Base',                        qtd: '350ml (lote)' },
      { nome: 'Pimenta caiena',    acao: 'Capsaicina · TRPV1',          qtd: '1,2g (lote)' },
      { nome: 'EGCG (chá verde)',  acao: 'Oxidação de gordura',          qtd: '2g (lote)' },
      { nome: 'Gengibre em pó',    acao: 'Termogênese +3%',             qtd: '2g (lote)' },
      { nome: 'Piperina',          acao: '+20% biodisponibilidade',      qtd: '300mg (lote)' },
    ],
    preparo: [
      'Ferva 250ml água. Adicione 5g agar-agar, mexa por 2 min. Deixar esfriar até ~50°C.',
      'Bowl separado: 20g gelatina + 100ml água fria. Aguardar 5 min para hidratar.',
      '⚠️ ABAIXO DE 45°C: misture agar + gelatina + todos os ativos em pó. Mexa vigorosamente.',
      'Potinhos de 50ml. Geladeira 2h. Rende ~10 shots.',
    ],
    dose: '1 shot (40ml) com 200ml de água · 15–20 min antes do treino · máx 2 shots/dia',
    armazenamento: 'Geladeira: 7 dias · Freezer: 60 dias · Rende: ~10 shots/lote',
  },
  sono: {
    nome: 'Bala do Sono V2',
    emoji: '🌙',
    cor: '#3b9eff',
    subtitulo: 'Sono profundo · 7–8h · Recuperação noturna',
    descricao: 'Melatonina, magnésio, L-teanina, 5-HTP e mais. Otimiza GH, leptina e recuperação muscular.',
    ingredientes: [
      { nome: 'Valeriana em pó',    acao: '↑ GABA · sedação natural',         qtd: '100mg/bala' },
      { nome: 'Camomila em pó',     acao: 'Apigenina · ansiolítico leve',      qtd: '25mg/bala' },
      { nome: 'Magnésio glicinato', acao: 'Cofator GABA · relaxa músculos',    qtd: '200mg/bala' },
      { nome: 'L-Teanina',          acao: 'Ondas alfa · calma sem sedação',    qtd: '150mg/bala' },
      { nome: 'Glicina em pó',      acao: '↓ temperatura corporal central',    qtd: '1.000mg/bala' },
      { nome: '5-HTP',              acao: 'Precursor serotonina e melatonina', qtd: '50mg/bala' },
      { nome: 'Melatonina (gotas)', acao: '⚠️ Adicionar ABAIXO DE 38°C',     qtd: 'ver lote' },
      { nome: 'Gelatina sem sabor', acao: 'Base estrutural',                   qtd: '14g (lote)' },
      { nome: 'Agar-agar',          acao: 'Base estrutural',                   qtd: '3g (lote)' },
      { nome: 'Suco de limão',      acao: 'Sabor',                             qtd: '60ml (lote)' },
    ],
    preparo: [
      'Ferva 80ml água. Adicione 3g agar-agar, mexa por 2 min. Esfriar até ~50°C.',
      'Bowl separado: gelatina + suco de limão. Aguardar 5 min para hidratar.',
      'Infusão: valeriana + camomila em 70ml água quente. Tampar 10 min. Coar bem.',
      'Misture: agar + gelatina + chá morno. Adicione mel ou stevia a gosto.',
      'ABAIXO DE 45°C: adicione magnésio + L-teanina + glicina + 5-HTP. Mexa bem.',
      '🌡️ CRÍTICO — ABAIXO DE 38°C: adicione a melatonina em gotas! Ela se destrói acima de 40°C!',
      'Forminhas silicone. Geladeira 2h. Rende ~25 balas.',
    ],
    dose: '3–4 balas · 45–60 min antes de dormir · não usar com álcool',
    armazenamento: 'Geladeira: 15 dias · Freezer: 60 dias · Rende: ~25 balas/lote',
  },
  cryo: {
    nome: 'Shot Cryo-Fire (Sem Álcool)',
    emoji: '🧊',
    cor: '#00f5ff',
    subtitulo: 'Sem álcool · Contraste térmico · Mix Turbo',
    descricao: 'Contraste térmico extremo: mentol do Halls + capsaicina criam curto-circuito metabólico. Glucomanana para textura densa.',
    ingredientes: [
      { nome: '🧊 Água de coco ou suco de limão', acao: 'Líquido base gelado', qtd: '40ml' },
      { nome: '🟤 Halls Preta (sem açúcar)',       acao: 'Mentol · contraste térmico', qtd: '1 bala' },
      { nome: '🌿 Glucomanana (Konjac)',            acao: 'Espessante · densidade de gel', qtd: '3g' },
      { nome: '— MIX TURBO —',                    acao: 'Mistura de ativos abaixo', qtd: '' },
      { nome: 'Berberina HCL',                    acao: 'Queima & sensibilidade insulínica', qtd: '50mg' },
      { nome: 'Forskolina',                        acao: 'Queima & ativação AMPc', qtd: '20mg' },
      { nome: 'Picolinato de cromo',               acao: 'Controle glicêmico', qtd: '250µg' },
      { nome: 'L-Carnitina',                       acao: 'Transporte gordura → mitocôndria', qtd: '1.000mg' },
      { nome: 'L-Tirosina',                        acao: 'Energia & foco mental', qtd: '300mg' },
      { nome: 'Taurina',                           acao: 'Metabolismo lipídico', qtd: '500mg' },
      { nome: 'Gengibre',                          acao: 'Termogênese +3%', qtd: '600mg' },
      { nome: 'Pimenta caiena',                    acao: 'Capsaicina · TRPV1', qtd: '150mg' },
      { nome: 'Piperina',                          acao: '+20% biodisponibilidade', qtd: '50mg' },
      { nome: 'L-Glutamina',                       acao: 'Proteção intestinal', qtd: '500mg' },
    ],
    preparo: [
      'Dissolva 1 Halls Preta em 10ml de água quente. Deixe esfriar completamente.',
      'Misture o líquido base (água de coco ou limão gelado) com o concentrado de Halls já frio.',
      'Adicione todo o Mix de Ativos Turbo em pó.',
      'Adicione 3g de Glucomanana. Mexa vigorosamente por 30 segundos — ela gelifica rápido!',
      'Beba imediatamente, antes de gelificar demais.',
      'Finalize com 200ml de água bem gelada para expansão da fibra.',
    ],
    dose: '1 shot · 15–20 min antes do treino · máx 2 shots/dia · sempre com 200ml água gelada',
    armazenamento: 'Consumir imediatamente após preparo · Mix de pós seco: 30 dias em local fresco',
  },
  ignition: {
    nome: 'Shot Ignition (Com Álcool)',
    emoji: '🥃',
    cor: '#ff6b00',
    subtitulo: 'Com álcool · Vasodilatação · Absorção turbo',
    descricao: 'O álcool potencializa vasodilatação e absorção dos ativos amargos. Mentol + cacau criam sabor de chocolate com menta picante.',
    ingredientes: [
      { nome: '🥃 Vodka',                          acao: 'Vasodilatação · absorção acelerada', qtd: '20ml' },
      { nome: '🌶️ Licor de pimenta (ou cachaça)', acao: 'Potencializa capsaicina', qtd: '20ml' },
      { nome: '🟤 Halls Preta (triturada em pó)',  acao: 'Mentol · anestesia amargor', qtd: '1 bala' },
      { nome: '🍫 Cacau 100%',                     acao: 'Mascara amargor · chocolate/menta', qtd: '1,5g' },
      { nome: '— MIX TURBO —',                    acao: 'Mistura de ativos abaixo', qtd: '' },
      { nome: 'Berberina HCL',                    acao: 'Queima & sensibilidade insulínica', qtd: '50mg' },
      { nome: 'Forskolina',                        acao: 'Queima & ativação AMPc', qtd: '20mg' },
      { nome: 'Picolinato de cromo',               acao: 'Controle glicêmico', qtd: '250µg' },
      { nome: 'L-Carnitina',                       acao: 'Transporte gordura → mitocôndria', qtd: '1.000mg' },
      { nome: 'L-Tirosina',                        acao: 'Energia & foco mental', qtd: '300mg' },
      { nome: 'Taurina',                           acao: 'Metabolismo lipídico', qtd: '500mg' },
      { nome: 'Gengibre',                          acao: 'Termogênese +3%', qtd: '600mg' },
      { nome: 'Pimenta caiena',                    acao: 'Capsaicina · TRPV1', qtd: '150mg' },
      { nome: 'Piperina',                          acao: '+20% biodisponibilidade', qtd: '50mg' },
      { nome: 'L-Glutamina',                       acao: 'Proteção intestinal', qtd: '500mg' },
    ],
    preparo: [
      'Em um copo, misture a vodka e o licor de pimenta.',
      'Triture 1 Halls Preta até virar pó finíssimo. Misture diretamente ao álcool e mexa até dissolver.',
      'Incorpore o Mix de Ativos Turbo e o cacau em pó.',
      'Sirva em um copo de shot previamente resfriado no freezer.',
    ],
    dose: '1 shot · consumir com moderação · não usar pré-treino com exercício intenso · adultos responsáveis',
    armazenamento: 'Consumir imediatamente · Mix de pós seco: 30 dias em local fresco e seco',
  },
};

/* ═══════════════════════════
   PDF com receita + kcal
═══════════════════════════ */
function _gerarPDF(tipo, incluirKcal) {
  const r = RECEITAS[tipo];
  if (!r) return;
  const v    = getVersionKcal();
  const tmb  = getTMB();
  const kcalMap = { v1: v.v1, v2: v.v2, v3: v.v3, goma: v.goma, shot: v.shot, sono: 0 };
  const kcal = kcalMap[tipo] || 0;

  let secKcal = '';
  if (incluirKcal && kcal > 0) {
    secKcal = `
      <div class="section">
        <h2>⚡ Gasto calórico extra estimado</h2>
        <p style="font-size:12px;color:#555;margin-bottom:10px">
          Baseado no seu metabolismo basal de <strong>${Math.round(tmb)} kcal/dia</strong>.
          Valores representam calorias <em>extras queimadas</em> pela ação termogênica dos ativos.
        </p>
        <table>
          <tr><th>Doses/dia</th><th>Por dose</th><th>Por semana</th><th>Por mês</th><th>Gordura est./mês</th></tr>
          ${[1,2,3].map(d => {
            const sem = kcal * d * 7;
            const mes = kcal * d * 30;
            return `<tr>
              <td>${d}×/dia</td>
              <td style="color:#b84d00;font-weight:700">−${kcal} kcal</td>
              <td>−${sem} kcal</td>
              <td>−${mes} kcal</td>
              <td style="color:#b84d00">~${(mes/7700).toFixed(2)} kg</td>
            </tr>`;
          }).join('')}
        </table>
      </div>`;
  } else if (incluirKcal && kcal === 0) {
    secKcal = `<div class="section" style="background:#f0f7ff;border-left:4px solid #3b9eff;padding:12px 14px;border-radius:8px">
      <p>🌙 Esta receita não tem efeito termogênico. Objetivo: melhorar sono para otimizar GH, leptina, grelina e recuperação muscular.</p></div>`;
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<title>${r.nome}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;background:#fff;padding:28px;max-width:780px;margin:0 auto;font-size:13px}
.header{display:flex;align-items:center;gap:14px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #eee}
.emoji-big{font-size:44px;line-height:1}
h1{font-size:22px;color:${r.cor};margin-bottom:3px}
.subtitle{font-size:12px;color:#666;font-weight:600}
.section{margin-bottom:20px}
h2{font-size:13px;font-weight:700;color:${r.cor};margin-bottom:9px;padding-bottom:4px;border-bottom:1px solid #eee;text-transform:uppercase;letter-spacing:.05em}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:${r.cor};color:#fff;padding:8px 10px;text-align:left;font-size:11px}
td{padding:8px 10px;border-bottom:1px solid #eee;vertical-align:top}
tr:nth-child(even) td{background:#fafafa}
.act{font-size:11px;color:#888}
.qty{font-weight:700;color:${r.cor};white-space:nowrap}
ol{padding-left:18px;display:flex;flex-direction:column;gap:8px}
li{font-size:13px;line-height:1.65;color:#333}
.info-box{padding:10px 13px;border-radius:7px;font-size:13px;line-height:1.6;margin-top:6px}
.dose-box{background:#fff8ec;border-left:4px solid ${r.cor};color:#5a3200}
.arm-box{background:#f0f0f0;border-left:4px solid #aaa;color:#444;margin-top:7px}
.footer{margin-top:22px;padding-top:10px;border-top:1px solid #eee;font-size:11px;color:#aaa;display:flex;justify-content:space-between}
</style></head><body>
<div class="header">
  <div class="emoji-big">${r.emoji}</div>
  <div><h1>${r.nome}</h1><div class="subtitle">${r.subtitulo}</div></div>
</div>
${secKcal}
<div class="section">
  <h2>🧪 Ingredientes</h2>
  <table>
    <tr><th>Ingrediente</th><th>Ação</th><th>Quantidade</th></tr>
    ${r.ingredientes.map(i=>`<tr><td><strong>${i.nome}</strong></td><td class="act">${i.acao}</td><td class="qty">${i.qtd}</td></tr>`).join('')}
  </table>
</div>
<div class="section">
  <h2>👨‍🍳 Modo de preparo</h2>
  <ol>${r.preparo.map(p=>`<li>${p}</li>`).join('')}</ol>
</div>
<div class="section">
  <h2>📋 Como usar</h2>
  <div class="info-box dose-box">${r.dose}</div>
  <div class="info-box arm-box">📦 ${r.armazenamento}</div>
</div>
<div class="footer">
  <span>🔥 Receitas do Doug</span>
  <span>${incluirKcal && tmb ? 'TMB: '+Math.round(tmb)+' kcal/dia · ' : ''}${new Date().toLocaleDateString('pt-BR')}</span>
</div>
<script>window.onload=()=>window.print()<\/script>
</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

// Botão principal (com kcal do perfil)
function imprimirReceita(tipo)      { _gerarPDF(tipo, true); }
// Botão "só receita" (sem kcal)
function imprimirSoReceita(tipo)    { _gerarPDF(tipo, false); }
