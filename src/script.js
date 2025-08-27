const parametros = [
    "nameloja", "vendedor", "numberPedido", "image", "excursao", "corSetor", "contatos", "localizacao", "vaga",
    "observacao", "destinatario", "contatosDest", "localizacaoDest", "observacaoDest"
];

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    parametros.forEach(param => {
        const element = document.getElementById(param);
        if (element) {
            if (param === "image") {
                // Tenta carregar a imagem do sessionStorage
                const imageSrc = sessionStorage.getItem("image") || params.get(param);
                if (imageSrc) {
                    element.src = imageSrc;
                    document.getElementById("imprimirBtn").disabled = false; // Ativa botão de imprimir
                }
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
    event.preventDefault(); // Evita o envio padrão do formulário

    const valores = parametros.reduce((acc, param) => {
        const elemento = document.getElementById(param + "Input") || document.getElementById(param + "Select");
        acc[param] = elemento ? elemento.value : "";
        return acc;
    }, {});

    // Verifica se um arquivo foi selecionado
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            sessionStorage.setItem("image", e.target.result); // Armazena a imagem em base64
            redirecionarComParametros(valores);
        };
        reader.readAsDataURL(file);
    } else {
        sessionStorage.removeItem("image"); // Remove imagem do sessionStorage se nenhuma for selecionada
        redirecionarComParametros(valores);
    }
});

function redirecionarComParametros(valores) {
    const searchParams = new URLSearchParams(valores);
    window.location.href = `src/modelPrint/modelPrint.html?${searchParams.toString()}`;
}


function gerarPDF() {
    const element = document.getElementById("documento");

    // Garantir que todas as imagens estejam carregadas antes de gerar o PDF
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
            filename: `${document.getElementById("destinatario").textContent} ${document.getElementById("vendedor").textContent ? "- " + document.getElementById("vendedor").textContent : ""} - Excursao.pdf`,
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

// function imprimirDocumento() {
//     gerarPDF();
// }
