// O timer mostrado no jogo é um elemento que possui seu apontador, seu valor, um método pra deixar invisível que guarda nele mesmo o índice do timeout
const $timer ={
    el: document.getElementById('timer'),
    interval: null,
    invisible(timeout) {
        this.invisibleHandler = setTimeout(()=>{
            $timer.el.style.visibility='hidden'
        },timeout)
    },
    invisibleHandler: null
    }

const $play_btn = document.getElementById('play_btn')
const $resultText = document.getElementById('result')
const $resultDiv = document.querySelector('.result-container')
const $difficultySelect = document.getElementById('difficulty-bar')
const $volumeSlider = document.getElementById('volume-slider')
const $volumeIcon = document.getElementById('volume-icon')
const volumeClassList = [
    'fa-volume-mute',
    'fa-volume-off',
    'fa-volume-down',
    'fa-volume-up'
]

var ticSound = new Audio('./audios/tic.wav')
var niceSound = new Audio('./audios/nice.wav')
var plingSound = new Audio('./audios/pling.wav')
var tempoPerfeito = 3
var gameRunning = false;
var tempoContando = null;
var handleSoundTimers = [] // Nessa variável global guardo todos índices os timeouts dos sons, pra desalocar depois

var volume = {
    value: $volumeSlider.value,
    classeAtual: volumeClassList[$volumeSlider.value],
    ultimoVolume: $volumeSlider.value,
    set(num){   
        
        volume.ultimoVolume = volume.value;
        volume.value = num;
        volume.classeAtual = volumeClassList[num];

        $volumeSlider.value = num;
        $volumeIcon.classList.remove(volumeClassList[volume.ultimoVolume])
        $volumeIcon.classList.add(volume.classeAtual)
        console.table(volume)
        }
}


//====== VOLUME ======//

function mutaVolume(){
    volume.set(0)

    // volume.value = $volumeSlider.value;
    // $volumeSlider.value = 0;
    // changeVolume()
    console.log('mutavolume')
}

function resetaVolume(){
    volume.set(volume.ultimoVolume)
    // changeVolume();
}


function changeVolume(){
    volume.set($volumeSlider.value)
    setVolume()
}

function setVolume(){
    valor = volume.value/ (volumeClassList.length-1);
    ticSound.volume = valor
    plingSound.volume = valor
    niceSound.volume = valor
}

$volumeIcon.addEventListener('click', () =>{
   
    if (volume.value == 0){
         resetaVolume()
    }else{
        mutaVolume()
    }
    setVolume()
})    
 
$volumeSlider.addEventListener('input',changeVolume)
changeVolume()

//======== DIFICULDADE =========//

function setDifficulty(difficultyName){
    const difficultyList = {
        easy:3,
        normal:6,
        hard:9,
        veryHard:10
    }
    tempoPerfeito = difficultyList[difficultyName];
}

console.log(setDifficulty('easy'))

$difficultySelect.addEventListener('change', e =>{
    var $time = document.querySelector('.time');

    setDifficulty($difficultySelect.value);
    $time.textContent = tempoPerfeito;
})

//========= BOTAO DE JOGO ========//

$play_btn.addEventListener('mousedown',handleClick)

function handleClick(e){
    if (gameRunning){            
        stopTimer()
    } else {                  
        startTimer()
        setTimerInvisible(3000);
        handleSoundTimers = setSoundsTimers()
    }

    gameRunning = !gameRunning
}

// ======== SONS ========= //

function playSound(sound){
    sound.load()
    sound.play()
}

function setSoundsTimers(){
    
    playSound(ticSound)
    
    var tic2 = setTimeout(()=> playSound(ticSound),1000)
    var tic3 = setTimeout(()=> playSound(ticSound),2000)
    
    return [tic2, tic3]
}

function clearSounds(){
    handleSoundTimers.forEach(i =>{
        clearTimeout(i)
    })
}


// ======== TIMER ======== //
function startTimer(){
    var horaInicial = Date.now();
    
    $play_btn.textContent = "STOP"
    $timer.interval = setInterval(function(){
        let horaAtual = Date.now();
        tempoContando = formataTempo(horaAtual - horaInicial,1)
        $timer.el.textContent = tempoContando+'s'
        destacaTimerColor('red');
    }, 100)   
}

function destacaTimerColor(cor = 'red'){
    if((tempoContando*10)%10===0){
            $timer.el.style.color=cor;
        }else{
            $timer.el.style.color="#222"
        }
}

function setTimerInvisible(time){
    $timer.invisible(time)
}

function stopTimer(){
    $play_btn.textContent = "START"  
    $timer.el.style.visibility='visible'
    clearSounds();
    clearTimeout($timer.invisibleHandler)
    clearInterval($timer.interval)
    mostraResultado(tempoContando)    
}

function formataTempo(tempo,casas = 0){
    return (tempo/1000).toFixed(casas);
}

// ========= RESULTADO ========= //

function mostraResultado(tempoFinal){

    var margemDeErro = parseFloat((tempoPerfeito-tempoFinal)).toFixed(1);
    
    $resultDiv.classList.add('show');

    document.addEventListener('mousedown', apagaResultado, true);
    
    (margemDeErro == 0)? (
        $resultText.textContent = "Incrível! Você conseguiu contar exatamente "+tempoPerfeito+" segundos!",
            niceSound.play()
        ):  ((margemDeErro <= 1) && (margemDeErro >= -1))? 
                ($resultText.textContent = "Na trave! Errou por apenas "+margemDeErro+'s',
                playSound(plingSound)        
            ):  ($resultText.textContent = "Você errou por "+margemDeErro+"s. Tente denovo, é difícil mesmo",
                playSound(plingSound)) 
}
        
function apagaResultado(){
    $resultDiv.classList.remove('show');
}

