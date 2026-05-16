document.addEventListener('DOMContentLoaded', () => {
    const section_animados = document.querySelectorAll('.fade-section');

    const elementos_na_visao = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            //vai dar true quando entra na tela, e false quando sai, ai permite saber se o elemento está na tela ou não
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible'); //deixa visível e faz o fade-in
            } else {
                entrada.target.classList.remove('visible') //faz o efeito de saída com o fade-out tirando o visible
            }
        });
    }, {
        threshold: 0.1, //ele controla o disparo à partir do nível de visibilidade do elemento (nesse caso, a porcentagem de 10% dele)
        rootMargin: '0px 0px -20px 0px' //nem sabia disso, mas essa disgraça ai "antecipa" o disparo (serve para elementos baixos)
    });
    section_animados.forEach(el => elementos_na_visao.observe(el)); //registra cada elemento para ser observado tlg
});

// =====================================================
//Agora eu vou criar um background de partículas usando canvas (aprendendo com ia)

//eu irei adicionar outro comando DOMContentLoaded para deixar separado, mesmo que eu possa colocar tudo dentro do mesmo, eu acho mais organizado

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    //configurações para mudar o comportamento das particulas

    const config = {
        count: Math.min(Math.floor(window.innerWidth / 10), 100), //quantidade de partículas, limitando a 100 para não sobrecarregar
        maxDist: 130, //distância máxima para desenhar linhas
        speed: 0.4, //velocidade das partículas
        size: {min:1, max:2.5}, //tamanho das partículas
        colors: ['#306998', '#FFD43B', '#9CA3AF'], //cores das partículas : AZUL PYTHON, AMARELO PYTHON, E O CINZAZINHO
        opacity: 0.7 //opacidade das partículas
    };

  //Respeita configuração de acessibilidade do navegador
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Redimensiona o canvas para preencher a tela e adapta ao tamanho dela.
  function resize() {

    //parte de resolução em relação ao canvas, é importante para que ele se adapte a diferentes tamanhos de tela e não dê problema em outros dispositivos bro
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //renderizando na tela aq 
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  window.addEventListener('resize', resize);
  resize();

  // Classe da Partícula
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      // Velocidade aleatória entre -speed e +speed
      this.vx = (Math.random() - 0.5) * config.speed;
      this.vy = (Math.random() - 0.5) * config.speed;
      this.size = Math.random() * (config.size.max - config.size.min) + config.size.min;
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Rebote suave nas bordas (evita que saiam da tela)
      if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = config.opacity;
      ctx.fill();
      ctx.globalAlpha = 1; // Reseta para não afetar outros desenhos
    }
  }

  // Inicialização
  function init() {
    particles = [];
    for (let i = 0; i < config.count; i++) {
      particles.push(new Particle());
    }
  }

  // Desenha linhas entre partículas próximas
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy); // Pitágoras

        if (dist < config.maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = '#306998';
          ctx.lineWidth = 0.5;
          // Opacidade inversamente proporcional à distância
          ctx.globalAlpha = (1 - dist / config.maxDist) * 0.25;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // Loop de animação
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.update();
      p.draw();
    }
    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  init();
  animate();
});
