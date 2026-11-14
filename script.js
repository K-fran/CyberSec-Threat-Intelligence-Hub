/* =========================================================================
   CYBERSEC & THREAT INTELLIGENCE HUB - LÓGICA DOM E VALIDAÇÕES (script.js)
   Regra Estrita Cumprida: Uso exclusivo de const e let (ZERO uso de var).
   ========================================================================= */

// =========================================================================
// FUNCIONALIDADE INTERATIVA 1 (OPÇÃO E): LISTA DINÂMICA DE AUDITORIA PENTEST
// =========================================================================
const pedroTarefasIniciais = [
    { id: 1, texto: "Mapear superfície de subdomínios e portas expostas (WSTG-INFO-02)", concluida: true },
    { id: 2, texto: "Testar injeção SQL parametrizada no endpoint /api/v1/login (WSTG-INPV-05)", concluida: false },
    { id: 3, texto: "Auditar flags HttpOnly, Secure e SameSite nos cookies de sessão", concluida: false }
];

let pedroListaEstado = [...pedroTarefasIniciais];
let pedroFiltroAtual = "todos";
let pedroProximoId = 4;

const pedroInputTarefa = document.getElementById("pedro_input_tarefa");
const pedroBtnAddTarefa = document.getElementById("pedro_btn_add_tarefa");
const pedroBtnLimparTodas = document.getElementById("pedro_btn_limpar_todas");
const pedroUlTarefas = document.getElementById("pedro_lista_tarefas");
const pedroMsgAuditoria = document.getElementById("pedro_msg_auditoria");
const pedroCountTotal = document.getElementById("pedro_count_total");
const pedroCountPendentes = document.getElementById("pedro_count_pendentes");
const pedroCountConcluidos = document.getElementById("pedro_count_concluidos");
const pedroBotoesFiltro = document.querySelectorAll(".pedro_btn_filtro");

