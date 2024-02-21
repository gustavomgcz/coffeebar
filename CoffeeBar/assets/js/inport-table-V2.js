// const urlApi = "/assets/json/tabela.json"
const urlApi = "http://localhost:3000/corpo"
const tabela = document.querySelector("table")
const cabecalhoTabela = tabela.querySelector("thead")
const corpoTabela = tabela.querySelector("tbody")
const buscaDigitado = document.querySelector('#procurar')
let itensPorPagina = Number(document.querySelector('.dropdown').value)
const paginaUm = 1
const botoesPorPagina = 5
const cabecalho = ["User ID","Nome","E-mail","Celular","Pontos"]


// Conexão API
async function listaDados() {
    const resposta = await fetch(urlApi)
    const dados = await resposta.json()
    
    return dados
}


// Construtor Tabela
async function criaTabela(paginaAtual, itensPorPagina) {
    const resultado = await listaDados()
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

        corpoTabela.appendChild(conteudoElemento)
    }
    
    // Campo de Busca
    buscarValorDigitado(resultadoCorpo, itensPorPagina, paginaAtual)

    // Insere Botões de Páginas
    paginacao(paginaAtual, resultadoCorpo, itensPorPagina)

    // Dropdown Quantidade de Itens Por Página
    seletorItensPagina()
}

// Busca Dados
function buscarValorDigitado(resultadoCorpo, itensPorPagina, paginaAtual) {
    buscaDigitado.addEventListener('keyup', function () {
        let valor = this.value.toLocaleLowerCase()
        
        if (valor.length > 2) {
            let filtroCorpo = resultadoCorpo.filter(function(item) {
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
            
            mostraDados(filtroCorpo, itensPorPagina, paginaAtual)
            
            paginacao(paginaAtual, filtroCorpo, itensPorPagina)

        } else {
            criaTabela(1, itensPorPagina)
        }

    })
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
        
        criaTabela(paginaUm, itensPorPagina)
    })
}


criaTabela(paginaUm, itensPorPagina)