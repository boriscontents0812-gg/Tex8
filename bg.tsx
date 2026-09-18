import React from 'react';
import { createRoot } from 'react-dom/client';
import ShapeWaves from './ShapeWaves';
import ScrambledText from './ScrambledText';
import WakeSlider from './WakeSlider';

const bgContainer = document.getElementById('shapeWavesBg');
if (bgContainer) {
  const root = createRoot(bgContainer);
  root.render(
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <ShapeWaves
        text=""
        fontFamily='Geist, "Geist Sans", system-ui, sans-serif'
        fontWeight={500}
        textSize={0.6}
        shapes="mixed"
        cellSize={11}
        dotSize={0.75}
        color="#484848"
        hoverColor="#ffffff"
        backgroundColor="#050505"
        speed={0.85}
        scale={1.1}
        contrast={1}
        brightness={0.42}
        flow={0}
        direction={0}
        fade={0.15}
        interactive={true}
        splashRadius={45}
        splashStrength={0.45}
        glow={0.35}
        intro={true}
        introDuration={1.6}
        paused={false}
        onError={(err) => {
          console.warn('ShapeWaves WebGPU fallback:', err);
          bgContainer.style.background = 'radial-gradient(ellipse at center, #111111 0%, #050505 100%)';
        }}
      />
    </div>
  );
}

const usernameContainer = document.getElementById('scrambledUsername');
if (usernameContainer) {
  const root = createRoot(usernameContainer);
  root.render(
    <ScrambledText
      className="scrambled-text-mONSEY"
      radius={100}
      duration={1.4}
      speed={0.6}
      scrambleChars=".:"
    >
      mONSEY
    </ScrambledText>
  );
}

const VolumeControl: React.FC = () => {
  const [volume, setVolume] = React.useState<number>(() => {
    const audio = document.getElementById('bgAudio') as HTMLAudioElement | null;
    if (audio) {
      return Math.round(audio.volume * 100);
    }
    return 80;
  });

  React.useEffect(() => {
    const audio = document.getElementById('bgAudio') as HTMLAudioElement | null;
    if (!audio) return;

    const handleVolumeChange = () => {
      if (audio.muted) {
        setVolume(0);
      } else {
        setVolume(Math.round(audio.volume * 100));
      }
    };

    audio.addEventListener('volumechange', handleVolumeChange);
    return () => audio.removeEventListener('volumechange', handleVolumeChange);
  }, []);

  const handleChange = React.useCallback((val: number) => {
    setVolume(val);
    const audio = document.getElementById('bgAudio') as HTMLAudioElement | null;
    if (audio) {
      audio.volume = val / 100;
      if (val > 0 && audio.muted) {
        audio.muted = false;
      } else if (val === 0 && !audio.muted) {
        audio.muted = true;
      }
    }
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <WakeSlider
        value={volume}
        defaultValue={80}
        min={0}
        max={100}
        step={1}
        bars={24}
        height={32}
        restHeight={8}
        gap={3}
        fillColor="#7C3AED"
        crestColor="#c084fc"
        trackColor="rgba(255, 255, 255, 0.14)"
        sensitivity={1}
        reach={6}
        skew={0.6}
        glide={0.3}
        smoothing={100}
        showValue
        formatValue={(v) => `${Math.round(v)}%`}
        ariaLabel="Volume Controller"
        onChange={handleChange}
      />
    </div>
  );
};

const volumeContainer = document.getElementById('wakeSliderMount');
if (volumeContainer) {
  const root = createRoot(volumeContainer);
  root.render(<VolumeControl />);
}
