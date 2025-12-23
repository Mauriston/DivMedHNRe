/**
 * CODE.GS - VERSÃO ATUALIZADA
 */

const SPREADSHEET_ID = '1dOa795N5fH2QQcizHl-E47SFSX8APB6nVWQZFDj3uMI';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Divisão de Medicina - HNRe')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// --- FUNÇÃO DE FÉRIAS ---
function getFeriasData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('FÉRIAS');
    if (!sheet) return [];

    const data = sheet.getDataRange().getDisplayValues();
    if (data.length < 2) return [];

    const headers = data[0].map(h => h.toString().trim().toLowerCase());
    const getIdx = (list) => { for (let n of list) { let i = headers.indexOf(n); if (i > -1) return i; } return -1; };

    const map = {
      corpo: getIdx(['corpo']),
      medico: getIdx(['médico', 'medico']),
      setor: getIdx(['setor']),
      inicio: getIdx(['início', 'inicio', 'start']),
      termino: getIdx(['término', 'termino', 'end']),
      obs: getIdx(['observações', 'obs'])
    };

    if (map.medico === -1) return [];

    const result = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const med = row[map.medico];
      const ini = row[map.inicio];
      const fim = row[map.termino];

      if (med && ini && fim) {
        result.push({
          Corpo: row[map.corpo] || '',
          Medico: med,
          Setor: row[map.setor] || 'Geral',
          Inicio: ini,
          Termino: fim,
          Obs: row[map.obs] || ''
        });
      }
    }
    return result;

  } catch (e) {
    console.error("Erro Férias: " + e.message);
    return [];
  }
}

// --- ESCALA ESPECIALISTAS ---
function getEscalaEspecialistas(ss) {
  try {
    let sheet = ss.getSheetByName('ESPECIALISTAS');
    if (!sheet) sheet = ss.getSheetByName('Especialistas');
    if (!sheet) return {}; 

    const data = sheet.getDataRange().getDisplayValues();
    if (data.length < 2) return {};

    const headers = data[0].map(h => h.toString().trim().toLowerCase());
    const getIdx = (term) => headers.indexOf(term);

    const mapIndex = {
      medico: getIdx('médico'),
      'ambulatório': Math.max(getIdx('ambulatórios'), getIdx('ambulatório')),
      'caapiose': getIdx('caapiose'),
      'cirurgias': Math.max(getIdx('cirurgias'), getIdx('cirurgia')),
      'enfermaria': getIdx('enfermaria'),
      'jrs': getIdx('jrs'),
      'naim': getIdx('naim'),
      'radiologia': getIdx('radiologia'),
      'regulação': getIdx('regulação'),
      'smi': getIdx('smi')
    };

    if (mapIndex.medico === -1) return {};

    const escalaMap = {}; 

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const medicoNome = row[mapIndex.medico];
      
      if (!medicoNome) continue;

      const keyMedico = medicoNome.toUpperCase().trim();
      escalaMap[keyMedico] = {};

      for (const [nomeSetor, colIndex] of Object.entries(mapIndex)) {
        if (colIndex === -1 || colIndex === mapIndex.medico) continue;
        const celula = row[colIndex] ? row[colIndex].toString() : "";
        if (!celula) continue;

        const horarios = celula.split(/,|\n|;/);
        horarios.forEach(h => {
          const texto = h.trim().toLowerCase();
          if(!texto) return;
          let dia = '', turno = '';

          if (texto.includes('segunda')) dia = 'seg';
          else if (texto.includes('terça') || texto.includes('terca')) dia = 'ter';
          else if (texto.includes('quarta')) dia = 'qua';
          else if (texto.includes('quinta')) dia = 'qui';
          else if (texto.includes('sexta')) dia = 'sex';

          if (texto.includes('manhã') || texto.includes('manha')) turno = 'manha';
          else if (texto.includes('tarde')) turno = 'tarde';

          if (dia && turno) {
            const slotKey = `${dia}-${turno}`;
            if (!escalaMap[keyMedico][slotKey]) escalaMap[keyMedico][slotKey] = [];
            const setorFormatado = nomeSetor.charAt(0).toUpperCase() + nomeSetor.slice(1);
            let setorFinal = setorFormatado;
            if (['jrs', 'smi', 'naim', 'caapiose'].includes(nomeSetor)) setorFinal = nomeSetor.toUpperCase();
            escalaMap[keyMedico][slotKey].push(setorFinal);
          }
        });
      }
    }
    return escalaMap;
  } catch (err) { return {}; }
}

