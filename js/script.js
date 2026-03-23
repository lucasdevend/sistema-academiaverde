
// headr ao rolar

let planoEscolhido = ""
let valorPlano = 0

window.addEventListener("scroll", () => {

    let header = document.getElementById("header")

    if(window.scrollY > 50){
        header.classList.add("scrolled")
    }else{
        header.classList.remove("scrolled")
    }

})

// scroll suave


document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(e){

    e.preventDefault()

    let destino = document.querySelector(this.getAttribute("href"))

        if(destino){
                destino.scrollIntoView({
                behavior:"smooth"
            })
        }

    })

})



// modal + plano


const modal = document.getElementById("modal")
const close = document.querySelector(".close")

function abrirPlano(nome, valor){

    planoEscolhido = nome
    valorPlano = Number(valor)

    console.log("Plano clicado:", nome, valorPlano)

    document.getElementById("planoSelecionado").innerText =
    `Plano escolhido: ${nome} - R$ ${valorPlano.toFixed(2)}`

    // 🔥 RESET TOTAL DO PIX
    document.getElementById("pixArea").style.display = "none"
    document.getElementById("valorPix").innerText = ""
    document.getElementById("qrcode").innerHTML = ""

    document.getElementById("modal").style.display = "flex"
}

// deixar acessível no html
window.abrirPlano = abrirPlano


// fechar no X
close.onclick = () => {
    modal.style.display = "none"
}

// fechar clicando fora
window.onclick = function(event){
    if(event.target === modal){
        modal.style.display = "none"
    }
}


// cadastro + pix + QR Ccode


function cadastrarAluno(){

    let nome = document.getElementById("nome").value
    let telefone = document.getElementById("telefone").value
    let email = document.getElementById("email").value

    if(!nome || !telefone){
        alert("Preencha nome e telefone")
        return
    }

    let alunos = JSON.parse(localStorage.getItem("alunos")) || []

    let jaExiste = alunos.some(a => a.telefone === telefone)

    let taxaMatricula = 30
    let valorBase = Number(valorPlano)
    let valorFinal = valorBase

    let textoValor = ""

    // ✅ cálculo correto
    if(!jaExiste){
        valorFinal += taxaMatricula
        textoValor = `${valorBase.toFixed(2)} + 50 = ${valorFinal.toFixed(2)}`
    } else {
        textoValor = valorBase.toFixed(2)
    }

    // salvar aluno
    let aluno = {
        nome,
        telefone,
        email,
        plano: planoEscolhido,
        valor: valorFinal,
        data: new Date().toLocaleDateString(),
        dataInicio: new Date(),
        status: "aguardando pagamento"
    }

    alunos.push(aluno)
    localStorage.setItem("alunos", JSON.stringify(alunos))

    // ✅ mostrar correto (sem sobrscrever)
    document.getElementById("valorPix").innerText = textoValor
    document.getElementById("pixArea").style.display = "block"

   // QR CODE
    let chavePix = "academiatestefit@email.com"

    let textoPix = `PIX
        Nome: Academia PowerFit
        Valor: ${valorFinal}
        Chave: ${chavePix}`

    document.getElementById("qrcode").innerHTML = ""

    new QRCode(document.getElementById("qrcode"), {
        text: textoPix,
        width: 120,
        height: 120
    })

    // whatsapp
    let numeroAcademia = "5511991421107"

    let mensagem = `Olá, acabei de me matricular na academia 💪

    Nome: ${nome}
    Plano: ${planoEscolhido}
    Valor: R$ ${valorFinal}

    Segue meu comprovante do PIX.`

    let link = `https://wa.me/${numeroAcademia}?text=${encodeURIComponent(mensagem)}`

    document.getElementById("btnWhatsapp").href = link

}
   // deixar acessível no HTML
    window.cadastrarAluno = cadastrarAluno



// copiar pix 


function copiarPix(){

    let chave = document.getElementById("chavePix")

    chave.select()
    chave.setSelectionRange(0, 99999)

    document.execCommand("copy")

    alert("Chave PIX copiada!")

}

    window.copiarPix = copiarPix



// animacao (reveal)


function reveal(){

    let elements = document.querySelectorAll(".reveal")

        elements.forEach(el => {

        let windowHeight = window.innerHeight
        let elementTop = el.getBoundingClientRect().top

        if(elementTop < windowHeight - 100){
            el.style.opacity = "1"
            el.style.transform = "translateY(0)"
        }

    })

}

    window.addEventListener("scroll", reveal)