// -------------------------------------------------------------------------
// DEMONSTRAÇÃO OBRIGATÓRIA 1: FUNÇÃO NOMEADA (Named Function)
// Atualiza contadores e renderiza a lista de tarefas de pentest no DOM
// -------------------------------------------------------------------------
function pedroRenderizarChecklist() {
    pedroUlTarefas.innerHTML = "";

    const total = pedroListaEstado.length;
    const concluidos = pedroListaEstado.filter((item) => item.concluida).length;
    const pendentes = total - concluidos;

    pedroCountTotal.textContent = String(total);
    pedroCountPendentes.textContent = String(pendentes);
    pedroCountConcluidos.textContent = String(concluidos);

    const itensFiltrados = pedroListaEstado.filter((tarefa) => {
        if (pedroFiltroAtual === "pendente") {
            return !tarefa.concluida;
        } else if (pedroFiltroAtual === "concluido") {
            return tarefa.concluida;
        }
        return true;
    });

    if (itensFiltrados.length === 0) {
        const liVazio = document.createElement("li");
        liVazio.className = "pedro_tarefa_li";
        liVazio.textContent = "Nenhuma tarefa de auditoria encontrada para o filtro selecionado.";
        pedroUlTarefas.appendChild(liVazio);
        return;
    }

    itensFiltrados.forEach((tarefa) => {
        const li = document.createElement("li");
        li.className = `pedro_tarefa_li ${tarefa.concluida ? "pedro_tarefa_concluida" : "pedro_tarefa_pendente"}`;

        const divInfo = document.createElement("div");
        divInfo.className = "pedro_tarefa_info";

        const badge = document.createElement("span");
        badge.className = `pedro_status_badge ${tarefa.concluida ? "pedro_badge_concluido" : "pedro_badge_pendente"}`;
        badge.textContent = tarefa.concluida ? "Concluído" : "Pendente";

        divInfo.appendChild(badge);

        if (tarefa.editando) {
            const inputEdicao = document.createElement("input");
            inputEdicao.type = "text";
            inputEdicao.className = "pedro_input_field";
            inputEdicao.value = tarefa.texto;
            inputEdicao.id = `pedro_edit_input_${tarefa.id}`;
            divInfo.appendChild(inputEdicao);
        } else {
            const spanTexto = document.createElement("span");
            spanTexto.className = tarefa.concluida ? "pedro_tarefa_texto_concluido" : "";
            spanTexto.textContent = tarefa.texto;
            divInfo.appendChild(spanTexto);
        }

        const divAcoes = document.createElement("div");
        divAcoes.className = "pedro_tarefa_acoes";

        // Botão Alternar Status (Pendente / Concluído)
        const btnStatus = document.createElement("button");
        btnStatus.type = "button";
        btnStatus.className = "pedro_btn_mini";
        btnStatus.textContent = tarefa.concluida ? "Marcar Pendente" : "Concluir";
        btnStatus.addEventListener("click", () => {
            tarefa.concluida = !tarefa.concluida;
            pedroMsgAuditoria.textContent = `Status do item atualizado para: ${tarefa.concluida ? "Concluído" : "Pendente"}.`;
            pedroRenderizarChecklist();
        });

        // Botão Editar / Salvar Edição
        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "pedro_btn_mini";
        btnEditar.textContent = tarefa.editando ? "Salvar" : "Editar";
        btnEditar.addEventListener("click", () => {
            if (tarefa.editando) {
                const campoEditado = document.getElementById(`pedro_edit_input_${tarefa.id}`);
                const novoTexto = campoEditado ? campoEditado.value.trim() : "";
                if (novoTexto === "") {
                    pedroMsgAuditoria.textContent = "Erro: O texto da tarefa não pode ficar vazio durante a edição.";
                    return;
                }
                tarefa.texto = novoTexto;
                tarefa.editando = false;
                pedroMsgAuditoria.textContent = "Tarefa de auditoria atualizada com sucesso.";
            } else {
                tarefa.editando = true;
                pedroMsgAuditoria.textContent = "Editando item. Altere o texto e clique em Salvar.";
            }
            pedroRenderizarChecklist();
        });

        // Botão Excluir Individual
        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.className = "pedro_btn_mini";
        btnExcluir.textContent = "Excluir";
        btnExcluir.addEventListener("click", () => {
            pedroListaEstado = pedroListaEstado.filter((item) => item.id !== tarefa.id);
            pedroMsgAuditoria.textContent = "Item removido do escopo de auditoria.";
            pedroRenderizarChecklist();
        });

        divAcoes.appendChild(btnStatus);
        divAcoes.appendChild(btnEditar);
        divAcoes.appendChild(btnExcluir);

        li.appendChild(divInfo);
        li.appendChild(divAcoes);
        pedroUlTarefas.appendChild(li);
    });
}

// -------------------------------------------------------------------------
// DEMONSTRAÇÃO OBRIGATÓRIA 2: ARROW FUNCTION (() => {})
// Adiciona um novo item à lista de pentest impedindo texto vazio
// -------------------------------------------------------------------------
const pedroAdicionarTarefa = () => {
    const textoLimpo = pedroInputTarefa.value.trim();

    if (textoLimpo === "") {
        pedroMsgAuditoria.textContent = "Atenção: Digite a descrição da verificação de pentest antes de adicionar.";
        pedroInputTarefa.focus();
        return;
    }

    pedroListaEstado.push({
        id: pedroProximoId,
        texto: textoLimpo,
        concluida: false,
        editando: false
    });
    pedroProximoId += 1;

    pedroInputTarefa.value = "";
    pedroMsgAuditoria.textContent = "Nova verificação adicionada ao checklist de pentest.";
    pedroRenderizarChecklist();
};

pedroBtnAddTarefa.addEventListener("click", pedroAdicionarTarefa);

pedroInputTarefa.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();
        pedroAdicionarTarefa();
    }
});

pedroBtnLimparTodas.addEventListener("click", () => {
    if (pedroListaEstado.length === 0) {
        pedroMsgAuditoria.textContent = "A lista já está vazia.";
        return;
    }
    pedroListaEstado = [];
    pedroMsgAuditoria.textContent = "Todas as tarefas de auditoria foram removidas.";
    pedroRenderizarChecklist();
});

pedroBotoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
        pedroBotoesFiltro.forEach((btn) => btn.classList.remove("pedro_filtro_ativo"));
        botao.classList.add("pedro_filtro_ativo");
        pedroFiltroAtual = botao.getAttribute("data-filtro");
        pedroRenderizarChecklist();
    });
});

// Inicializa a lista ao carregar o script
pedroRenderizarChecklist();


// =========================================================================
// FUNCIONALIDADE INTERATIVA 2 (OPÇÃO C): MODAL COM DADOS E IMAGEM DO USUÁRIO
// =========================================================================
const joelsonInputTitulo = document.getElementById("joelson_evidencia_titulo");
const joelsonInputDesc = document.getElementById("joelson_evidencia_desc");
const joelsonInputArquivo = document.getElementById("joelson_evidencia_arquivo");
const joelsonBtnAbrirModal = document.getElementById("joelson_btn_visualizar_modal");
const joelsonBtnFecharModal = document.getElementById("joelson_btn_fechar_modal");
const joelsonModalOverlay = document.getElementById("joelson_modal_overlay");
const joelsonModalTituloView = document.getElementById("joelson_modal_titulo_view");
const joelsonModalDescView = document.getElementById("joelson_modal_desc_view");
const joelsonModalImgView = document.getElementById("joelson_modal_img_view");
const joelsonEvidenciaAviso = document.getElementById("joelson_evidencia_aviso");

let joelsonUrlObjetoAtual = null;

// -------------------------------------------------------------------------
// DEMONSTRAÇÃO OBRIGATÓRIA 3: FUNÇÃO ANÔNIMA TRADICIONAL (function() {})
// Valida os campos de evidência, gera o preview local e abre a janela modal
// -------------------------------------------------------------------------
const joelsonAbrirInspecaoModal = function () {
    const titulo = joelsonInputTitulo.value.trim();
    const descricao = joelsonInputDesc.value.trim();
    const arquivos = joelsonInputArquivo.files;

    if (titulo === "") {
        joelsonEvidenciaAviso.textContent = "Erro: Informe o título da evidência forense.";
        joelsonInputTitulo.focus();
        return;
    }

    if (!arquivos || arquivos.length === 0) {
        joelsonEvidenciaAviso.textContent = "Erro: Selecione uma imagem local do seu computador.";
        joelsonInputArquivo.focus();
        return;
    }

    if (descricao === "") {
        joelsonEvidenciaAviso.textContent = "Erro: Preencha a descrição técnica da evidência.";
        joelsonInputDesc.focus();
        return;
    }

    const arquivoImagem = arquivos[0];
    if (!arquivoImagem.type.startsWith("image/")) {
        joelsonEvidenciaAviso.textContent = "Erro: O arquivo selecionado precisa ser uma imagem válida.";
        return;
    }

    if (joelsonUrlObjetoAtual) {
        URL.revokeObjectURL(joelsonUrlObjetoAtual);
    }

    joelsonUrlObjetoAtual = URL.createObjectURL(arquivoImagem);

    joelsonModalTituloView.textContent = titulo;
    joelsonModalDescView.textContent = descricao;
    joelsonModalImgView.src = joelsonUrlObjetoAtual;
    joelsonModalImgView.alt = `Evidência carregada: ${titulo}`;

    joelsonEvidenciaAviso.textContent = "Evidência carregada com sucesso.";
    joelsonModalOverlay.classList.add("joelson_modal_aberto");
    joelsonModalOverlay.setAttribute("aria-hidden", "false");
};

function joelsonFecharModal() {
    joelsonModalOverlay.classList.remove("joelson_modal_aberto");
    joelsonModalOverlay.setAttribute("aria-hidden", "true");
}

joelsonBtnAbrirModal.addEventListener("click", joelsonAbrirInspecaoModal);
joelsonBtnFecharModal.addEventListener("click", joelsonFecharModal);

