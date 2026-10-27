(() => {
  const tag = 'floating-collection-button';
  if (customElements.get(tag)) return;
  class FloatingCollectionButton extends HTMLElement {
    connectedCallback() {
      this.control = this.querySelector('.collection-button');
      this.layer = this.querySelector('.collection-button__particles');
      if (!this.control || !this.layer) return;
      this.abort?.abort();
      this.abort = new AbortController();
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.frame = 0;
      this.last = performance.now();
      this.particles ??= [];
      if (!this.particles.length && !this.control.disabled) this.populate();
      const options = { signal: this.abort.signal };
      ['pointerenter', 'pointerleave', 'pointerdown', 'pointerup', 'pointercancel', 'focus', 'blur', 'keydown', 'keyup'].forEach(event => {
        this.control.addEventListener(event, () => this.update(), options);
      });
      this.reduced.addEventListener('change', () => this.update(), options);
      this.update();
    }
    disconnectedCallback() {
      this.abort?.abort();
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
    populate() {
      const width = this.control.clientWidth - 5;
      const height = this.control.clientHeight - 5;
      this.particles = Array.from({ length: 4 + Math.floor(Math.random() * 5) }, () => {
        const dot = document.createElement('span');
        dot.className = 'collection-button__dot';
        const x = 1 + Math.random() * Math.max(0, width - 2);
        const y = 1 + Math.random() * Math.max(0, height - 2);
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.8 + Math.random() * 2.2;
        dot.style.transform = `translate(${x}px,${y}px)`;
        this.layer.append(dot);
        return { dot, x, y, angle, speed, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, next: 0 };
      });
    }
    update() {
      const pressed = this.control.matches(':active');
      this.active = !this.control.disabled && (pressed || (this.control.matches(':hover') && !this.control.matches(':focus-visible')));
      if (this.active && !this.reduced.matches && !this.frame) {
        this.last = performance.now();
        this.frame = requestAnimationFrame(time => this.tick(time));
      } else if (!this.active || this.reduced.matches) {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
      }
    }
    tick(time) {
      this.frame = 0;
      if (!this.isConnected || !this.active || this.reduced.matches) return;
      const dt = Math.min((time - this.last) / 1000 || 0.016, 0.04);
      this.last = time;
      const maxX = Math.max(1, this.control.clientWidth - 6);
      const maxY = Math.max(1, this.control.clientHeight - 6);
      this.particles.forEach(p => {
        if (time >= p.next) {
          p.angle += (Math.random() - 0.5) * Math.PI;
          p.speed = 1.8 + Math.random() * 2.2;
          p.next = time + 1400 + Math.random() * 2400;
        }
        const smoothing = 1 - Math.exp(-dt * 0.8);
        p.vx += (Math.cos(p.angle) * p.speed - p.vx) * smoothing;
        p.vy += (Math.sin(p.angle) * p.speed - p.vy) * smoothing;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 1 || p.x > maxX) { p.x = Math.max(1, Math.min(maxX, p.x)); p.vx *= -1; p.angle = Math.atan2(p.vy, p.vx); }
        if (p.y < 1 || p.y > maxY) { p.y = Math.max(1, Math.min(maxY, p.y)); p.vy *= -1; p.angle = Math.atan2(p.vy, p.vx); }
        p.dot.style.transform = `translate(${p.x}px,${p.y}px)`;
      });
      this.frame = requestAnimationFrame(nextTime => this.tick(nextTime));
    }
  }
  customElements.define(tag, FloatingCollectionButton);
})();
