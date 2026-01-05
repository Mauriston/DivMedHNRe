# PROMPT DISTRIBUIÇÃO SEMANAL DE HORÁRIOS  







 ## AJUSTES NA LÓGICA DE DISTRUBUIÇÃO SEMANAL:

### 'JRS':
- **1T (Md) LUZ:**
    - Terça manhã
    - Sexta manha
- **1T (Md) SALYNE:**
    - Terça manhã
    - Quarta manha
    - Quinta manha
    - Quinta tarde
- **CT (RM2-Md) JÚLIO CÉSAR:** Segunda manhã
- **CT (Md) MAURISTON:**
    - Terça manhã
    - Quarta manha
    - Quarta tarde
    - Quinta manha
    - Sexta manha
    - Sexta tarde

### 'AMBULATÓRIO':
- **1T (Md) SALYNE:** Segunda manhã
- **CT (Md) MAURISTON:** Quarta tarde
- **CT (RM2-Md) JÚLIO CÉSAR:**
    - Terça tarde
    - Quarta manhã
- **1T (Md) LUZ:** Quarta manha
- **CT (RM2-Md) CAMPOS:** Só 1 ambulatório por mês, na última Terça tarde
- **1T (Md) MÔNICA VIRGÍNIA:**
    - Quarta tarde
    - Sexta manha
- **1T (Md) MÔNICA VIRGÍNIA:**
    - Quarta tarde
    - Quinta manha
    - Sexta manha
- **1T (Md) SEIXAS:** 
    - Terça manhã
    - Quinta manha

### Horários de **'ENFERMARIA'**:
- **CT (RM2-Md) JÚLIO CÉSAR:** Segunda manhã
- **CT (Md) MAURISTON:**:
    - Terça manhã
    - Quarta manha
    - Sexta manha
- **1T (Md) VALÉRIA:**
    - Segunda manhã
    - Terça manhã
- **1T (Md) MÔNICA VIRGÍNIA:**
    - Quarta manha
- **1T (Md) LUZ:**
    - Quarta manha
    - Quinta manha
- **1T (Md) NÉLIA NOGUEIRA:**: Sexta manha

### Horários de **'CIRURGIAS'**:
- **CT (Md) MAURISTON:** Quinta manha
- **1T (Md) LUZ:** Quinta manha
- **1T (Md) SEIXAS:** Quinta tarde

### Horários de **'CAAPIOSE'**:
- **1T (Md) MÔNICA VIRGÍNIA:**
    - Quarta manha
    - Quinta manha
    - Sexta tarde

### Horários de **'SMI'**:
- **1T (Md) SEIXAS:**
    - Terça tarde
    - Quarta tarde

### QUANDO HOUVER O FILTRO POR 'ESPECIALIDADE' SÓ DEVEM APARECER OS HORÁRIOS RELATIVOS AOS **'SETORES'** ASSISTENCIAIS:
- 'AMBULATÓRIO'
- 'ENFERMARIA'
- 'CIRURGIAS'
- 'NAIM'
- 'RADIOLOGIA'

### **RETOME AS INFORMAÇÕES DENTRO DOS CARDS E ABAIXO DO NOME DO 'MÉDICO'*
-  Essas informações só devem surgir no Card se algum filtro for selecionado (para não deixar a tabela muito extensa)
- Deve ser da seguinte forma: **{{SETOR}} | {{ESPECIALIDADE}}**
    - **Só haverá algo após de 'Setor' se:**
        - o 'Médico' tiver especialidade e não for 'Residente'
        - se o 'Setor' for assistencial como explicado no ponto anterior
        - se o 'Médico' estiver escalado em 2 'Setores' possíveis e a depender da combinação de filtros. Nesse caso deve estar escrito assim: **{{SETOR}} | {{SETOR_2}}**

### DETERMINAÇÃO DOS HORÁRIOS DO SPA:

### ⚠️ REGRA MAIS IMPORTANTE: O MÉDICO QUE ESTÁ ESCALADO **NO SPA NÃO PODE ESTAR CONCOMITANTEMENTE EM OUTRO** SETOR SOB NENHUM HIPÓTESE!!! ALÉM DISSO **O SPA É PRIORIDADE SOBRE QUALQUER OUTRO SETOR**. ⚠️

