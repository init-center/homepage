interface Window {
  mozRequestAnimationFrame?: any;
  webkitRequestAnimationFrame?: any;
  msRequestAnimationFrame?: any;
}

type NullAble<T> = T | null;

const colors = [
  "#000030",
  "#4d4398",
  "#4784bf",
  "#000030",
  "#4d4398",
  "#ffffff",
];

//Utility Function
function randomIntFromRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors: string[]) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function debounce(this: any, func: (...args: unknown[]) => unknown, wait = 17) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: unknown[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

class Particle {
  x = 0;
  y = 0;
  radius = 0;
  color = "";
  radians = 0;
  velocity = 0;
  distanceFormCenter = 0;
  canvas: NullAble<HTMLCanvasElement> = null;
  ctx: NullAble<CanvasRenderingContext2D> = null;

  constructor(
    canvas: NullAble<HTMLCanvasElement>,
    x: number,
    y: number,
    radius: number,
    color: string
  ) {
    if (!canvas) return;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.001;

    this.ctx = canvas.getContext("2d");
    this.distanceFormCenter = randomIntFromRange(
      10,
      this.canvas.width / 2 + 100
    );
  }

  update() {
    if (!this.canvas) return;
    // Move points over time
    this.radians += this.velocity;

    //Circular Motion
    this.x =
      Math.cos(this.radians) * this.distanceFormCenter + this.canvas.width / 2;
    this.y =
      Math.sin(this.radians) * this.distanceFormCenter + this.canvas.height / 2;
    this.draw();
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.globalAlpha = 0.8;
    this.ctx.fill();
  }
}

class Starry {
  canvas: NullAble<HTMLCanvasElement> = null;
  ctx: NullAble<CanvasRenderingContext2D> = null;
  particles: Particle[] = [];
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext("2d");

    this.ctx = ctx;
    this.fitCanvasSize();
    window.addEventListener(
      "resize",
      debounce(this.fitCanvasSize.bind(this), 123)
    );

    // RequestAnimationFrame

    const requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    this.initParticles();
  }

  initParticles() {
    if (!this.canvas) return;
    this.particles = [];
    for (let i = 0; i < 1200; i++) {
      const radius = Math.random() + 0.5;
      this.particles.push(
        new Particle(
          this.canvas,
          this.canvas.width / 2,
          this.canvas.height / 2,
          radius,
          randomColor(colors)
        )
      );
    }
  }

  animate() {
    if (!this.canvas || !this.ctx) {
      throw new Error("Canvas or Context is not defined");
    }
    requestAnimationFrame(this.animate.bind(this));
    const g = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    g.addColorStop(0, "rgba(19,27,35,.05)");
    g.addColorStop(1, "rgba(10,20,67,.05)");
    this.ctx.fillStyle = g;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle) => {
      particle.update();
    });
  }

  fitCanvasSize() {
    if (!this.canvas) {
      throw new Error("Canvas is not defined");
    }
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
    this.initParticles();
  }
}

const startStarry = () => {
  const fragment = document.createDocumentFragment();
  const cvsWrapper = document.createElement("div");
  cvsWrapper.classList.add("cvs-wrapper");
  const canvas = document.createElement("canvas");
  canvas.id = "starry-cvs";
  canvas.innerText = "Your browser does not support canvas.";
  cvsWrapper.appendChild(canvas);
  fragment.appendChild(cvsWrapper);
  document.body.appendChild(fragment);
  const starry = new Starry(canvas);
  starry.animate();
};

const mediaQueryListDark = window.matchMedia("(prefers-color-scheme: dark)");

window.addEventListener("load", () => {
  mediaQueryListDark.matches && startStarry();
});

function handleThemeChange(mediaQueryListEvent: MediaQueryListEvent) {
  if (mediaQueryListEvent.matches) {
    // dark
    startStarry();
  } else {
    // light
    const cvsWrapper = document.querySelector(".cvs-wrapper");
    cvsWrapper && cvsWrapper.remove();
  }
}

mediaQueryListDark.addEventListener("change", handleThemeChange);