function CALCULAR_CH(horarios, plantaoSpa) {
  let total = 0;
  if (horarios) {
    const listaH = horarios.toString().toLowerCase().split(/,|;|\n/);
    listaH.forEach(h => { if (h.includes('manh') || h.includes('tarde')) total += 6; });
  }
  if (plantaoSpa) {
    const listaP = plantaoSpa.toString().toLowerCase().split(/,|;|\n/);
    listaP.forEach(p => { if (p.includes('noite') || p.includes('sabado') || p.includes('sábado') || p.includes('domingo')) total += 12; });
  }
  return total;
}

function getMedicosData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('MÉDICOS');
    if (!sheet) throw new Error("Aba 'MÉDICOS' não encontrada.");
    const data = sheet.getDataRange().getDisplayValues();
    
    const escalaEspec = getEscalaEspecialistas(ss);
    const headers = data[0].map(h => h.toString().trim().toLowerCase());
    const getIdx = (list) => { for (let n of list) { let i = headers.indexOf(n); if (i > -1) return i; } return -1; };

    const map = {
      ant: getIdx(['ant', 'antiguidade']),
      medico: getIdx(['médico', 'medico', 'nome de guerra']),
      nome_civil: getIdx(['nome', 'nome completo', 'civil']),
      corpo: getIdx(['corpo']),
      especialidade: getIdx(['especialidade']),
      residente: getIdx(['residente']),
      hospital: getIdx(['hospital residencia', 'hospital']),
      setores: getIdx(['setores', 'setor']),
      horários: getIdx(['horários', 'horarios', 'escala']),
      plantao_spa: getIdx(['plantão fixo spa', 'plantao fixo spa']), 
      ch: getIdx(['ch', 'carga', 'carga horaria']),
      funcoes: getIdx(['funções', 'funcoes', 'função']),
      nip: getIdx(['nip']),
      email: getIdx(['e-mail', 'email']),
      celular: getIdx(['celular']),
      nascimento: getIdx(['nascimento']),
      idade: getIdx(['idade']),
      cpf: getIdx(['cpf']),
      identidade: getIdx(['identidade', 'rg']),
      crm: getIdx(['crm', 'crm-pe']), 
      rqe: getIdx(['rqe']),
      incorporacao: getIdx(['incorporação']),
      tempo: getIdx(['tempo serviço', 'tempo']),
      imagem: getIdx(['imagem', 'foto', 'img']),
      sim: getIdx(['sim']) // Mapeamento da coluna 'Sim'
    };

    if (map.medico === -1) throw new Error("Coluna 'Médico' não encontrada.");

    const rows = data.slice(1);
    return rows.map(r => {
      const val = (idx) => (idx > -1 && r[idx]) ? r[idx].toString().trim() : '';
      const nomeGuerra = val(map.medico);
      const medicoFinal = nomeGuerra || val(map.nome_civil) || "Desconhecido"; 
      const isRes = val(map.residente).toUpperCase();
      const residente = (isRes === 'TRUE' || isRes === 'SIM' || isRes === 'S') ? 'Sim' : 'Não';
      const chCalculada = CALCULAR_CH(val(map.horários), val(map.plantao_spa));

      return {
        Ant: parseInt(val(map.ant)) || 9999,
        Medico: medicoFinal,
        NomeCompleto: val(map.nome_civil),
        Corpo: val(map.corpo),
        Especialidade: val(map.especialidade),
        Residente: residente,
        HospitalResidencia: val(map.hospital),
        Setores: val(map.setores),
        Horarios: val(map.horários),
        PlantaoSPA: val(map.plantao_spa),
        CH: chCalculada, 
        Funcoes: val(map.funcoes),
        NIP: val(map.nip),
        Email: val(map.email),
        Celular: val(map.celular),
        Nascimento: val(map.nascimento),
        Idade: val(map.idade),
        CPF: val(map.cpf),
        Identidade: val(map.identidade),
        CRM: val(map.crm),
        RQE: val(map.rqe),
        Incorporacao: val(map.incorporacao),
        TempoServico: val(map.tempo),
        Imagem: val(map.imagem), 
        Renovacao: val(map.sim), // Nova propriedade
        EscalaEspecifica: escalaEspec[medicoFinal.toUpperCase().trim()] || null 
      };
    });
  } catch (e) {
    Logger.log("ERRO: " + e.toString());
    throw new Error(e.message);
  }
}
