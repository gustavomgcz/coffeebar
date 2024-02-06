async function popularTabela (url, tabela, itensPorPagina, paginaAtual, botoesPorPagina) {
    const cabecalhoTabela = tabela.querySelector("thead")
    const corpoTabela = tabela.querySelector("tbody")
    const resposta = await fetch(url)
    const { cabecalho , corpo } = await resposta.json()


    let inicioIndex = (paginaAtual - 1) * itensPorPagina
    let fimIndex = inicioIndex + itensPorPagina



    // Cabeçalho Tabela

    cabecalhoTabela.innerHTML = "<tr></tr>"
    corpoTabela.innerHTML = ""

    for (const cabecalhoTexto of cabecalho) {
        const cabecalhoElemento = document.createElement("th")

        cabecalhoElemento.textContent = cabecalhoTexto
        cabecalhoTabela.querySelector("tr").appendChild(cabecalhoElemento)
    }

    // Corpo Tabela

    for (let i = inicioIndex; i < fimIndex && i < corpo.length; i++) {
        const conteudo = corpo [i]
        const conteudoElemento = document.createElement("tr")
        
        for (const corpoTexto of conteudo) {
            const corpoElemento = document.createElement("td")

            corpoElemento.textContent = corpoTexto
            conteudoElemento.appendChild(corpoElemento)
        }

        corpoTabela.appendChild(conteudoElemento)
    }


    buscarValorDigitado (corpoTabela)                                       // Input de Busca

    paginacao (corpo, itensPorPagina, paginaAtual, botoesPorPagina)         // Botões Páginas

    seletorItensPagina(paginaAtual, botoesPorPagina)

}

function buscarValorDigitado (conteudoTabela) {
    $('#procurar').on('keyup', function() {
        let valor = $(this).val().toLocaleLowerCase()
    
        for (const linha of conteudoTabela.querySelectorAll("tr")) {
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
        
    })
}

function paginacao (dados, itensPorPagina, paginaAtual, botoesPorPagina) {
    const paginas = Math.ceil(dados.length / itensPorPagina)
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

            popularTabela("assets/json/tabela.json", document.querySelector("table"), itensPorPagina, valorBotao, botoesPorPagina)
        })
    })

}


function seletorItensPagina(paginaAtual, botoesPorPagina) {
    const selectDropdown = document.querySelector('.dropdown')
    
    selectDropdown.addEventListener('change', () => {
        let valorSelecionado = Number(selectDropdown.value)

        popularTabela("assets/json/tabela.json", document.querySelector("table"), valorSelecionado, 1, botoesPorPagina)
    })

}


let itensPg = Number(document.querySelector('.dropdown').value)
const botoesPorPagina = 5

popularTabela("assets/json/tabela.json", document.querySelector("table"), itensPg, 1, botoesPorPagina)