### ⚠️SÓ PODEM COMPOR O DETALHE SEMANL DO SPA OS MÉDICOS QUE ESTIVEREM NA LISTA ABAIXO:⚠️

### HORÁRIOS DO SPA:
- **1T (RM2-Md) VIANNA:** Segunda manha e Segunda tarde 
- **1T (RM2-Md) BARBOSA:** Segunda manha e Segunda tarde 
- **2T (RM2-Md) TRINDADE:** Terça manha e Terça tarde 
- **2T (RM2-Md) MEDEIROS:** Terça manha e Terça tarde
- **2T (RM2-Md) COSTA:** Quarta manha e Quarta tarde
- **2T (RM2-Md) ALBUQUERQUE:** Quarta manha e Quarta tarde  
- **2T (RM2-Md) CAMELO:** Quinta manha e Quinta tarde  
- **2T (RM2-Md) CARVALHO:** Quinta manha e Quinta tarde
- **2T (RM2-Md) ARRUDA:** Sexta manha e Sexta tarde 
- **2T (RM2-Md) OLIVEIRA:** Sexta manha e Sexta tarde





   ---



  # Atribua as cores Cinza, Amarelo e Vermelho para os chips de 'SETORES' e 'FUNÇÕES':

## 'SETORES':

| Ambulatório | Amarelo |
| :---- | :---- |
| Auditoria | Vermelho |
| Radiologia | Amarelo |
| CAAPIOSE | Vermelho |
| Cirurgias | Amarelo |
| Enfermaria | Amarelo |
| JRS | Vermelho |
| Regulação | Amarelo |
| NAIM | Amarelo |
| SIAD | Cinza |
| SMI | Cinza |
| EAMPE | Vermelho |
| Guias | Cinza |

## 'FUNÇÕES':

| Coordenação DANTS | Amarelo |
| :---- | :---- |
| Coordenação PSM Atenção às Doenças Profissionais | Cinza |
| Coordenação PSM Atenção Farmacêutca | Cinza |
| Coordenação PSM Dermatologia | Cinza |
| Coordenação PSM DM | Cinza |
| Coordenação PSM DST/AIDS | Cinza |
| Coordenação PSM HAS | Cinza |
| Coordenação PSM Imunizações | Cinza |
| Coordenação PSM Pneumologia | Cinza |
| Coordenação PSM Reabilitação | Cinza |
| Coordenação PSM Saúde da Mulher | Cinza |
| Coordenação PSM Saúde do Homem | Cinza |
| Coordenação PSM Saúde Mental | Cinza |
| Encarregada NAIM | Vermelho |
| Encarregada Seção Medicina Clínica | Amarelo |
| Encarregada SPA | Amarelo |
| Encarregado Oftalmologia | Amarelo |
| Encarregado Ortopedia e Traumatologia | Amarelo |
| Encarregado Radiologia | Vermelho |
| Encarregado SIAD | Vermelho |
| Encarregado Seção de Medicina Cirúrgica | Amarelo |
| Encarregado SECOM | Vermelho |
| Encarregado Serviço de Medicina Operativa | Cinza |
| Encarregado SMI | Vermelho |
| Escalante | Amarelo |
| Membro CCIH | Amarelo |
| Membro CIPA | Cinza |
| Membro Comissão de Farmácia e Terapêutica | Cinza |
| Membro da Comissão de Ética | Cinza |
| Membro da Comissão de Humanização | Cinza |
| Membro da Comissão de Óbitos | Amarelo |
| Membro da Comissão de Prontuários | Amarelo |
| Membro da JEIM | Amarelo |
| Membro do Núcleo de Segurança do Paciente | Cinza |
| Membro JRS | Amarelo |
| Presidente CAAPIOSE | Vermelho |
| Presidente CCIH | Vermelho |
| Vice-Presidente CIPA | Cinza |
| Presidente Comissão de Farmácia e Terapêutica | Vermelho |
| Presidente da Comissão de Óbitos | Amarela |
| Presidente da Comissão de Prontuários | Amarela |
| Presidente JRS | Vermelho |
| Responsável Licitação | Amarelo |
| Supervisão Enfermaria | Amarelo |
| Supervisão PSM | Amarelo |
| Supervisão SMI | Amarelo |
