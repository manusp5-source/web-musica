// Genera un arpegio sintetizado (WAV) para PROBAR el efecto audio-reactivo.
// Reemplázalo por tu música real: pon un mp3 en /public y actualiza site.media.heroAudio.
import { writeFileSync, mkdirSync } from "node:fs";

const sr = 44100;
const notes = [220, 261.63, 329.63, 440, 523.25, 440, 329.63, 261.63]; // La menor, sube y baja
const noteDur = 0.42;
const total = notes.length * noteDur;
const N = Math.floor(sr * total);
const samples = new Float32Array(N);

for (let i = 0; i < N; i++) {
  const t = i / sr;
  const ni = Math.floor(t / noteDur) % notes.length;
  const f = notes[ni];
  const localT = t - Math.floor(t / noteDur) * noteDur;
  const env = Math.exp(-localT * 3.2); // pluck decay → la amplitud "late" por nota
  const v =
    Math.sin(2 * Math.PI * f * t) * 0.6 +
    Math.sin(2 * Math.PI * f * 2 * t) * 0.18 +
    Math.sin(2 * Math.PI * f * 3 * t) * 0.06;
  samples[i] = v * env;
}

function writeWav(buf, sampleRate) {
  const out = Buffer.alloc(44 + buf.length * 2);
  out.write("RIFF", 0);
  out.writeUInt32LE(36 + buf.length * 2, 4);
  out.write("WAVE", 8);
  out.write("fmt ", 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20); // PCM
  out.writeUInt16LE(1, 22); // mono
  out.writeUInt32LE(sampleRate, 24);
  out.writeUInt32LE(sampleRate * 2, 28);
  out.writeUInt16LE(2, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36);
  out.writeUInt32LE(buf.length * 2, 40);
  for (let i = 0; i < buf.length; i++) {
    const s = Math.max(-1, Math.min(1, buf[i]));
    out.writeInt16LE(s * 0.85 * 32767, 44 + i * 2);
  }
  return out;
}

mkdirSync("public", { recursive: true });
writeFileSync("public/demo-tone.wav", writeWav(samples, sr));
console.log(`OK: public/demo-tone.wav (${(N / sr).toFixed(1)}s)`);