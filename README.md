# Documentação Técnica: Divisão de Medicina - HNRe

## 1. Dicionário de Dados (Database Schema)

O sistema utiliza planilhas (CSV/Sheets) como fonte de dados persistente. A estrutura não é rígida (baseada em índices fixos), mas sim dinâmica, baseada em cabeçalhos, conferindo robustez contra reordenação de colunas.

### 1.1 Tabela Principal: MÉDICOS (`ATUALIZAÇÃO MÉDICOS HNRE - MÉDICOS.csv`)

Esta tabela contém o cadastro mestre dos oficiais médicos e residentes.

| Nome da Coluna (Header) | Tipo de Dado | Descrição Técnica |
| --- | --- | --- |
| **Ant / Antiguidade** | `Integer` | Índice de antiguidade. Usado para ordenação hierárquica. Chave de ordenação secundária. |
| **NIP** | `String` | Identificador único (ID) do militar. Atua como Chave Primária lógica. |
| **Nome / Civil** | `String` | Nome completo civil do médico. |
| **Médico / Nome de Guerra** | `String` | Nome de apresentação (Ex: "CT (Md) MAURISTON"). Usado como Label principal na UI. |
| **Horários** | `String` | Texto livre delimitado (vírgula/quebra de linha) descrevendo a grade horária (Ex: "Segunda manhã, Terça tarde"). |
| **Corpo** | `String` | Enum (Categoria): `CSM` (Corpo de Saúde), `SMV` (Voluntários), `SMO` (Médicos Operativos). Define a cor e coluna no Kanban. |
| **Especialidade** | `String` | Especialidade médica. Usado para filtros e estatísticas. |
| **Residente** | `Boolean` | Flag indicando se é residente (`TRUE`/`FALSE`). Mapeado no backend para String "Sim"/"Não". |
| **Setores** | `String` | Lista delimitada de setores onde o médico atua (Ex: "JRS, Ambulatório"). Base para tags no Kanban. |
| **Plantão Fixo SPA** | `String` | Texto descrevendo plantões no Serviço de Pronto Atendimento. |
| **CH / Carga** | `Integer` | Carga Horária calculada ou estática. Nota: O backend recalcula isso dinamicamente. |
| **Funções** | `String` | Lista de cargos administrativos (Ex: "Encarregado Radiologia"). |
| **Imagem / Foto** | `String` | URL pública da foto do perfil (geralmente imgur). |
| **Sim** | `String` | **Renovação/Status**. Usado para indicar se o médico vai renovar contrato. Valores como "Não" ou "Talvez" acionam o estilo visual de "Baixa" (riscado/opaco). |

### 1.2 Tabela: FÉRIAS (`ATUALIZAÇÃO MÉDICOS HNRE - FÉRIAS.csv`)

Registra os períodos de afastamento.

| Nome da Coluna | Tipo de Dado | Descrição Técnica |
| --- | --- | --- |
| **FeriasID** | `String` | Chave Primária do registro de férias (Ex: "F.1"). |
| **Médico** | `String` | Chave Estrangeira (lógica) referenciando a coluna `Médico` da tabela principal. |
| **Início** | `Date (String)` | Data de início no formato `dd/MM/yyyy`. |
| **Término** | `Date (String)` | Data de fim no formato `dd/MM/yyyy`. |
| **Setor** | `String` | Setor associado àquelas férias. |

---

## 2. Documentação do Backend (`Code.gs`)

O backend é escrito em Google Apps Script (JavaScript ES5/ES6 híbrido). Ele atua como uma API RESTful simplificada através da função `doGet` e chamadas RPC (`google.script.run`).

### 2.1 Mapeamento Dinâmico de Colunas (Pattern de Robustez)

O código não confia em índices de coluna fixos (ex: `row[0]`). Em vez disso, implementa um padrão de descoberta de índices:

1. Lê a primeira linha (Headers).
2. Normaliza os headers (lowercase, trim).
3. Cria um objeto mapa (`const map = { ... }`) que associa a chave lógica (ex: `medico`) ao índice numérico da coluna, buscando por sinônimos (ex: procura por 'médico', 'medico', 'nome de guerra').

**Trecho de Código Relevante (`getMedicosData`):**

```javascript
const map = {
  // ...
  medico: getIdx(['médico', 'medico', 'nome de guerra']),
  sim: getIdx(['sim']) // Mapeia a coluna 'Sim' para lógica de renovação
  // ...
};

```

### 2.2 Funções Principais

#### `doGet()`

Responsável pelo *Server-Side Rendering* (SSR) inicial.

* Carrega o arquivo `Index.html`.
* Define metadados (Viewport, Title).
* **Retorno:** Objeto `HtmlOutput`.

#### `getMedicosData()`

A função *core* do sistema.

