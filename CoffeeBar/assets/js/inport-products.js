const urlApi = "http://localhost:3000/produtos/"
const tabela = document.querySelector("table")
const cabecalhoTabela = tabela.querySelector("thead")
const corpoTabela = tabela.querySelector("tbody")
const buscaDigitado = document.querySelector('#procurar')
let itensPorPagina = Number(document.querySelector('.dropdown').value)
let paginaUm = 1
let arrayAtualizado = []
const botoesPorPagina = 5
const cabecalho = ["SKU","Produto","Quantidade","Valor", "Unidade", "Ações"]
buscaDigitado.value = ''


// Conexão API
async function listaDados() {
    const resposta = await fetch(urlApi)
    const dados = await resposta.json()
    
    return dados
}


// Construtor Tabela
async function criaTabela(paginaAtual, itensPorPagina) {
    const resultado = await listaDados()

    arrayAtualizado = resultado;
    const resultadoCabecalho = cabecalho
    
    cabecalhoTabela.innerHTML = "<tr></tr>"
    
    // Cabeçalho Tabela
    for (const cabecalhoTexto of resultadoCabecalho) {
        const cabecalhoElemento = document.createElement("th")
        
        cabecalhoElemento.textContent = cabecalhoTexto
        cabecalhoTabela.querySelector("tr").appendChild(cabecalhoElemento)
    }
    
    // Cria Corpo Tabela e Realiza Busca
    mostraDados(resultado, itensPorPagina, paginaAtual)

    
}


function mostraDados(resultadoCorpo, itensPorPagina, paginaAtual) {

    paginaUm = paginaAtual;
    corpoTabela.innerHTML = ""

    let inicioIndex = (paginaAtual - 1) * itensPorPagina
    let fimIndex = inicioIndex + itensPorPagina
    
    for (let i = inicioIndex; i < fimIndex && i < resultadoCorpo.length; i++) {
        const conteudo = resultadoCorpo[i]
        const conteudoElemento = document.createElement("tr")
    
        for (const corpoTexto in conteudo) {
            if (conteudo.hasOwnProperty(corpoTexto)) {
                const corpoElemento = document.createElement("td")

                corpoElemento.textContent = conteudo[corpoTexto]
                conteudoElemento.appendChild(corpoElemento)
            }
        }

        const botoesEdicao = document.createElement("div")
        const botaoVantagens = document.createElement('button')
        const botaoEditar = document.createElement('button')
        const botaoExcluir = document.createElement('button')
        
        botaoVantagens.innerHTML = '<svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"></path></svg>'
        botaoEditar.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path></svg>'
        botaoExcluir.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.3094 2.25002H13.6908C13.9072 2.24988 14.0957 2.24976 14.2737 2.27819C14.977 2.39049 15.5856 2.82915 15.9146 3.46084C15.9978 3.62073 16.0573 3.79961 16.1256 4.00494L16.2373 4.33984C16.2562 4.39653 16.2616 4.41258 16.2661 4.42522C16.4413 4.90933 16.8953 5.23659 17.4099 5.24964C17.4235 5.24998 17.44 5.25004 17.5001 5.25004H20.5001C20.9143 5.25004 21.2501 5.58582 21.2501 6.00004C21.2501 6.41425 20.9143 6.75004 20.5001 6.75004H3.5C3.08579 6.75004 2.75 6.41425 2.75 6.00004C2.75 5.58582 3.08579 5.25004 3.5 5.25004H6.50008C6.56013 5.25004 6.5767 5.24998 6.59023 5.24964C7.10488 5.23659 7.55891 4.90936 7.73402 4.42524C7.73863 4.41251 7.74392 4.39681 7.76291 4.33984L7.87452 4.00496C7.94281 3.79964 8.00233 3.62073 8.08559 3.46084C8.41453 2.82915 9.02313 2.39049 9.72643 2.27819C9.90445 2.24976 10.093 2.24988 10.3094 2.25002ZM9.00815 5.25004C9.05966 5.14902 9.10531 5.04404 9.14458 4.93548C9.1565 4.90251 9.1682 4.86742 9.18322 4.82234L9.28302 4.52292C9.37419 4.24941 9.39519 4.19363 9.41601 4.15364C9.52566 3.94307 9.72853 3.79686 9.96296 3.75942C10.0075 3.75231 10.067 3.75004 10.3553 3.75004H13.6448C13.9331 3.75004 13.9927 3.75231 14.0372 3.75942C14.2716 3.79686 14.4745 3.94307 14.5842 4.15364C14.605 4.19363 14.626 4.2494 14.7171 4.52292L14.8169 4.82216L14.8556 4.9355C14.8949 5.04405 14.9405 5.14902 14.992 5.25004H9.00815Z"></path><path d="M5.91509 8.45015C5.88754 8.03685 5.53016 7.72415 5.11686 7.7517C4.70357 7.77925 4.39086 8.13663 4.41841 8.54993L4.88186 15.5017C4.96736 16.7844 5.03642 17.8205 5.19839 18.6336C5.36679 19.4789 5.65321 20.185 6.2448 20.7385C6.8364 21.2919 7.55995 21.5308 8.4146 21.6425C9.23662 21.7501 10.275 21.7501 11.5606 21.75H12.4395C13.7251 21.7501 14.7635 21.7501 15.5856 21.6425C16.4402 21.5308 17.1638 21.2919 17.7554 20.7385C18.347 20.185 18.6334 19.4789 18.8018 18.6336C18.9638 17.8206 19.0328 16.7844 19.1183 15.5017L19.5818 8.54993C19.6093 8.13663 19.2966 7.77925 18.8833 7.7517C18.47 7.72415 18.1126 8.03685 18.0851 8.45015L17.6251 15.3493C17.5353 16.6971 17.4713 17.6349 17.3307 18.3406C17.1943 19.025 17.004 19.3873 16.7306 19.6431C16.4572 19.8989 16.083 20.0647 15.391 20.1552C14.6776 20.2485 13.7376 20.25 12.3868 20.25H11.6134C10.2626 20.25 9.32255 20.2485 8.60915 20.1552C7.91715 20.0647 7.54299 19.8989 7.26958 19.6431C6.99617 19.3873 6.80583 19.025 6.66948 18.3406C6.52892 17.6349 6.46489 16.6971 6.37503 15.3493L5.91509 8.45015Z"></path><path d="M9.42546 10.2538C9.83762 10.2125 10.2052 10.5133 10.2464 10.9254L10.7464 15.9254C10.7876 16.3376 10.4869 16.7051 10.0747 16.7463C9.66256 16.7875 9.29503 16.4868 9.25381 16.0747L8.75381 11.0747C8.7126 10.6625 9.01331 10.295 9.42546 10.2538Z"></path> <path d="M14.5747 10.2538C14.9869 10.295 15.2876 10.6625 15.2464 11.0747L14.7464 16.0747C14.7052 16.4868 14.3376 16.7875 13.9255 16.7463C13.5133 16.7051 13.2126 16.3376 13.2538 15.9254L13.7538 10.9254C13.795 10.5133 14.1626 10.2125 14.5747 10.2538Z"></path></svg>'
        
        botoesEdicao.classList.add('campo-botoes')
        botaoVantagens.classList.add('botao-acao')
        botaoVantagens.classList.add('botao-vantagens')
        botaoEditar.classList.add('botao-acao')
        botaoEditar.classList.add('botao-editar')
        botaoExcluir.classList.add('botao-acao')
        botaoExcluir.classList.add('botao-excluir')

        botoesEdicao.appendChild(botaoVantagens)
        botoesEdicao.appendChild(botaoEditar)
        botoesEdicao.appendChild(botaoExcluir)
    
        const corpoElemento = document.createElement("td")
        corpoElemento.appendChild(botoesEdicao)
        conteudoElemento.appendChild(corpoElemento)

        corpoTabela.appendChild(conteudoElemento)
    }
    
    // Insere Botões de Páginas
    paginacao(paginaAtual, resultadoCorpo, itensPorPagina)

    // Dropdown Quantidade de Itens Por Página
    seletorItensPagina()
}


