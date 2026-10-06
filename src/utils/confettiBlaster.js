// confettiBlaster.js - Zero-dependency Party Blaster & Confetti Explosion Engine

export function triggerPartyBlasters() {
  if (typeof window === "undefined") return;


  // Create or reuse Canvas
  let canvas = document.getElementById("party-blasters-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "party-blasters-canvas";
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const onResize = () => {
    if (canvas) {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
  };
  window.addEventListener("resize", onResize);

  const colors = [
    "#FF0055", "#FF5E00", "#FFB703", "#00F5D4", "#00BBF9",
    "#7B2CBF", "#F72585", "#4CC9F0", "#10B981", "#F59E0B",
    "#EF4444", "#3B82F6", "#8B5CF6", "#EC4899", "#EAB308"
  ];

  class Particle {
    constructor(x, y, angleRad, speed, isStar = false) {
      this.x = x;
      this.y = y;
      this.vx = Math.cos(angleRad) * speed;
      this.vy = -Math.sin(angleRad) * speed;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.size = Math.random() * 8 + 6;
      this.width = this.size;
      this.height = isStar ? this.size : this.size * (Math.random() > 0.4 ? 1.6 : 0.8);
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.25;
      this.wobble = Math.random() * 10;
      this.wobbleSpeed = Math.random() * 0.1 + 0.05;
      this.friction = 0.95 + Math.random() * 0.02;
      this.gravity = 0.38 + Math.random() * 0.15;
      this.alpha = 1;
      this.decay = Math.random() * 0.007 + 0.004;
      this.isStar = isStar || Math.random() < 0.25;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.wobble += this.wobbleSpeed;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.wobble), 1);

      ctx.fillStyle = this.color;

      if (this.isStar) {
        // Draw 5-pointed celebration star
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = this.size * 0.8;
        const innerRadius = this.size * 0.4;
        let rot = (Math.PI / 2) * 3;
        let x = 0;
        let y = 0;
        const step = Math.PI / spikes;

        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = Math.cos(rot) * outerRadius;
          y = Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = Math.cos(rot) * innerRadius;
          y = Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      }
      ctx.restore();
    }
  }

  let particles = [];

  const blastCannon = (originX, originY, baseAngleDeg, spreadDeg, count, baseSpeed) => {
    for (let i = 0; i < count; i++) {
      const angle = (baseAngleDeg + (Math.random() - 0.5) * spreadDeg) * (Math.PI / 180);
      const speed = baseSpeed * (0.6 + Math.random() * 0.8);
      particles.push(new Particle(originX, originY, angle, speed));
    }
  };

  // Salvo 1 (Immediate: Left & Right party blasters simultaneously!)
  blastCannon(width * 0.05, height * 0.95, 65, 55, 140, 48); // Left cannon blasting right-up
  blastCannon(width * 0.95, height * 0.95, 115, 55, 140, 48); // Right cannon blasting left-up

  // Salvo 2 (300ms: Center burst explosion)
  setTimeout(() => {
    blastCannon(width * 0.5, height * 0.75, 90, 85, 120, 42);
    blastCannon(width * 0.2, height * 0.85, 70, 45, 70, 40);
    blastCannon(width * 0.8, height * 0.85, 110, 45, 70, 40);
  }, 320);

  // Salvo 3 (650ms: Massive second dual-cannon celebration salvo)
  setTimeout(() => {
    blastCannon(0, height * 0.9, 58, 50, 160, 52);
    blastCannon(width, height * 0.9, 122, 50, 160, 52);
  }, 680);

  // Salvo 4 (1100ms: Golden star fountain)
  setTimeout(() => {
    blastCannon(width * 0.5, height * 0.6, 90, 120, 80, 36);
  }, 1100);

  let animationFrameId;

  const render = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0 || p.y > height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  animationFrameId = requestAnimationFrame(render);
}
