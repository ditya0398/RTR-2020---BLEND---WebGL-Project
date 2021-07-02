// Referred -> https://github.com/mdn/webaudio-examples/tree/master/audio-basics
// Demo : https://mdn.github.io/webaudio-examples/audio-basics/
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

    // 0 : mute
    gainNode.gain.value = 1; // change this value to control a volume of sound.

    // panning
    const pannerOptions = {
        // 0 : Sound in both Left and right channel.
        // -1 :  full left pan and 
        // 1 : full right pan
        pan: 0
    };
    const panner = new StereoPannerNode(audioCtx, pannerOptions);
    panner.pan.value = 0; // Change this value to -1 if you want to send sound to left channel only and to 1 if you want to send sound to left channel

    // connect our graph
    track.connect(gainNode).connect(panner).connect(audioCtx.destination);
}

function playSound() {
    audioElement.play();
}

function pauseSound() {
    audioElement.pause();
}