// Fecha o modal ao clicar no fundo escuro externo (overlay)
joelsonModalOverlay.addEventListener("click", function (evento) {
    if (evento.target === joelsonModalOverlay) {
        joelsonFecharModal();
    }
});


// =========================================================================
// FUNCIONALIDADE INTERATIVA 3 (OPÇÃO B): FAQ / ACCORDION COM BUSCA EM TEMPO REAL
// =========================================================================
const kaueFaqItens = document.querySelectorAll(".kaue_faq_item");
const kaueInputBuscaFaq = document.getElementById("kaue_input_busca_faq");
const kaueFaqSemResultados = document.getElementById("kaue_faq_sem_resultados");

kaueFaqItens.forEach((item) => {
    const botaoPergunta = item.querySelector(".kaue_faq_pergunta");
    const icone = item.querySelector(".kaue_faq_icone");

    botaoPergunta.addEventListener("click", () => {
        const jaEstavaAberto = item.classList.contains("kaue_faq_aberto");

        // Fecha todas as outras respostas abertas e restaura o indicador '+'
        kaueFaqItens.forEach((outroItem) => {
            outroItem.classList.remove("kaue_faq_aberto");
            const outroBotao = outroItem.querySelector(".kaue_faq_pergunta");
            const outroIcone = outroItem.querySelector(".kaue_faq_icone");
            if (outroBotao) {
                outroBotao.setAttribute("aria-expanded", "false");
            }
            if (outroIcone) {
                outroIcone.textContent = "+";
            }
        });

        // Se não estava aberto, abre o item atual e muda o indicador para '-'
        if (!jaEstavaAberto) {
            item.classList.add("kaue_faq_aberto");
            botaoPergunta.setAttribute("aria-expanded", "true");
            icone.textContent = "-";
        }
    });
});

// Filtro em tempo real das 10 perguntas enquanto o usuário digita
kaueInputBuscaFaq.addEventListener("input", () => {
    const termo = kaueInputBuscaFaq.value.trim().toLowerCase();
    let totalVisiveis = 0;

    kaueFaqItens.forEach((item) => {
        const textoPergunta = item.querySelector(".kaue_faq_texto").textContent.toLowerCase();
        const textoResposta = item.querySelector(".kaue_faq_resposta").textContent.toLowerCase();

        if (textoPergunta.includes(termo) || textoResposta.includes(termo)) {
            item.style.display = "block";
            totalVisiveis += 1;
        } else {
            item.style.display = "none";
        }
    });

    if (totalVisiveis === 0) {
        kaueFaqSemResultados.hidden = false;
    } else {
        kaueFaqSemResultados.hidden = true;
    }
});


// =========================================================================
// VALIDAÇÃO OBRIGATÓRIA DO FORMULÁRIO SEMÂNTICO DE 12 CAMPOS (SEÇÃO 10)
// Leitura por .value, .trim() e Number(), estrutura if / else if / else,
// mensagens via alert() e execução de .reset() após envio com sucesso.
// =========================================================================
const kaueFormBugBounty = document.getElementById("kaue_form_bugbounty");

