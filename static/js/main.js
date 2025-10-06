document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const nav = document.getElementById('navbar');
    let lastScrollTop = 0;
    let isScrolling = false;
    
    // Função para detectar se estamos na página inicial
    const isHomePage = () => {
        return window.location.pathname === '/' || 
               window.location.pathname.includes('index.html') || 
               window.location.pathname === '/index.html';
    };
    
    // Aplicar classe inicial baseada na página
    if (!isHomePage()) {
        nav.classList.add('navbar-scrolled');
    }
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                // Se estamos na página inicial
                if (isHomePage()) {
                    if (currentScroll >= 50) {
                        nav.classList.add('navbar-scrolled');
                    } else {
                        nav.classList.remove('navbar-scrolled');
                    }
                } else {
                    // Em outras páginas, sempre manter o navbar visível
                    nav.classList.add('navbar-scrolled');
                }
                
                // Esconder/mostrar navbar baseado na direção do scroll
                if (currentScroll > lastScrollTop && currentScroll > 100) {
                    // Scrolling down
                    nav.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    nav.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
                isScrolling = false;
            });
        }
        isScrolling = true;
    });
    
    // Smooth scrolling para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Mostrar navbar antes de fazer scroll
                nav.style.transform = 'translateY(0)';
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Fechar navbar mobile após clique
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    if (navbarToggler) {
                        navbarToggler.click();
                    }
                }
            }
        });
    });
    
    // Fechar menu mobile ao clicar fora
    document.addEventListener('click', function(e) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');
        
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!nav.contains(e.target)) {
                navbarToggler.click();
            }
        }
    });
    
    // Mostrar navbar ao passar mouse no topo da tela
    document.addEventListener('mousemove', function(e) {
        if (e.clientY <= 50) {
            nav.style.transform = 'translateY(0)';
        }
    });
    
    // Animação de elementos ao scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.glass-card, .publication-card, .highlight-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Inicializar opacidade para animação
    document.querySelectorAll('.glass-card, .publication-card, .highlight-card').forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    // Executar uma vez ao carregar a página
    animateOnScroll();
    
    // Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Funcionalidade "Voltar ao topo"
    document.querySelectorAll('.back-to-top').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // A lógica de envio do formulário agora é tratada pelo backend Flask.
        // O JavaScript não precisa mais interceptar o evento de 'submit'.
        // A mensagem de sucesso é renderizada pelo Jinja2 no template.
        // Podemos manter este bloco para futuras interações de front-end, se necessário.
    }
    
    // Força o favicon dinamicamente
    (function() {
        const faviconUrl = "imagens/logos/GPTCODE-LOGO-BARRA.png";
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = "image/png";
        link.href = faviconUrl;
    })();
});