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
        threshold: 0.15, //ele controla o disparo à partir do nível de visibilidade do elemento (nesse caso, a porcentagem de 15% dele)
        rootMargin: '0px 0px -40px 0px' //nem sabia disso, mas essa disgraça ai "antecipa" o disparo (serve para elementos baixos)
    });
    section_animados.forEach(el => elementos_na_visao.observe(el)); //registra cada elemento para ser observado tlg
});

// Novo: anima a barrinha
  const barrinha = document.querySelector('.barrinha-conhecimento');
  if (barrinha) {
    const targetConhecimento = parseInt(getComputedStyle(barrinha).getPropertyValue('--conhecimento')) || 1;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      barrinha.style.setProperty('--conhecimento', current);
      if (current >= targetConhecimento) clearInterval(interval);
    }, 150); // Ajuste o tempo para controlar a velocidade
  }