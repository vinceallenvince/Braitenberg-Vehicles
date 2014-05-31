var AudioMods = {}, exports = AudioMods;

(function init(g){
  try {
    AudioMods.audio_context = new (g.AudioContext || g.webkitAudioContext);
  } catch (e) {
    throw new Error('No web audio oscillator support in this browser');
  }
}(window));

AudioMods.configure = function() {
  // function to wire up mods goes here
};

AudioMods.connect = function(nodeA, nodeB) {
  nodeA.connect(nodeB);
};

// BIQUAD FILTER
function BiquadFilter(opt_options) {
  var options = opt_options || {};
  this.node = AudioMods.audio_context.createBiquadFilter();
  this.node.Q.value = options.Q || 0;
  this.node.type = options.type || 'lowpass';
}

BiquadFilter.prototype.changeFrequency = function(val) {
  this.node.frequency.value = val;
};

exports.BiquadFilter = BiquadFilter;

// DELAY
function Delay(opt_options) {
  var options = opt_options || {};
  this.node = AudioMods.audio_context.createDelay();
}

Delay.prototype.setDelay = function(val) {
  this.node.delayTime.value = val;
};

exports.Delay = Delay;



// CONVOLVER
function Convolver(opt_options) {
  var options = opt_options || {};
  this.node = AudioMods.audio_context.createConvolver();
  this.node.normalize = true;
}

Convolver.prototype.setEffect = function(type) {

  var noiseBuffer;

  // 0 - none
  // 1 - inverse
  // 2 - small
  // 3 - medium
  // 4 - large

  switch (type) {
    case 0:
      this.node.buffer = null;
      return;
    case 1:
      noiseBuffer = AudioMods.audio_context.createBuffer(2, 0.01 * AudioMods.audio_context.sampleRate,
          AudioMods.audio_context.sampleRate);
      break;

    case 2:
      noiseBuffer = AudioMods.audio_context.createBuffer(2, 1 * AudioMods.audio_context.sampleRate,
          AudioMods.audio_context.sampleRate);
      break;

    case 3:
      noiseBuffer = AudioMods.audio_context.createBuffer(2, 3 * AudioMods.audio_context.sampleRate,
          AudioMods.audio_context.sampleRate);
      break;

    case 4:
      noiseBuffer = AudioMods.audio_context.createBuffer(2, 6 * AudioMods.audio_context.sampleRate,
          AudioMods.audio_context.sampleRate);
      break;
  }

  var left = noiseBuffer.getChannelData(0),
      right = noiseBuffer.getChannelData(1);

  for (var i = 0; i < noiseBuffer.length; i++) {
    left[i] = Math.random() * 2 - 1;
    right[i] = Math.random() * 2 - 1;
  }

  this.node.buffer = noiseBuffer;
};

exports.Convolver = Convolver;

// GAIN
function Gain(opt_options) {
  var options = opt_options || {};
  this.node = AudioMods.audio_context.createGainNode();
  this.node.gain.value = options.gain === 'undefined' ? 0.1 : options.gain;
}

Gain.prototype.changeGain = function(val) {
  this.node.gain.value = val;
};

exports.Gain = Gain;

// OSCILLATOR
function Oscillator(opt_options) {
  var options = opt_options || {};
  this.isPlaying = false;
}

Oscillator.prototype.play = function() {
  this.osc = AudioMods.audio_context.createOscillator();
  this.osc.type = 'sine';
  this.osc.frequency.value = 400;
  this.osc.start(0);
}

Oscillator.prototype.stop = function() {
  this.osc.stop(0);
}

Oscillator.prototype.toggle = function() {
  (this.isPlaying ? this.stop() : this.play());
  this.isPlaying = !this.isPlaying;
};

Oscillator.prototype.changeFrequency = function(val) {
  this.osc.frequency.value = val;
};

exports.Oscillator = Oscillator;
