/**
 * TechCity Control — Módulo 3: Sistema de Eventos
 * Equipe: Davi, Pablo, João
 *
 * main.js — Cenários de uso do sistema 
 */
 
const EventosController = require('./controllers/EventosController');
 
const controller = new EventosController();
 
console.log('══════════════════════════════════════════════════');
console.log('     TechCity Control — Sistema de Eventos        ');
console.log('══════════════════════════════════════════════════\n');
 
// ─── CORE: Cadastro de usuário administrador ───────────────────────────
console.log('── [CORE] Cadastro de usuário ──────────────────\n');
const admin = controller.cadastrarUsuario('Admin TechCity');
 
// ─── RF01: Cadastrar eventos ───────────────────────────────────────────
console.log('\n── [RF01] Cadastro de eventos ──────────────────\n');
const festival = controller.cadastrarEvento(
  'Festival de Tecnologia', 'Parque da Cidade', '2025-08-15', 3, admin
);
const palestra = controller.cadastrarEvento(
  'Palestra sobre IA', 'Auditório Central', '2025-09-01', 2, admin
);
 
// ─── RF02: Cadastrar participantes ─────────────────────────────────────
console.log('\n── [RF02] Cadastro de participantes ────────────\n');
const p1 = controller.cadastrarParticipante('Alice');
const p2 = controller.cadastrarParticipante('Bruno');
const p3 = controller.cadastrarParticipante('Carla');
const p4 = controller.cadastrarParticipante('Diego');  // entrará na lista de espera
const p5 = controller.cadastrarParticipante('Elena');  // entrará na lista de espera
 
// ─── RF03: Inscrições (com vagas disponíveis) ──────────────────────────
console.log('\n── [RF03] Inscrições no festival (limite: 3) ───\n');
controller.realizarInscricao(festival.getId(), p1.getId());
controller.realizarInscricao(festival.getId(), p2.getId());
controller.realizarInscricao(festival.getId(), p3.getId());
 
// ─── RF05: Lista de espera automática ─────────────────────────────────
console.log('\n── [RF05] Lista de espera (evento lotado) ──────\n');
controller.realizarInscricao(festival.getId(), p4.getId());
controller.realizarInscricao(festival.getId(), p5.getId());
 
// ─── RF04: Consultar participantes ─────────────────────────────────────
console.log('\n── [RF04] Consulta de participantes ────────────');
controller.consultarParticipantes(festival.getId());
 
// ─── RF05: Cancelamento → promoção automática ─────────────────────────
console.log('\n── [RF05] Cancelamento com promoção automática ─\n');
controller.cancelarInscricao(festival.getId(), p2.getId());
 
console.log('\n── [RF04] Participantes após cancelamento ──────');
controller.consultarParticipantes(festival.getId());
 
// ─── RF06: Emissão de certificado ─────────────────────────────────────
console.log('\n── [RF06] Emissão de certificados ──────────────\n');
 
// Tentar emitir antes do evento ser realizado (deve falhar)
console.log('Tentativa antes do evento ser realizado:');
controller.emitirCertificado(festival.getId(), p1.getId());
 
// Marcar como realizado
console.log('');
controller.marcarEventoComoRealizado(festival.getId(), admin);
 
// Emitir certificados
console.log('');
controller.emitirCertificado(festival.getId(), p1.getId());
controller.emitirCertificado(festival.getId(), p3.getId());
 
// Tentar emissão duplicada
console.log('\nTentativa de certificado duplicado:');
controller.emitirCertificado(festival.getId(), p1.getId());
 
// ─── Listar todos os eventos ───────────────────────────────────────────
controller.listarEventos();
 
// ─── CORE RF03: Log de operações ──────────────────────────────────────
controller.exibirLog();
 
console.log('\n══════════════════════════════════════════════════');
console.log('                   Fim da demo                   ');
console.log('══════════════════════════════════════════════════');
