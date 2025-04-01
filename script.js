class Funcionario {
    constructor(nome, idade, cargo, salario) {
        this._nome = nome;
        this._idade = idade;
        this._cargo = cargo;
        this._salario = salario;
        this._id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    get id() { return this._id; }
    get nome() { return this._nome; }
    get idade() { return this._idade; }
    get cargo() { return this._cargo; }
    get salario() { return this._salario; }

    set nome(novoNome) { this._nome = novoNome; }
    set idade(novaIdade) { this._idade = novaIdade; }
    set cargo(novoCargo) { this._cargo = novoCargo; }
    set salario(novoSalario) { this._salario = novoSalario; }

    toString() {
        return `${this._nome}, ${this._idade} anos, ${this._cargo}, Salário: R$ ${this._salario.toFixed(2)}`;
    }
}

const funcionarios = [];
let editando = false;
let idEdicao = null;

const form = document.getElementById('formFuncionario');
const btnSubmit = form.querySelector('button');

// Funções de manipulação com arrow functions
const buscarFuncionarioPorId = (id) => funcionarios.find(func => func.id === id);
const removerFuncionario = (id) => {
    const index = funcionarios.findIndex(func => func.id === id);
    if (index !== -1) funcionarios.splice(index, 1);
};
const atualizarFuncionario = (id, dados) => {
    const funcionario = buscarFuncionarioPorId(id);
    if (funcionario) {
        Object.keys(dados).forEach(key => {
            if (funcionario[key] !== undefined) funcionario[key] = dados[key];
        });
    }
    return funcionario;
};

// Evento de submit com arrow function
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const dados = {
        nome: document.getElementById('nome').value,
        idade: parseInt(document.getElementById('idade').value),
        cargo: document.getElementById('cargo').value,
        salario: parseFloat(document.getElementById('salario').value)
    };

    if (editando) {
        atualizarFuncionario(idEdicao, dados);
        editando = false;
        idEdicao = null;
        btnSubmit.textContent = 'Cadastrar';
    } else {
        funcionarios.push(new Funcionario(dados.nome, dados.idade, dados.cargo, dados.salario));
    }
    
    atualizarTabela();
    form.reset();
});

// Função para gerar relatórios
const gerarRelatorios = () => {
    // Funcionários com salário > R$ 5.000
    const altaRenda = funcionarios.filter(func => func.salario > 5000);
    document.getElementById('alta-renda').innerHTML = altaRenda
        .map(func => `<li>${func.toString()}</li>`)
        .join('');
    
    // Média salarial
    const mediaSalarial = funcionarios.reduce((acc, func) => acc + func.salario, 0) / funcionarios.length || 0;
    document.getElementById('media-salarial').textContent = 
        `Média salarial: R$ ${mediaSalarial.toFixed(2)} (${funcionarios.length} funcionários)`;
    
    // Cargos únicos
    const cargosUnicos = [...new Set(funcionarios.map(func => func.cargo))];
    document.getElementById('cargos-unicos').innerHTML = cargosUnicos
        .map(cargo => `<li>${cargo}</li>`)
        .join('');
    
    // Nomes em maiúsculo
    document.getElementById('nomes-maiusculo').innerHTML = funcionarios
        .map(func => `<li>${func.nome.toUpperCase()}</li>`)
        .join('');
};

// Função para atualizar a tabela
const atualizarTabela = () => {
    const tbody = document.querySelector('#tabelaFuncionarios tbody');
    tbody.innerHTML = '';
    
    funcionarios.forEach(funcionario => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${funcionario.nome}</td>
            <td>${funcionario.idade}</td>
            <td>${funcionario.cargo}</td>
            <td>R$ ${funcionario.salario.toFixed(2)}</td>
            <td>
                <button class="btn-editar">Editar</button>
                <button class="btn-excluir">Excluir</button>
            </td>
        `;
        
        // Eventos com arrow functions
        row.querySelector('.btn-editar').addEventListener('click', () => {
            document.getElementById('nome').value = funcionario.nome;
            document.getElementById('idade').value = funcionario.idade;
            document.getElementById('cargo').value = funcionario.cargo;
            document.getElementById('salario').value = funcionario.salario;
            editando = true;
            idEdicao = funcionario.id;
            btnSubmit.textContent = 'Atualizar';
        });
        
        row.querySelector('.btn-excluir').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir este funcionário?')) {
                removerFuncionario(funcionario.id);
                if (editando && idEdicao === funcionario.id) {
                    editando = false;
                    idEdicao = null;
                    form.reset();
                    btnSubmit.textContent = 'Cadastrar';
                }
                atualizarTabela();
            }
        });
        
        tbody.appendChild(row);
    });
    
    gerarRelatorios();
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    atualizarTabela();
});