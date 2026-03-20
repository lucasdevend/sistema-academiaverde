
// verifica login


if(localStorage.getItem("logado") !== "true"){
    window.location.href = "login.html"
}


// verificar vencimento


function verificarVencimento(aluno){

if(!aluno.dataInicio) return aluno.status

let hoje = new Date()
let inicio = new Date(aluno.dataInicio)

let dias = (hoje - inicio) / (1000 * 60 * 60 * 24)

let limite = diasPlano(aluno.plano)

if(dias > limite){
return "vencido"
}

return aluno.status

}

function diasPlano(plano){

if(plano === "Mensal") return 30
if(plano === "Semestral") return 180
if(plano === "Anual") return 365

return 30 // padrão

}

function calcularVencimento(aluno){

let inicio = new Date(aluno.dataInicio)
let dias = diasPlano(aluno.plano)

inicio.setDate(inicio.getDate() + dias)

return inicio.toLocaleDateString()

}


// ============================
// RENDER TABELA
// ============================

function renderTabela(lista){

    let tabela = document.getElementById("listaAlunos")
    tabela.innerHTML = ""

    lista.forEach((aluno) => {

        let statusReal = verificarVencimento(aluno)

        let statusClasse =
        statusReal === "ativo" ? "status-ativo" :
        statusReal === "vencido" ? "status-vencido" :
        "status-pendente"

        let indexOriginal = JSON.parse(localStorage.getItem("alunos"))
        .findIndex(a => a.nome === aluno.nome && a.telefone === aluno.telefone)

        let linha = `
        <tr>
        <td>${aluno.nome}</td>
        <td>${aluno.telefone}</td>
        <td>${aluno.plano}</td>
        <td>${aluno.data || "-"}</td>

        <td class="${statusClasse}">
        ${statusReal}
        </td>
            <td>
                <button class="btn-ok" onclick="confirmarPagamento(${indexOriginal})">✔</button>
                <button class="btn-del" onclick="removerAluno(${indexOriginal})">✖</button>
                <button onclick='cobrarWhats(${JSON.stringify(aluno)})'>💬</button>
                <button class="btn-renew" onclick="renovarPlano(${indexOriginal})">🔄</button>
            </td>
        </tr>
        `

        tabela.innerHTML += linha

    })

}

function renovarPlano(index){

let alunos = JSON.parse(localStorage.getItem("alunos")) || []

alunos[index].dataInicio = new Date()
alunos[index].status = "ativo"

localStorage.setItem("alunos", JSON.stringify(alunos))

carregarAlunos()

}


// ============================
// DASHBOARD
// ============================

function atualizarDashboard(){

    let alunos = JSON.parse(localStorage.getItem("alunos")) || []

    let total = alunos.length

    let ativos = alunos.filter(a => verificarVencimento(a) === "ativo").length

    let faturamento = alunos
    .filter(a => verificarVencimento(a) === "ativo")
    .reduce((total, a) => total + (a.valor || 0), 0)

    document.getElementById("totalAlunos").innerText = total
    document.getElementById("ativos").innerText = ativos
    document.getElementById("faturamento").innerText = "R$ " + faturamento

}


// ============================
// CARREGAR
// ============================

function carregarAlunos(){

    let alunos = JSON.parse(localStorage.getItem("alunos")) || []

    renderTabela(alunos)
    atualizarDashboard()

}


// ============================
// CONFIRMAR PAGAMENTO
// ============================

function confirmarPagamento(index){

    let alunos = JSON.parse(localStorage.getItem("alunos")) || []

    alunos[index].status = "ativo"
    alunos[index].dataInicio = new Date()

    localStorage.setItem("alunos", JSON.stringify(alunos))

    carregarAlunos()

}


// ============================
// REMOVER ALUNO
// ============================

function removerAluno(index){

    let alunos = JSON.parse(localStorage.getItem("alunos")) || []

    alunos.splice(index,1)

    localStorage.setItem("alunos", JSON.stringify(alunos))

    carregarAlunos()

}


// ============================
// BUSCA
// ============================

function buscarAluno(){

    let filtro = document.getElementById("busca").value.toLowerCase()
    let alunos = JSON.parse(localStorage.getItem("alunos")) || []

    let filtrados = alunos.filter(a => 
        a.nome.toLowerCase().includes(filtro)
    )

    renderTabela(filtrados)

}


// ============================
// LOGOUT
// ============================

function logout(){

    localStorage.removeItem("logado")
    window.location.href = "login.html"

}


// ============================
// INIT
// ============================

carregarAlunos()


function cobrarWhats(aluno){

    let numero = aluno.telefone.replace(/\D/g, "")

    let mensagem = `Olá ${aluno.nome}, tudo bem?

    Seu plano (${aluno.plano}) está pendente/vencido.
    Valor: R$ ${aluno.valor}

    Realize o pagamento via PIX para continuar treinando 💪`

    let url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`

    window.open(url, "_blank")

}