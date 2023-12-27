const listaDeTeclas = document.querySelectorAll('.tecla');

function tocaSom(seletorAudio) {

    const elemento = document.querySelector(seletorAudio);

    if (elemento != null && elemento.localName === 'audio') {
        elemento.play()
    }

    else {
        console.log('Elemento não encontrado ou seletor inválido.');
    }
    
}

for (let contador = 0; contador < listaDeTeclas.length; contador++) {

    const tecla = listaDeTeclas[contador];
    const instrumento = listaDeTeclas[contador].classList[1];
    const idAudio = `#som_${instrumento}`;

    tecla.onclick = function () {

        tocaSom(idAudio)

    }
    tecla.onkeydown = function (e) {

        if (e.code === 'Enter' || e.code === 'Space') {
            tecla.classList.add('ativa');
        }

    }
    tecla.onkeyup = function () {

        tecla.classList.remove('ativa');

    }
}