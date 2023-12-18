const parametros = [
    "excursao", "contatos", "localizacao",
    "observacao", "destinatario", "contatosDest", "localizacaoDest", "observacaoDest"
];


document.addEventListener("DOMContentLoaded", function () {
    // Obter os parâmetros da URL
    const params = new URLSearchParams(window.location.search);

    // Preencher o documento com os valores dos parâmetros
    parametros.forEach(param => {
        document.getElementById(param).textContent = params.get(param) || "";
    });
});

function obterValorInput(id) {
    return document.getElementById(id).value;
}

document.getElementById("formulario").addEventListener("submit", function (event) {
    const valores = parametros.reduce((acc, param) => {
        acc[param] = obterValorInput(param + "Input");
        return acc;
    }, {});

    // Criar um objeto URLSearchParams
    const searchParams = new URLSearchParams(valores);

    // Redirecionar para a página modelPrint.html com os parâmetros
    window.location.href = `src/modelPrint/modelPrint.html?${searchParams.toString()}`;

    // Evitar o comportamento padrão de envio do formulário
    event.preventDefault();
});


function gerarPDF(url) {
    const element = document.getElementById("documento");

    html2pdf(element, {
        margin: 10,
        filename: 'documento.pdf',
        html2canvas: { scale: 2, scrollX: 0, scrollY: 0 },  // Adicione estas opções
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).then((pdf) => {
        // Criar um blob com o conteúdo do PDF
        const blob = pdf.output('blob');

        // Criar um blob URL
        const blobURL = URL.createObjectURL(blob);

        // Abrir o blob URL em uma nova janela
        const newWindow = window.open(blobURL, '_blank');
        
        // Liberar o blob URL quando a janela for fechada
        newWindow.addEventListener('beforeunload', () => URL.revokeObjectURL(blobURL));
    });
}

function imprimirDocumento() {
    // window.print();  // Remova a chamada de impressão padrão
    const url = `${window.location.origin}/src/modelPrint/modelPrint.html?${window.location.search}`;
    gerarPDF(url);
}
