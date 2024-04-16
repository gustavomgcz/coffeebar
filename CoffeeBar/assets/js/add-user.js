const urlApi = "http://localhost:3000/usuarios/"
const formulario = document.querySelector("[data-formulario]")
const body = document.querySelector('body')
const sumir = document.querySelector('.sucesso')


// Conexão API
async function listaDados() {
    const resposta = await fetch(urlApi)
    const dados = await resposta.json()
    
    return dados
}


async function criarUsuario(nome, celular, email) {
    let ultimoID = await verificaUltimoID()
    ultimoID = ultimoID + 1
    try {
        const conexao = await fetch(urlApi, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: parseInt(ultimoID),
                Nome: nome,
                Email: email,
                Celular: celular,
                Pontos: 0
            })
        })

        if(!conexao.ok) {
            throw new Error(`Erro ao criar usuário. Status: ${conexao.status}`)
        }


    } catch (error) {
        console.error("Erro ao criar usuário:", error.message)
        throw error
    }
}

async function enviarUsuario() {

    const nome = document.querySelector("#nome").value
    const celular = document.querySelector("#celular").value
    const email = document.querySelector("#email").value

    try {
        await criarUsuario(nome, celular, email)
        
        sumir.style.display = "none"
        const sucesso = document.createElement("div")
        sucesso.className = "centraliza"
        sucesso.innerHTML = `
            <div class="caixa">
                <h1 class="texto-ok">Usuários criados com sucesso!</h1>
                <button class="botao-ok" onclick="location.href='usuarios.html'">Avançar</button>
            </div>
        `
        body.appendChild(sucesso)
    } catch (e) {
        alert(e)
    }
}

async function verificaUltimoID () {
    const dados = await listaDados()
    const ultimoItem = dados.length - 1
    const ultimoID = dados[ultimoItem].id
    return ultimoID
}

formulario.addEventListener("submit", evento => {
    evento.preventDefault()
    enviarUsuario()
})
