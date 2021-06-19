// Referred -> https://github.com/mdn/webaudio-examples/tree/master/audio-basics
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioElement = document.querySelector('audio');
const playButton = document.querySelector("button");

var track;
var audioCtx;

// play pause audio
playButton.addEventListener('click', function() {
    if (!audioCtx) {
        initSound();
    }

    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    playSound();

}, false);

// if track ends
audioElement.addEventListener('ended', () => {}, false);

function initSound() {
    audioCtx = new AudioContext();
    track = audioCtx.createMediaElementSource(audioElement);

    // volume
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;

    // panning
    const pannerOptions = {
        pan: 0
    };
    const panner = new StereoPannerNode(audioCtx, pannerOptions);
    panner.pan.value = 1;

    // connect our graph
    track.connect(gainNode).connect(panner).connect(audioCtx.destination);
}

function playSound() {
    audioElement.play();
}

function pauseSound() {
    audioElement.pause();
}