kaueFormBugBounty.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Leitura dos 12 campos utilizando .value, .trim() e Number()
    const campo01Nome = document.getElementById("kaue_campo_nome").value.trim();
    const campo02Email = document.getElementById("kaue_campo_email").value.trim();
    const campo03Url = document.getElementById("kaue_campo_url").value.trim();
    const campo04Host = document.getElementById("kaue_campo_host").value.trim();

    const campo05PortaTexto = document.getElementById("kaue_campo_porta").value.trim();
    const campo05PortaNumero = Number(campo05PortaTexto);

    const campo06CvssTexto = document.getElementById("kaue_campo_cvss").value.trim();
    const campo06CvssNumero = Number(campo06CvssTexto);

    const campo07Data = document.getElementById("kaue_campo_data").value.trim();
    const campo08Owasp = document.getElementById("kaue_campo_owasp").value.trim();

    const campo09SeveridadeSelecionada = document.querySelector('input[name="kaue_radio_severidade"]:checked');
    const campo09SeveridadeValor = campo09SeveridadeSelecionada ? campo09SeveridadeSelecionada.value.trim() : "";

    const campo10ImpactosMarcados = document.querySelectorAll('input[name="kaue_check_impacto"]:checked');
    const campo11Poc = document.getElementById("kaue_campo_poc").value.trim();
    const campo12TermoAceito = document.getElementById("kaue_campo_termo").checked;

    // Estrutura de validação encadeada if / else if / else verificando todos os 12 campos
    if (campo01Nome.length < 3) {
        alert("Erro no Campo 01 (Nome/Handle): Informe um nome ou identificador com pelo menos 3 caracteres.");
    } else if (campo02Email === "" || !campo02Email.includes("@") || !campo02Email.includes(".")) {
        alert("Erro no Campo 02 (E-mail): Informe um endereço de e-mail corporativo válido contendo '@' e domínio.");
    } else if (
        campo03Url === "" ||
        (!campo03Url.startsWith("http://") && !campo03Url.startsWith("https://"))
    ) {
        alert("Erro no Campo 03 (URL Vulnerável): A URL deve iniciar obrigatoriamente com http:// ou https://.");
    } else if (campo04Host.length < 4) {
        alert("Erro no Campo 04 (IP ou Hostname): Informe um endereço IP ou hostname válido do servidor alvo.");
    } else if (
        campo05PortaTexto === "" ||
        Number.isNaN(campo05PortaNumero) ||
        !Number.isInteger(campo05PortaNumero) ||
        campo05PortaNumero < 1 ||
        campo05PortaNumero > 65535
    ) {
        alert("Erro no Campo 05 (Porta de Rede): Informe um número inteiro válido entre 1 e 65535.");
    } else if (
        campo06CvssTexto === "" ||
        Number.isNaN(campo06CvssNumero) ||
        campo06CvssNumero < 0 ||
        campo06CvssNumero > 10
    ) {
        alert("Erro no Campo 06 (Nota CVSS v3.1): Informe uma pontuação numérica válida entre 0.0 e 10.0.");
    } else if (campo07Data === "") {
        alert("Erro no Campo 07 (Data da Descoberta): Selecione a data em que a vulnerabilidade foi identificada.");
    } else if (campo08Owasp === "") {
        alert("Erro no Campo 08 (Categoria OWASP): Selecione uma categoria oficial da matriz OWASP Top 10.");
    } else if (campo09SeveridadeValor === "") {
        alert("Erro no Campo 09 (Severidade): Selecione o nível de criticidade estimado (Baixa, Média, Alta ou Crítica).");
    } else if (campo10ImpactosMarcados.length === 0) {
        alert("Erro no Campo 10 (Impacto CIA): Marque pelo menos um vetor de impacto comprovado (Confidencialidade, Integridade, Disponibilidade ou RCE).");
    } else if (campo11Poc.length < 20) {
        alert("Erro no Campo 11 (Prova de Conceito - PoC): Descreva os passos técnicos para reprodução com pelo menos 20 caracteres.");
    } else if (!campo12TermoAceito) {
        alert("Erro no Campo 12 (Safe Harbor): É obrigatório aceitar o Termo de Divulgação Responsável para submeter o relatório.");
    } else {
        const listaImpactos = Array.from(campo10ImpactosMarcados)
            .map((chk) => chk.value)
            .join(", ");

        alert(
            `[SUCESSO - PROTOCOLO SOC/BUG BOUNTY GERADO]\n\n` +
            `Pesquisador: ${campo01Nome} (${campo02Email})\n` +
            `Alvo: ${campo03Url} (${campo04Host}:${campo05PortaNumero})\n` +
            `Classificação: ${campo08Owasp} | Severidade: ${campo09SeveridadeValor} (CVSS ${campo06CvssNumero.toFixed(1)})\n` +
            `Data da Descoberta: ${campo07Data}\n` +
            `Impacto CIA: ${listaImpactos}\n\n` +
            `Seu relatório técnico foi encaminhado à equipe de resposta a incidentes (CSIRT).`
        );

        kaueFormBugBounty.reset();
    }
});