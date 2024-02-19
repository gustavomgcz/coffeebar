const urlApi = "http://localhost:3000/corpo"
const formulario = document.querySelector("[data-formulario]")

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
                id: ultimoID,
                Nome: nome,
                Email: email,
                Celular: celular,
                Pontos: 0
            })
        })

        if(!conexao.ok) {
            throw new Error(`Erro ao criar usuário. Status: ${conexao.status}`)
        }

        const conexaoConvertida = conexao.json()

        return conexaoConvertida
    } catch (error) {
        console.error("Erro ao criar usuário:", error.message)
        throw error
    }
}

async function enviarUsuario(evento) {
    evento.preventDefault()

    const nome = document.querySelector("#nome").value
    const celular = document.querySelector("#celular").value
    const email = document.querySelector("#email").value

    try {
        await criarUsuario(nome, celular, email)
        window.location.href = "./usuarios.html"
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

verificaUltimoID()

formulario.addEventListener("submit", evento => enviarUsuario(evento))