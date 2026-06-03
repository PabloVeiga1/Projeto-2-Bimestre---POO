# Projeto-2-Bimestre---POO
Projeto do segundo Bimestre da matéria de POO do IFAL
# TechCity Control — Módulo 3: Sistema de Eventos

> Projeto da disciplina de **Programação Orientada a Objetos**  
> Instituto Federal de Alagoas – IFAL / Campus Maceió  
> Prof. MSc. Ricardo Nunes

**Equipe:** Davi · Pablo · João  
**2º Bimestre — Entrega 1**

---

## Sobre o sistema

O **Módulo 3** integra a plataforma TechCity Control e é responsável por gerenciar eventos organizados pela cidade fictícia TechCity.

O sistema resolve problemas reais de gestão de eventos públicos:

- Controle de vagas e inscrições
- Lista de espera automática quando o evento está lotado
- Promoção automática de participantes quando uma vaga é liberada
- Emissão de registro de certificado para participantes confirmados

---

## Estrutura do projeto

```
techcity-eventos/
│
├── script.js     ← todas as classes e controladores
├── main.js       ← cenários de uso / demonstração
└── README.md     ← este arquivo
```

---

## Classes implementadas

| Classe | Responsabilidade |
|---|---|
| `Usuario` | Representa um usuário do sistema com controle de ativação (Core) |
| `Participante` | Representa um participante de eventos com controle de status |
| `Evento` | Gerencia vagas, inscrições e lista de espera |
| `Certificado` | Armazena e exibe o certificado de participação (RF06) |
| `ConsultaEventos` | Exibe participantes, lista de espera e resumo de eventos |
| `RegistroOperacoes` | Registra e exporta o log de operações do sistema (Core) |
| `ControladorInscricoes` | Coordena operações de inscrição e cancelamento |
| `ControladorPrincipal` | Porta de entrada do sistema — coordena todos os casos de uso |

---

## Requisitos implementados

### Núcleo comum (Core)

| Código | Descrição |
|---|---|
| CORE-RF01 | Cadastro de usuários com identificador, nome e estado de ativação |
| CORE-RF02 | Ativar e desativar usuários pelo controlador |
| CORE-RF03 | Registro de operações com tipo, descrição e timestamp |
| CORE-RF04 | Controlador principal coordenando as operações do sistema |

### Módulo 3 — Requisitos obrigatórios

| Código | Descrição |
|---|---|
| RF01 | Cadastro de eventos com nome, local, data e limite de participantes |
| RF02 | Registro de participantes com identificador, nome e status |
| RF03 | Controle de inscrições verificando disponibilidade de vagas |
| RF04 | Consulta de participantes vinculados a um evento |

### Requisitos adicionais da equipe

| Código | Descrição |
|---|---|
| RF05 | **Gerenciamento automático de lista de espera** — ao lotar, novos participantes entram na fila; ao cancelar uma inscrição, o primeiro da fila é promovido automaticamente |
| RF06 | **Emissão de registro de certificado** — gera certificado com código único para participantes confirmados em eventos marcados como realizados |

---

## Como executar

Necessário ter o **Node.js** instalado.

```bash
node main.js
```

---

## Exemplo de uso pelo código

```javascript
const ctrl = new ControladorPrincipal();

// Cadastrar usuário (Core)
ctrl.cadastrarUsuario('U01', 'Admin TechCity');

// Cadastrar evento
ctrl.cadastrarEvento('E01', 'Festival de Tecnologia', 'Parque da Cidade', '15/08/2025', 3);

// Cadastrar participantes
ctrl.registrarParticipante('P01', 'Alice');
ctrl.registrarParticipante('P02', 'Bruno');

// Inscrever
ctrl.inscrever('P01', 'E01');

// Consultar
ctrl.consultarParticipantes('E01');

// Marcar como realizado e emitir certificado (RF06)
ctrl.marcarEventoComoRealizado('E01');
ctrl.emitirCertificado('P01', 'E01');

// Ver log de operações
ctrl.exportarLog();
```

---

## Decisões de modelagem

**Por que `Evento` controla a lista de espera e não o controlador?**  
Porque quem conhece as vagas disponíveis é o próprio `Evento`. Delegar essa lógica ao controlador quebraria o encapsulamento — o controlador precisaria acessar dados internos do evento diretamente.

**Por que `Certificado` é uma classe separada?**  
Porque um certificado é uma entidade com identidade própria: tem código único, data de emissão, e precisa ser armazenado e consultado independentemente do participante ou do evento.

**Por que existe `ControladorInscricoes` separado do `ControladorPrincipal`?**  
Para separar responsabilidades: o `ControladorPrincipal` coordena todos os casos de uso do sistema, enquanto o `ControladorInscricoes` cuida especificamente da lógica de inscrever e cancelar, registrando o resultado no log.
