const urlApi = "http://localhost:4000/corpo"
const formulario = document.querySelector("[data-formulario]")
const body = document.querySelector('body')
const sumir = document.querySelector('.sucesso')
let unSelecionada = document.querySelector('input[name="unidade"]:checked').value


// Conexão API
async function listaDados() {
    const resposta = await fetch(urlApi)
    const dados = await resposta.json()
    
    return dados
}


async function criarProduto(sku, produto, quantidade, valor) {
    try {
        const conexao = await fetch(urlApi, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: sku,
                Produto: produto,
                Quantidade: Number(quantidade),
                Valor: Number(valor),
                Unidade: unSelecionada
            })
        })

        if(!conexao.ok) {
            throw new Error(`Erro ao criar produto. Status: ${conexao.status}`)
        }


    } catch (error) {
        console.error("Erro ao criar usuário:", error.message)
        throw error
    }
}

async function enviarProduto() {

    const sku = document.querySelector("#sku").value
    const produto = document.querySelector("#produto").value
    const quantidade = document.querySelector("#quantidade").value
    const valor = document.querySelector("#valor").value

    try {
        await criarProduto(sku, produto, quantidade, valor)
        
        sumir.style.display = "none"
        const sucesso = document.createElement("div")
        sucesso.className = "centraliza"
        sucesso.innerHTML = `
            <div class="caixa">
                <h1 class="texto-ok">Produtos criados com sucesso!</h1>
                <button class="botao-ok" onclick="location.href='estoque.html'">Avançar</button>
            </div>
        `
        body.appendChild(sucesso)
    } catch (e) {
        alert(e)
    }
}

const radioUnidades = document.querySelector('.radio--unidades')
radioUnidades.addEventListener("click", function(e) {
    if (e.target.type === "radio" && e.target.name === "unidade"){
        unSelecionada = e.target.value
    }
})

formulario.addEventListener("submit", evento => {
    evento.preventDefault()
    enviarProduto()
})

function validarNumero(digito) {
    digito.value = digito.value.replace(/\D/g, '');
}