1. **Orquestração:** Chama `getEscalaEspecialistas(ss)` primeiro para obter dados detalhados da grade.
2. **Fetch:** Obtém todos os dados da aba 'MÉDICOS'.
3. **Transformação:** Itera sobre as linhas (slice(1)) convertendo arrays em objetos JSON.
4. **Regras de Negócio:**
* Normaliza booleanos de residentes.
* Chama `CALCULAR_CH` para computar horas.
* Anexa o objeto `EscalaEspecifica` (vindo da outra função) ao objeto do médico.


5. **Tratamento de Erro:** Encapsulado em `try...catch` para retornar erros legíveis ao frontend.

#### `getEscalaEspecialistas(ss)`

Parser complexo para transformar uma "Matriz Visual" (Planilha cruzada: Médicos nas linhas x Setores nas colunas) em dados estruturados.

* **Lógica de Parsing:**
* Itera sobre cada célula de setor.
* Analisa o conteúdo da célula buscando palavras-chave de dia (`segunda`, `terça`...) e turno (`manhã`, `tarde`).
* **Saída:** Um Hash Map onde a chave é o nome do médico e o valor é um objeto `{ "dia-turno": ["Setor1", "Setor2"] }`.



#### `CALCULAR_CH(horarios, plantaoSpa)`

Calculadora de Carga Horária.

* **Algoritmo:**
* Tokeniza as strings de horário.
* Turnos de rotina ("manhã", "tarde") somam **6 horas**.
* Plantões SPA ("noite", "sábado", "domingo") somam **12 horas**.



---

## 3. Documentação do Frontend (`Index.html`)

O frontend é uma *Single Page Application* (SPA) manual, contida em um único arquivo HTML que inclui CSS e JS.

### 3.1 Estrutura Visual e Navegação

Utiliza um sistema de classes `.hidden` para alternar entre as views sem recarregar a página.

* **View Lista (Kanban):** Colunas CSM, SMV, SMO.
* **View Semanal:** Grid CSS (CSS Grid Layout) representando a semana.
* **View Férias:** Iframe embutido (Looker Studio) ou timeline (Google Charts - código legado/híbrido).
* **Dashboard:** Gráficos analíticos.

### 3.2 Lógica JavaScript (Client-Side)

#### Comunicação com Backend

Utiliza a API assíncrona `google.script.run`:

```javascript
google.script.run
  .withSuccessHandler(onDataLoaded) // Callback de sucesso
  .withFailureHandler(handleError)  // Callback de erro
  .getMedicosData();                // Função no Code.gs

```

#### `initListView()` (Renderização Kanban)

Responsável por transformar o JSON de médicos em Cards HTML.

* **Filtragem:** Separa os médicos nas colunas baseando-se na propriedade `Corpo`.
* **Lógica de Status (Baixa):** Verifica a propriedade `Renovacao` (mapeada da coluna 'Sim'). Se for 'não' ou 'talvez', aplica a classe CSS `.card-baixa` e risca o nome.
* **Renderização de Tags (Chips):**
* Separa tags de Setor (azul) e Funções (roxo).
* Aplica uma *whitelist* (`cardFunctionsWhitelist`) para exibir apenas funções de chefia relevantes nos cards.



#### Dashboard & Google Charts

Utiliza a biblioteca `google.charts`.

* Os dados são processados inteiramente no cliente (Browser) dentro de `updateDashboard()`.
* **Interatividade:** Os gráficos possuem *event listeners* (`select`). Ao clicar numa barra ou fatia de pizza, o sistema filtra todo o dashboard (`currentDashFilter`) para exibir métricas daquela seleção específica.

#### Componente Modal (`openModal`)

Uma janela de sobreposição detalhada.

* Preenche dados dinamicamente usando jQuery (`$('#id').text(value)`).
* Gera uma "Mini Schedule" (tabela de bolinhas) visualizando a disponibilidade do médico na semana, parseando a string de horários em tempo real no cliente (`fillModalSchedule`).

---

## 4. Fluxo de Dados (Data Flow)

1. **Entrada:** O Administrador edita o arquivo CSV/Sheet (adiciona um médico, muda um horário na string).
2. **Requisição:** O usuário acessa a Web App. O browser dispara `google.script.run.getMedicosData()`.
3. **Processamento (Server):**
* O Apps Script abre a planilha pelo ID.
* Detecta as colunas dinamicamente.
* Lê a aba 'ESPECIALISTAS' e cria o mapa de horários complexos.
* Cruza os dados da aba 'MÉDICOS' com o mapa de especialistas.
* Retorna um Array de Objetos JSON limpo.


4. **Processamento (Client):**
* A função `onDataLoaded` recebe o Array.
* Os dados são armazenados na variável global `globalData`.
* `initListView()` itera sobre o array e injeta HTML no DOM para criar o Kanban.
* Se o usuário clicar na aba Dashboard, `updateDashboard()` agrega esses dados em tempo real para gerar estatísticas.


5. **Visualização:** O usuário vê o card atualizado. Se o status de renovação era "Não", o card aparece cinza e riscado instantaneamente.

---


