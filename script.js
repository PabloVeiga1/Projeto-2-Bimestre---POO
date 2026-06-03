//DAVI
const StatusInscricao = Object.freeze({
    CONFIRMADO: 'CONFIRMADO',
    EM_ESPERA:  'EM_ESPERA',
    CANCELADO:  'CANCELADO'
});
 
class Participante {
    constructor(identificador, nome) {
        this.identificador = identificador;
        this.nome = nome;
        this.status = StatusInscricao.CONFIRMADO;
    }
 
    alterarStatus(novoStatus) {
        this.status = novoStatus;
    }
 
    getIdentificador() { return this.identificador; }
    getNome()          { return this.nome; }
    getStatus()        { return this.status; }
}
 
class Usuario {
    constructor(identificador, nome) {
        this.identificador = identificador;
        this.nome = nome;
        this.ativo = true;
    }
 
    desativarPerfil() {
        if (!this.ativo) {
            console.log(`Atenção: O usuário ${this.nome} já está inativo.`);
            return;
        }
        this.ativo = false;
        console.log(`Perfil de ${this.nome} desativado com sucesso.`);
    }
 
    ativarPerfil() {
        this.ativo = true;
        console.log(`Perfil de ${this.nome} ativado com sucesso.`);
    }
 
    getIdentificador() { return this.identificador; }
    getNome()          { return this.nome; }
    isAtivo()          { return this.ativo; }
}
 
// JOAO
const StatusEvento = Object.freeze({
    ABERTO:    'ABERTO',
    ENCERRADO: 'ENCERRADO',
    REALIZADO: 'REALIZADO'   // RF06: necessário para emitir certificados
});
 
class Evento {
    #participantesConfirmados = [];
    #listaDeEspera = [];
    #status;
 
    constructor(identificador, nome, local, data, limiteParticipantes) {
        this.identificador = identificador;
        this.nome = nome;
        this.local = local;
        this.data = data;
        this.limiteParticipantes = limiteParticipantes;
        this.#status = StatusEvento.ABERTO;
    }
 
