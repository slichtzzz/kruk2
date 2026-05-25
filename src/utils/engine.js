import * as Tone from 'tone';

const lowpass = new Tone.Filter({
  frequency: 2500, 
  type: "lowpass"
}).toDestination();
 
export const globalSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: "triangle" // Стабильный ровный тон без вибрации
  },
  envelope: {
    attack: 0.1,   // Плавный вход (имитация вдоха)
    decay: 0.1,
    sustain: 1.0,  // Ровная громкость на протяжении всей ноты
    release: 0.5   // Мягкое затухание
  },
  volume: -10      // Безопасный уровень громкости
}).connect(lowpass);

export const playMelodyGlobal = async (melody, PITCH_MAP, DURATION_MAP) => {
  if (!melody) return;
  await Tone.start();
  globalSynth.releaseAll();
  const now = Tone.now();
  const bpm = 120;
  const secondsPerBeat = 60 / bpm;
  const tokens = melody.replace(/\s/g, '').match(/.{1,2}/g) || [];
  
  let timeOffset = 0;

  tokens.forEach((token) => {
    const pitchChar = token[0];
    const durationChar = token[1];

    const pitch = PITCH_MAP[pitchChar];
    const durationValue = DURATION_MAP[durationChar];

    if (pitch && durationValue !== undefined) {
      const durationSeconds = Number(durationValue) * secondsPerBeat;
      globalSynth.triggerAttackRelease(
        pitch, 
        durationSeconds, 
        now + timeOffset
      );
      timeOffset += durationSeconds;
    }
  });
};
