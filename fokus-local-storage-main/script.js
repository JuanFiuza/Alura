const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const IniciarOuPausarImg = document.querySelector('.app__card-primary-butto-icon')
var tempoNaTela = document.querySelector('#timer')

const musica = new Audio('./sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('./sons/play.wav');
const audioPausa = new Audio('./sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3');

const tempoCurto = () => {
    tempoDecorridoEmSegundos = 300
}
const tempoLongo = () => {
    tempoDecorridoEmSegundos = 900
}
const tempoFoco = () => {
    tempoDecorridoEmSegundos = 1500
}

let tempoDecorridoEmSegundos = 1500
let intervaloId = null
/* musica do checkbox que fica em loop e pausa
e da play no mesmo botão*/
musica.loop = true
// controle de ligar e desligar som com o change
musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});
// evento de cada botão programado
focoBt.addEventListener('click', () => {
    tempoFoco();
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoCurto();
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoLongo();
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});
// alterar o texto e a imagem da tela
function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
        default:
            break;
    }
}
// contador
const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        zerar();
        // audioTempoFinalizado.play();
        // alert('Tempo finalizado!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        const curtoAtivo = html.getAttribute('data-contexto') == 'descanso-curto';
        const longoAtivo = html.getAttribute('data-contexto') == 'descanso-longo';

        if (focoAtivo) {
            const evento = new CustomEvent('focoFinalizado');
            document.dispatchEvent(evento)
            tempoFoco();
        }
        if (curtoAtivo) {
            tempoCurto();
        }
        if (longoAtivo) {
            tempoLongo();
        }
        mostrarTempo();
        return
    }
    tempoDecorridoEmSegundos -= 1
    console.log(`tempo restante: ${tempoDecorridoEmSegundos}`)
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        audioPausa.play()
        zerar()
        return
    }
    audioPlay.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = "Pausar"
    IniciarOuPausarImg.setAttribute('src', './imagens/pause.png')
}

function zerar() {
    clearInterval(intervaloId)
    iniciarOuPausarBt.textContent = "Começar"
    IniciarOuPausarImg.setAttribute('src', './imagens/play_arrow.png')
    intervaloId = null
}
// converter em segundos para minutos no formato 00:00
function mostrarTempo() {
    var tempo = new Date(tempoDecorridoEmSegundos * 1000);
    var tempoFormatado = tempo.toLocaleTimeString('pt-br', { minute: '2-digit', second: '2-digit' });
    tempoNaTela.innerHTML = `${tempoFormatado}`
}
mostrarTempo()