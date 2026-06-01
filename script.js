//DAVI
const StatusInscricao = Object.freeze({
    CONFIRMADO: 'CONFIRMADO',
    EM_ESPERA: 'EM_ESPERA',
    CANCELADO: 'CANCELADO'
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
    }

    getIdentificador() { return this.identificador; }
    getNome()          { return this.nome; }
    isAtivo()          { return this.ativo; }
}

// JOAO
class Evento {
    #participantesConfirmados = [];
    #listaDeEspera = [];

    constructor(identificador, nome, local, data, limiteParticipantes) {
        this.identificador = identificador;
        this.nome = nome;
        this.local = local;
        this.data = data;
        this.limiteParticipantes = limiteParticipantes;
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

    getParticipantesConfirmados() { return [...this.#participantesConfirmados]; }
    getListaDeEspera()            { return [...this.#listaDeEspera]; }
    getIdentificador()            { return this.identificador; }
    getNome()                     { return this.nome; }
    getLocal()                    { return this.local; }
    getData()                     { return this.data; }
    getLimite()                   { return this.limiteParticipantes; }
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
        console.log(`  Local : ${evento.getLocal()}`);
        console.log(`  Data  : ${evento.getData()}`);
        console.log(`  Vagas : ${evento.getLimite() - evento.getVagasRestantes()} ocupadas / ${evento.getLimite()} totais`);
        console.log(`  Espera: ${evento.getListaDeEspera().length} pessoa(s) aguardando`);
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
    #eventos = [];
    #participantes = [];

    constructor() {
        this.#registro = new RegistroOperacoes();
        this.#ctrlInscricoes = new ControladorInscricoes(this.#registro);
    }

    cadastrarEvento(identificador, nome, local, data, limite) {
        const ev = new Evento(identificador, nome, local, data, limite);
        this.#eventos.push(ev);
        this.#registro.registrar('EVENTO_CRIADO', `"${nome}" em ${local} — limite: ${limite} vagas`);
        return ev;
    }

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

    inscrever(identificadorParticipante, identificadorEvento) {
        const p = this.#buscarParticipante(identificadorParticipante);
        const ev = this.#buscarEvento(identificadorEvento);
        if (!p || !ev) return false;
        return this.#ctrlInscricoes.inscrever(p, ev);
    }

    cancelarInscricao(identificadorParticipante, identificadorEvento) {
        const p = this.#buscarParticipante(identificadorParticipante);
        const ev = this.#buscarEvento(identificadorEvento);
        if (!p || !ev) return false;
        return this.#ctrlInscricoes.cancelarInscricao(p, ev);
    }

    consultarParticipantes(identificadorEvento) {
        const ev = this.#buscarEvento(identificadorEvento);
        if (!ev) return;
        const consulta = new ConsultaEventos();
        this.#registro.registrar('CONSULTA_PARTICIPANTES', `Evento "${ev.getNome()}"`);
        consulta.consultarParticipantes(ev);
    }

    relatorioGeral() {
        const consulta = new ConsultaEventos();
        this.#registro.registrar('RELATORIO_GERAL', `${this.#eventos.length} evento(s) consultado(s)`);
        this.#eventos.forEach(ev => consulta.resumoEvento(ev));
    }

    exportarLog() {
        this.#registro.exportar();
    }

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

    getEventos()       { return [...this.#eventos]; }
    getParticipantes() { return [...this.#participantes]; }
}