    #temVagaDisponivel() {
        return this.#participantesConfirmados.length < this.limiteParticipantes;
    }
 
    getVagasRestantes() {
        return this.limiteParticipantes - this.#participantesConfirmados.length;
    }
 
    inscreverParticipante(participante) {
        const jaInscrito = this.#participantesConfirmados.some(
            p => p.getIdentificador() === participante.getIdentificador()
        );
        const naEspera = this.#listaDeEspera.some(
            p => p.getIdentificador() === participante.getIdentificador()
        );
 
        if (jaInscrito || naEspera) {
            console.log(`"${participante.getNome()}" já está inscrito neste evento.`);
            return 'DUPLICADO';
        }
 
        if (this.#temVagaDisponivel()) {
            participante.alterarStatus(StatusInscricao.CONFIRMADO);
            this.#participantesConfirmados.push(participante);
            console.log(`"${participante.getNome()}" inscrito com sucesso em "${this.nome}".`);
            return 'CONFIRMADO';
        } else {
            participante.alterarStatus(StatusInscricao.EM_ESPERA);
            this.#listaDeEspera.push(participante);
            const posicao = this.#listaDeEspera.length;
            console.log(`Vagas esgotadas. "${participante.getNome()}" entrou na lista de espera (posição ${posicao}).`);
            return 'EM_ESPERA';
        }
    }
 
    #promoverProximoDaEspera() {
        if (this.#listaDeEspera.length === 0) return;
        const proximo = this.#listaDeEspera.shift();
        proximo.alterarStatus(StatusInscricao.CONFIRMADO);
        this.#participantesConfirmados.push(proximo);
        console.log(`"${proximo.getNome()}" foi promovido da lista de espera e está CONFIRMADO em "${this.nome}".`);
    }
 
    cancelarInscricao(participante) {
        const indice = this.#participantesConfirmados.findIndex(
            p => p.getIdentificador() === participante.getIdentificador()
        );
        if (indice === -1) {
            console.log(`"${participante.getNome()}" não está confirmado neste evento.`);
            return false;
        }
        this.#participantesConfirmados.splice(indice, 1);
        participante.alterarStatus(StatusInscricao.CANCELADO);
        console.log(`Inscrição de "${participante.getNome()}" cancelada.`);
        if (this.#temVagaDisponivel()) this.#promoverProximoDaEspera();
        return true;
    }
 
    // RF06: marca o evento como realizado para liberar emissão de certificados
    marcarComoRealizado() {
        this.#status = StatusEvento.REALIZADO;
        console.log(`Evento "${this.nome}" marcado como REALIZADO.`);
    }
 
    encerrar() {
        this.#status = StatusEvento.ENCERRADO;
        console.log(`Evento "${this.nome}" encerrado.`);
    }
 
    getParticipantesConfirmados() { return [...this.#participantesConfirmados]; }
    getListaDeEspera()            { return [...this.#listaDeEspera]; }
    getIdentificador()            { return this.identificador; }
    getNome()                     { return this.nome; }
    getLocal()                    { return this.local; }
    getData()                     { return this.data; }
    getLimite()                   { return this.limiteParticipantes; }
    getStatus()                   { return this.#status; }
}
 
class ConsultaEventos {
    consultarParticipantes(evento) {
        const confirmados = evento.getParticipantesConfirmados();
        console.log(`\n── Participantes confirmados: "${evento.getNome()}" ──`);
        if (confirmados.length === 0) { console.log('  Nenhum participante confirmado.'); return confirmados; }
        confirmados.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.getNome()} (ID: ${p.getIdentificador()}) — ${p.getStatus()}`);
        });
        console.log(`  Total: ${confirmados.length} / ${evento.getLimite()} vagas`);
        return confirmados;
    }
 
    consultarListaDeEspera(evento) {
        const espera = evento.getListaDeEspera();
        console.log(`\n── Lista de espera: "${evento.getNome()}" ──`);
        if (espera.length === 0) { console.log('  Nenhum participante aguardando.'); return espera; }
        espera.forEach((p, i) => {
            console.log(`  ${i + 1}º na fila: ${p.getNome()} (ID: ${p.getIdentificador()})`);
        });
        return espera;
    }
 
    resumoEvento(evento) {
        console.log(`\n══ Resumo: "${evento.getNome()}" ══`);
        console.log(`  Local  : ${evento.getLocal()}`);
        console.log(`  Data   : ${evento.getData()}`);
        console.log(`  Status : ${evento.getStatus()}`);
        console.log(`  Vagas  : ${evento.getLimite() - evento.getVagasRestantes()} ocupadas / ${evento.getLimite()} totais`);
        console.log(`  Espera : ${evento.getListaDeEspera().length} pessoa(s) aguardando`);
    }
}
 
// PABLO
class RegistroOperacoes {
    #operacoes = [];
 
    registrar(tipo, descricao) {
        const op = {
            id: this.#operacoes.length + 1,
            tipo,
            descricao,
            timestamp: new Date().toISOString()
        };
        this.#operacoes.push(op);
        console.log(`[LOG #${op.id}] ${op.tipo} — ${op.descricao}`);
        return op;
    }
 
    getOperacoes() { return [...this.#operacoes]; }
 
    exportar() {
        console.log('\n══ Registro de Operações ══');
        if (this.#operacoes.length === 0) {
            console.log('  Nenhuma operação registrada.');
            return;
        }
        this.#operacoes.forEach(op => {
            console.log(`  [${op.id}] ${op.timestamp} | ${op.tipo.padEnd(25)} | ${op.descricao}`);
        });
    }
}
 
// RF06: Certificado de participação
class Certificado {
    #codigo;
    #participante;
    #evento;
    #dataEmissao;
 
    constructor(participante, evento) {
        this.#participante = participante;
        this.#evento = evento;
        this.#dataEmissao = new Date();
        this.#codigo = this.#gerarCodigo();
    }
 
    #gerarCodigo() {
        const base = `${this.#participante.getIdentificador()}-${this.#evento.getIdentificador()}-${Date.now()}`;
        let hash = 0;
        for (let i = 0; i < base.length; i++) {
            hash = ((hash << 5) - hash) + base.charCodeAt(i);
            hash |= 0;
        }
        return `CERT-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
    }
 
    getCodigo()       { return this.#codigo; }
    getParticipante() { return this.#participante; }
    getEvento()       { return this.#evento; }
    getDataEmissao()  { return this.#dataEmissao; }
 
    exibir() {
        console.log('\n╔══════════════════════════════════════════╗');
        console.log('║         CERTIFICADO DE PARTICIPAÇÃO      ║');
        console.log('╠══════════════════════════════════════════╣');
        console.log(`║  Participante : ${this.#participante.getNome().padEnd(25)}║`);
        console.log(`║  Evento       : ${this.#evento.getNome().padEnd(25)}║`);
        console.log(`║  Local        : ${this.#evento.getLocal().padEnd(25)}║`);
        console.log(`║  Data evento  : ${this.#evento.getData().padEnd(25)}║`);
        console.log(`║  Emitido em   : ${this.#dataEmissao.toLocaleDateString('pt-BR').padEnd(25)}║`);
        console.log(`║  Código       : ${this.#codigo.padEnd(25)}║`);
        console.log('╚══════════════════════════════════════════╝');
    }
}
 
class ControladorInscricoes {
    #registro;
 
    constructor(registroOperacoes) {
        this.#registro = registroOperacoes;
    }
 
    inscrever(participante, evento) {
        const resultado = evento.inscreverParticipante(participante);
        const tipos = {
            CONFIRMADO: 'INSCRICAO_CONFIRMADA',
            EM_ESPERA:  'INSCRICAO_EM_ESPERA',
            DUPLICADO:  'INSCRICAO_DUPLICADA'
        };
        this.#registro.registrar(tipos[resultado], `"${participante.getNome()}" → evento "${evento.getNome()}"`);
        return resultado === 'CONFIRMADO';
    }
 
    cancelarInscricao(participante, evento) {
        const resultado = evento.cancelarInscricao(participante);
        const tipo = resultado ? 'CANCELAMENTO_OK' : 'CANCELAMENTO_FALHOU';
        this.#registro.registrar(tipo, `"${participante.getNome()}" → evento "${evento.getNome()}"`);
        return resultado;
    }
}
 
class ControladorPrincipal {
    #registro;
    #ctrlInscricoes;
    #eventos       = [];
    #participantes = [];
    #usuarios      = [];   // Core RF01/RF02
    #certificados  = [];   // RF06
 
    constructor() {
        this.#registro      = new RegistroOperacoes();
        this.#ctrlInscricoes = new ControladorInscricoes(this.#registro);
    }
 
    // ── Core RF01: cadastro de usuários ──────────────────────────────────────
 
    cadastrarUsuario(identificador, nome) {
        const existente = this.#usuarios.find(u => u.getIdentificador() === identificador);
        if (existente) {
            console.log(`Atenção: ID de usuário "${identificador}" já está em uso.`);
            return null;
        }
        const u = new Usuario(identificador, nome);
        this.#usuarios.push(u);
        this.#registro.registrar('USUARIO_CADASTRADO', `"${nome}" (ID: ${identificador})`);
        return u;
    }
 
    // Core RF02: ativar / desativar usuário
    ativarUsuario(identificador) {
        const u = this.#buscarUsuario(identificador);
        if (!u) return;
        u.ativarPerfil();
        this.#registro.registrar('USUARIO_ATIVADO', `"${u.getNome()}"`);
    }
 
    desativarUsuario(identificador) {
        const u = this.#buscarUsuario(identificador);
        if (!u) return;
        u.desativarPerfil();
        this.#registro.registrar('USUARIO_DESATIVADO', `"${u.getNome()}"`);
    }
 
    // ── RF01: cadastro de eventos ─────────────────────────────────────────────
 
    cadastrarEvento(identificador, nome, local, data, limite) {
        const ev = new Evento(identificador, nome, local, data, limite);
        this.#eventos.push(ev);
        this.#registro.registrar('EVENTO_CRIADO', `"${nome}" em ${local} — limite: ${limite} vagas`);
        return ev;
    }
 
    // ── RF02: cadastro de participantes ───────────────────────────────────────
 
    registrarParticipante(identificador, nome) {
        const existente = this.#participantes.find(p => p.getIdentificador() === identificador);
        if (existente) {
            console.log(`Atenção: ID "${identificador}" já está em uso.`);
            return null;
        }
        const p = new Participante(identificador, nome);
        this.#participantes.push(p);
        this.#registro.registrar('PARTICIPANTE_REGISTRADO', `"${nome}" (ID: ${identificador})`);
        return p;
    }
 
    // ── RF03 + RF05: inscrição com lista de espera automática ─────────────────
 
    inscrever(identificadorParticipante, identificadorEvento) {
        const p  = this.#buscarParticipante(identificadorParticipante);
        const ev = this.#buscarEvento(identificadorEvento);
        if (!p || !ev) return false;
        return this.#ctrlInscricoes.inscrever(p, ev);
    }
 
    cancelarInscricao(identificadorParticipante, identificadorEvento) {
        const p  = this.#buscarParticipante(identificadorParticipante);
        const ev = this.#buscarEvento(identificadorEvento);
        if (!p || !ev) return false;
        return this.#ctrlInscricoes.cancelarInscricao(p, ev);
    }
 
    // ── RF04: consulta de participantes ───────────────────────────────────────
 
    consultarParticipantes(identificadorEvento) {
        const ev = this.#buscarEvento(identificadorEvento);
        if (!ev) return;
        const consulta = new ConsultaEventos();
        this.#registro.registrar('CONSULTA_PARTICIPANTES', `Evento "${ev.getNome()}"`);
        consulta.consultarParticipantes(ev);
        consulta.consultarListaDeEspera(ev);
    }
 
    // ── RF06: emissão de certificado ──────────────────────────────────────────
 
    marcarEventoComoRealizado(identificadorEvento) {
        const ev = this.#buscarEvento(identificadorEvento);
        if (!ev) return;
        ev.marcarComoRealizado();
        this.#registro.registrar('EVENTO_REALIZADO', `"${ev.getNome()}"`);
    }
 
    emitirCertificado(identificadorParticipante, identificadorEvento) {
        const p  = this.#buscarParticipante(identificadorParticipante);
        const ev = this.#buscarEvento(identificadorEvento);
        if (!p || !ev) return null;
 
        // Verificar se o evento foi realizado
        if (ev.getStatus() !== StatusEvento.REALIZADO) {
            console.log(`Certificado não pode ser emitido: evento "${ev.getNome()}" ainda não foi marcado como REALIZADO.`);
            return null;
        }
 
        // Verificar se o participante estava confirmado
        const estaConfirmado = ev.getParticipantesConfirmados().some(
            c => c.getIdentificador() === p.getIdentificador()
        );
        if (!estaConfirmado) {
            console.log(`"${p.getNome()}" não está na lista de confirmados de "${ev.getNome()}". Certificado não emitido.`);
            return null;
        }
 
        // Evitar certificado duplicado
        const jaEmitido = this.#certificados.find(
            c => c.getParticipante().getIdentificador() === p.getIdentificador() &&
                 c.getEvento().getIdentificador()       === ev.getIdentificador()
        );
        if (jaEmitido) {
            console.log(`Certificado já emitido para "${p.getNome()}" no evento "${ev.getNome()}". Código: ${jaEmitido.getCodigo()}`);
            return jaEmitido;
        }
 
        const cert = new Certificado(p, ev);
        this.#certificados.push(cert);
        this.#registro.registrar('CERTIFICADO_EMITIDO', `"${p.getNome()}" — evento "${ev.getNome()}" — código ${cert.getCodigo()}`);
        cert.exibir();
        return cert;
    }
 
    // ── Relatórios ────────────────────────────────────────────────────────────
 
    relatorioGeral() {
        const consulta = new ConsultaEventos();
        this.#registro.registrar('RELATORIO_GERAL', `${this.#eventos.length} evento(s) consultado(s)`);
        this.#eventos.forEach(ev => consulta.resumoEvento(ev));
    }
 
    exportarLog() {
        this.#registro.exportar();
    }
 
    // ── Privados ──────────────────────────────────────────────────────────────
 
    #buscarParticipante(identificador) {
        const p = this.#participantes.find(x => x.getIdentificador() === identificador);
        if (!p) console.log(`Participante com ID "${identificador}" não encontrado.`);
        return p || null;
    }
 
    #buscarEvento(identificador) {
        const ev = this.#eventos.find(x => x.getIdentificador() === identificador);
        if (!ev) console.log(`Evento com ID "${identificador}" não encontrado.`);
        return ev || null;
    }
 
    #buscarUsuario(identificador) {
        const u = this.#usuarios.find(x => x.getIdentificador() === identificador);
        if (!u) console.log(`Usuário com ID "${identificador}" não encontrado.`);
        return u || null;
    }
 
    getEventos()       { return [...this.#eventos]; }
    getParticipantes() { return [...this.#participantes]; }
    getUsuarios()      { return [...this.#usuarios]; }
}
