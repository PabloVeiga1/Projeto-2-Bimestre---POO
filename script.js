// 1. Enumeração no topo (para que o Participante possa enxergá-la)
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
    getNome() { return this.nome; }
    getStatus() { return this.status; }
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
    getNome() { return this.nome; }
    isAtivo() { return this.ativo; }
}



const usuario1 = new Usuario(1, "Davi");
console.log(`Usuário: ${usuario1.getNome()} | Ativo: ${usuario1.isAtivo()}`);
usuario1.desativarPerfil();
usuario1.desativarPerfil(); // Testando a mensagem de aviso

const participante1 = new Participante(101, "Pablo");
console.log(`Participante: ${participante1.getNome()} | Status: ${participante1.getStatus()}`);
participante1.alterarStatus(StatusInscricao.CANCELADO);
console.log(`Novo Status do Participante: ${participante1.getStatus()}`);