// Botões Seleção Página
function paginacao (paginaAtual, resultadoCorpo, itensPorPagina) {
    const paginas = Math.ceil(resultadoCorpo.length / itensPorPagina)
    const divDosBotoes = document.querySelector('.campo-paginacao')

    divDosBotoes.innerHTML = ""
    
    let esquerdaMax = paginaAtual - Math.floor(botoesPorPagina / 2)
    let direitaMax = paginaAtual + Math.floor(botoesPorPagina / 2)

    if (esquerdaMax < 1) {
        esquerdaMax = 1
        direitaMax = botoesPorPagina
    }
    
    if (direitaMax > paginas) {
        esquerdaMax = paginas - (botoesPorPagina - 1)
        
        direitaMax = paginas
        
        if (esquerdaMax < 1) {
            esquerdaMax = 1
        }
    }
    
    for (let pagina = esquerdaMax; pagina <= direitaMax; pagina++) {
        
        let botaoPagina = document.createElement('button')
        botaoPagina.classList.add('botao-pg')
        botaoPagina.innerText = pagina
        
        if (paginaAtual == pagina) botaoPagina.classList.add('ativo')
        
        divDosBotoes.appendChild(botaoPagina)
    }
    
    if (paginaAtual != 1) {
        divDosBotoes.innerHTML = '<button class="botao-pg inicio-fim">&#171; Inicio</button>' + divDosBotoes.innerHTML
    }
    
    if (paginaAtual != paginas) {
        divDosBotoes.innerHTML += '<button class="botao-pg inicio-fim">Fim &#187;</button>'
    }
    
    let botoes = document.querySelectorAll('.botao-pg')
    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            let numeroBotaoClicado = botao.textContent
            let valorBotao = Number(numeroBotaoClicado)
            
            if (numeroBotaoClicado == "Fim »") valorBotao = paginas
            
            if (numeroBotaoClicado == "« Inicio") valorBotao = 1
            
            mostraDados(resultadoCorpo, itensPorPagina, valorBotao)
        })
    })
}


// Seleção de Itens Por Página
function seletorItensPagina() {

    const selectDropdown = document.querySelector('.dropdown')
    
    selectDropdown.addEventListener('change', () => {
        itensPorPagina = Number(selectDropdown.value)
        buscaDigitado.value = ''
        criaTabela(paginaUm, itensPorPagina)
    })
}

buscaDigitado.addEventListener('keyup', function () {
    let valor = this.value.toLocaleLowerCase()

    
    if (valor.length > 2) {
        let filtroCorpo = arrayAtualizado.filter(function(item) {
            for (let propriedade in item) {
                if (item.hasOwnProperty(propriedade)) {
                    let propriedadeValor = item[propriedade]
                    if ((typeof propriedadeValor === 'string' && propriedadeValor.toLowerCase().includes(valor)) ||
                        (typeof propriedadeValor === 'number' && propriedadeValor.toString().includes(valor))) {
                        return true
                    }
                }
            }
            return false
        })
        
        corpoTabela.innerHTML = ""
        
        mostraDados(filtroCorpo, itensPorPagina, paginaUm)
        
    } else {
        criaTabela(1, itensPorPagina)
    }

})


criaTabela(paginaUm, itensPorPagina)