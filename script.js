const StatusInscricao = require('./StatusInscricao');

class Participante {
    constructor(identificador, nome) {
        this.identificador = identificador;
        this.nome = nome;
        this.status = StatusInscricao.CONFIRMADO; 
    }

    alterarStatus(novoStatus) {
        this.status = novoStatus;
    }

    // Get
    getIdentificador() { return this.identificador; }
    getNome() { return this.nome; }
    getStatus() { return this.status; }
}

module.exports = Participante;


class Usuario {
    constructor(identificador, nome) {
        this.identificador = identificador;
        this.nome = nome;
        this.ativo = true; 
        // Todo usuário nasce ativo por padrão
    }

    // Comportamento da entidade 
    desativarPerfil() {
        if (!this.ativo) {
            console.log(`Atenção: O usuário ${this.nome} já está inativo.`);
            return;
        }
        this.ativo = false;
    }

    ativarPerfil() {
        this.ativo = true;
    }

    // Get para acessar as propriedades
    getIdentificador() { return this.identificador; }
    getNome() { return this.nome; }
    isAtivo() { return this.ativo; }
}

module.exports = Usuario;

// Enumeração para controlar os status da inscrição
const StatusInscricao = Object.freeze({
    CONFIRMADO: 'CONFIRMADO',
    EM_ESPERA: 'EM_ESPERA',
    CANCELADO: 'CANCELADO'
});

module.exports = StatusInscricao;
