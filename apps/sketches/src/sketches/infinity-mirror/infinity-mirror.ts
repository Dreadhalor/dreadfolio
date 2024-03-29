import P5 from 'p5';
export const InfinityMirror = (p5: P5) => {
  const cubeSize = 10;
  const cubeGap = 30;
  const cubeTotalSize = cubeSize * cubeGap;
  const cubeMiddle = cubeTotalSize / 2;
  let offset = 0;
  let plus = 0;
  let counter = 0;
  const zColor: [number, number, number][] = [];

  // Setup function
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.frameRate(30);
    p5.smooth();
    p5.pixelDensity(2);
    p5.colorMode(p5.HSB, 360, 100, 100, 1);

    // Pre-calculate Z-axis colors
    for (let z = 0; z < cubeSize; z++) {
      zColor[z] = [70, 50, easeInCirc((z + 1) / cubeSize, 0, 1, 1) * 100];
    }
  };

  // Draw function
  p5.draw = () => {
    p5.background(70, 10, 5);

    offset = cubeGap * 2 * counter;
    plus = p5.map(p5.sin(p5.PI * counter), -1, 1, 0, 1);

    // Center camera
    p5.translate(
      cubeMiddle * -2 + offset,
      cubeMiddle * -2 + cubeGap * 0.5 + offset / 2,
      400,
    );

    // Build matrix
    for (let x = 0; x < cubeSize * 2; x++) {
      for (let y = 0; y < cubeSize * 2; y++) {
        for (let z = 0; z < cubeSize; z++) {
          // Style
          const [h, s, b] = zColor[z]!;
          p5.stroke(h, s, b * plus + 35);
          p5.strokeWeight(p5.map(z, 0, cubeSize, 4, 26));
          // Position
          p5.push();
          p5.translate(x * cubeGap, y * cubeGap, z * cubeGap);
          p5.point(0, 0, 0);
          p5.pop();
        }
      }
    }

    // Counter
    counter += 0.01;
    if (counter >= 1) {
      counter = 0;
    }
  };

  function easeInCirc(t: number, b: number, c: number, d: number) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  }
};
