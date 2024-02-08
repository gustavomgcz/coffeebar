const urlApi = "assets/json/tabela.json"
const tabela = document.querySelector("table")
const cabecalhoTabela = tabela.querySelector("thead")
const corpoTabela = tabela.querySelector("tbody")
const buscaDigitado = document.querySelector('#procurar')
let itensPorPagina = Number(document.querySelector('.dropdown').value)
let paginaAtual = 1
const botoesPorPagina = 5


// Conexão API
async function listaDados(urlApi) {
    const resposta = await fetch(urlApi)
    const dados = await resposta.json()
    
    return dados
}


// Construtor Tabela
async function criaTabela(paginaAtual, itensPorPagina) {
    const resultado = await listaDados(urlApi)
    const resultadoCabecalho = resultado.cabecalho
    const resultadoCorpo = resultado.corpo
    
    cabecalhoTabela.innerHTML = "<tr></tr>"
    corpoTabela.innerHTML = ""
    
    let inicioIndex = (paginaAtual - 1) * itensPorPagina
    let fimIndex = inicioIndex + itensPorPagina
    
    // Cabeçalho Tabela
    for (const cabecalhoTexto of resultadoCabecalho) {
        const cabecalhoElemento = document.createElement("th")
        
        cabecalhoElemento.textContent = cabecalhoTexto
        cabecalhoTabela.querySelector("tr").appendChild(cabecalhoElemento)
    }
    
    // Cria Corpo Tabela e Realiza Busca
    mostraDados(inicioIndex, fimIndex, resultadoCorpo)

    // Insere Botões de Páginas
    paginacao(paginaAtual, resultadoCorpo)

    // Dropdown Quantidade de Itens Por Página
    seletorItensPagina()
}


function mostraDados(inicioIndex, fimIndex, resultadoCorpo) {
    corpoTabela.innerHTML = ""
    for (let i = inicioIndex; i < fimIndex && i < resultadoCorpo.length; i++) {
        const conteudo = resultadoCorpo[i]
        const conteudoElemento = document.createElement("tr")
    
        for (const corpoTexto of conteudo) {
            const corpoElemento = document.createElement("td")

            corpoElemento.textContent = corpoTexto
            conteudoElemento.appendChild(corpoElemento)
        }

        corpoTabela.appendChild(conteudoElemento)
    }

    buscarValorDigitado()
}

function buscarValorDigitado() {
    buscaDigitado.addEventListener('keyup', function () {
        let valor = this.value.toLocaleLowerCase()
        if (valor.length > 2) {
            for (const linha of corpoTabela.querySelectorAll("tr")) {
                const celulas = linha.querySelectorAll("td")
                let encontrado = false

                for (const celula of celulas) {
                    if (celula.textContent.toLocaleLowerCase().includes(valor)) {
                        encontrado = true
                        break
                    }
                }

                linha.style.display = encontrado ? "" : "none"

            }
        } else {
            for (const linha of corpoTabela.querySelectorAll("tr")) {
                linha.style.display = ""
            }
        }

    })
}


// Botões Seleção Página
function paginacao (paginaAtual, resultadoCorpo) {
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
            
            criaTabela(valorBotao, itensPorPagina)
        })
    })
    
}


// Seleção de Itens Por Página
function seletorItensPagina() {
    const selectDropdown = document.querySelector('.dropdown')
    
    selectDropdown.addEventListener('change', () => {
        let valorSelecionado = Number(selectDropdown.value)
        itensPorPagina = valorSelecionado
        
        criaTabela(paginaAtual, itensPorPagina)
    })
}


criaTabela(paginaAtual, itensPorPagina)