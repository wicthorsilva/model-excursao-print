const parametros = [
    "nameloja", "vendedor", "numberPedido", "image", "excursao", "corSetor", "contatos", "localizacao",
    "observacao", "destinatario", "contatosDest", "localizacaoDest", "observacaoDest"
];

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    parametros.forEach(param => {
        const element = document.getElementById(param);
        if (element) {
            if (param === "image") {
                const img = new Image();
                img.onload = function () {
                    element.src = params.get(param) || "";
                    // Uma vez carregada a imagem, chamamos a função de gerar o PDF
                    document.getElementById("imprimirBtn").disabled = false; // Ativa o botão para gerar PDF
                };
                img.src = params.get(param) || "";
            } else {
                element.textContent = params.get(param) || "";
            }
        }
    });
});


function obterValorInput(id) {
    return document.getElementById(id).value;
}

document.getElementById("formulario").addEventListener("submit", function (event) {
    const valores = parametros.reduce((acc, param) => {
        const elemento = document.getElementById(param + "Input") || document.getElementById(param + "Select");
        acc[param] = elemento ? elemento.value : "";
        return acc;
    }, {});

    // Criar um objeto URLSearchParams
    const searchParams = new URLSearchParams(valores);

    // Redirecionar para a página modelPrint.html com os parâmetros
    window.location.href = `src/modelPrint/modelPrint.html?${searchParams.toString()}`;

    // Evitar o comportamento padrão de envio do formulário
    event.preventDefault();
});

document.getElementById('corSetorSelect').addEventListener('change', function () {
    const corEscolhida = this.value;
    const nameExcursao = document.getElementById('nameExcursao');

    // Aplica a cor de fundo de acordo com a escolha do usuário
    if (corEscolhida) {
        nameExcursao.style.backgroundColor = corEscolhida;
    } else {
        nameExcursao.style.backgroundColor = ''; // Remove a cor se não houver seleção
    }
});


function gerarPDF() {
    const element = document.getElementById("documento");

    // Garantir que as imagens estejam carregadas
    const images = element.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = reject;
            }
        });
    });

    Promise.all(imagePromises).then(() => {
        html2pdf(element, {
            margin: 10,
            filename: `${document.getElementById("destinatario").textContent + " " + "Excursao" || "excursao"}.pdf`,
            html2canvas: {
                scale: 2,
                scrollX: 0,
                scrollY: 0,
                useCORS: true, 
                allowTaint: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        }).then((pdf) => {
            const blob = pdf.output('blob');
            const blobURL = URL.createObjectURL(blob);
            const newWindow = window.open(blobURL, '_blank');
            newWindow.addEventListener('beforeunload', () => URL.revokeObjectURL(blobURL));
        });
    }).catch((err) => {
        console.error("Erro ao carregar imagens:", err);
    });
}

function imprimirDocumento() {
    gerarPDF();
}
