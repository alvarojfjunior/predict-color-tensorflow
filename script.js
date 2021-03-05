//CAPTUDA ELEMENTOS DA DOM.
const button = document.querySelector('button');
const output = document.querySelector('output');
const currentColor = document.querySelector('.current-color');
const redValue = document.querySelector('#red-value');
const greenValue = document.querySelector('#green-value');
const blueValue = document.querySelector('#blue-value');
document.querySelector('#red').addEventListener('input', (event) => {
    const value = event.target.value;;
    redValue.innerText = value;
    currentColor.style.setProperty('--red', value);
})
document.querySelector('#green').addEventListener('input', (event) => {
    const value = event.target.value;;
    greenValue.innerText = value;
    currentColor.style.setProperty('--green', value);
})
document.querySelector('#blue').addEventListener('input', (event) => {
    const value = event.target.value;;
    blueValue.innerText = value;
    currentColor.style.setProperty('--blue', value);
})

//CRIAÇÃO DE EVENTOS.
button.addEventListener('click', prever);

const cores = [
    {
        nome: 'Vermelho',
        valores: [[255, 160, 122], [250, 128, 114], [233, 150, 122], [240, 128, 128], [205, 92, 92], [220, 20, 60], [178, 34, 34], [255, 0, 0], [139, 0, 0], [128, 0, 0], [255, 99, 71], [255, 69, 0], [219, 112, 147]]
    },
    {
        nome: 'Verde',
        valores: [[124, 252, 0], [127, 255, 0], [50, 205, 50], [34, 139, 34], [0, 128, 0], [0, 100, 0], [173, 255, 47], [154, 205, 50], [0, 255, 127], [0, 250, 154], [144, 238, 144], [152, 251, 152], [143, 188, 143], [60, 179, 113], [32, 178, 170], [46, 139, 87], [128, 128, 0], [85, 107, 47], [107, 142, 35]]
    },
    {
        nome: 'Azul',
        valores: [[240, 248, 255], [230, 230, 250], [176, 224, 230], [173, 216, 230], [135, 206, 250], [135, 206, 235], [0, 191, 255], [176, 196, 222], [30, 144, 255], [100, 149, 237], [70, 130, 180], [95, 158, 160], [123, 104, 238], [106, 90, 205], [72, 61, 139], [65, 105, 225], [0, 0, 255], [0, 0, 205], [0, 0, 139], [0, 0, 128], [25, 25, 112], [138, 43, 226], [75, 0, 130]]
    },
    {
        nome: 'Amarelo',
        valores: [[255, 255, 204], [255, 255, 153], [255, 255, 102], [255, 255, 51], [255, 255, 0], [204, 204, 0], [153, 153, 0]]
    },
    {
        nome: 'Laranja',
        valores: [[255, 127, 80], [255, 99, 71], [255, 69, 0], [255, 165, 0], [255, 140, 0]]
    },
    {
        nome: 'Roxo',
        valores: [[230, 230, 250], [216, 191, 216], [221, 160, 221], [238, 130, 238], [218, 112, 214], [255, 0, 255], [255, 0, 255], [186, 85, 211], [147, 112, 219], [138, 43, 226], [148, 0, 211], [153, 50, 204], [139, 0, 139], [128, 0, 128], [75, 0, 130]]
    },
    {
        nome: 'Rosa',
        valores: [[255, 192, 203], [255, 182, 193], [255, 105, 180], [255, 20, 147], [219, 112, 147], [199, 21, 133]]
    },
    {
        nome: 'Cinza',
        valores: [[220, 220, 220], [211, 211, 211], [192, 192, 192], [169, 169, 169], [128, 128, 128], [105, 105, 105], [119, 136, 153], [112, 128, 144], [47, 79, 79], [0, 0, 0]]
    },
    {
        nome: 'Marrom',
        valores: [[255, 248, 220], [255, 235, 205], [255, 228, 196], [255, 222, 173], [245, 222, 179], [222, 184, 135], [210, 180, 140], [188, 143, 143], [244, 164, 96], [218, 165, 32], [205, 133, 63], [210, 105, 30], [139, 69, 19], [160, 82, 45], [165, 42, 42], [128, 0, 0]]
    }
]

//FORMATANDO ENTRADAS E SAÍDAS.
const entradas = [];
const respostas = [];
cores.forEach((cor, indice) => {
    const codigoCor = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    codigoCor[indice] = 1;
    cor.valores.forEach(corRGB => {
        entradas.push(corRGB);
        respostas.push(codigoCor);
    });
})


//PREPARANDO O MODELO
const modelo = tf.sequential();


//DEFININDO ENTRADAS E SAÍDAS PARA TREINO.
const dadosTreino = tf.tensor2d(entradas, [entradas.length, 3]);
const dadosResposta = tf.tensor2d(respostas, [respostas.length, 9]);
modelo.add(tf.layers.dense({
    inputShape: 3,
    units: 10,
    activation: 'sigmoid'
}))
modelo.add(
    tf.layers.dense({
        inputShape: 10,
        units: 9,
        activation: "softmax"
    })
);


//PREPARA PARA TRINAR MODELO
modelo.compile({
    loss: "categoricalCrossentropy",
    optimizer: tf.train.adam()
})


//CHAMA MÉTODO DE INÍCIO AO RENDERIZAR A PÁGINA.
iniciar();

//INICIANDO O ALGORÍTIMO.
async function iniciar() {
    await treinarDados();
    document.querySelector('.training').classList.add('done');
}


//FUNÇÃO DE TREINO DO MODELO.
async function treinarDados() {
    for (let i = 0; i < 15; i++) {
        const trainRes = await modelo.fit(dadosTreino, dadosResposta, { epochs: 20 });

        console.log(trainRes)
    }
}

//FUNÇÃO QUE CHUTA UMA COR.
async function prever() {
    const colorRGB = [
        parseInt(redValue.innerText, 10),
        parseInt(greenValue.innerText, 10),
        parseInt(blueValue.innerText, 10),
    ];
    const newData = tf.tensor2d(
        [colorRGB],
        [1, 3]
    )
    const predicao = modelo.predict(newData);
    mostrarResultado(predicao);
}



async function mostrarResultado(prediction) {
    const dados = await prediction.data();
    let maxProbability = Math.max(...dados);
    let predictionIndex = dados.indexOf(maxProbability);
    output.innerText = cores[predictionIndex].nome;
    output.classList.add('refresh');
    setTimeout(() => {
        output.classList.remove('refresh');
    }, 150);
}



