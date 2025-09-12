document.addEventListener('DOMContentLoaded', function() {
    // Filtragem dos membros
    const filters = document.querySelectorAll('.btn-filter');
    const members = document.querySelectorAll('.team-member');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove a classe active de todos os filtros
            filters.forEach(f => f.classList.remove('active'));
            // Adiciona a classe active ao filtro clicado
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            members.forEach(member => {
                const memberCategory = member.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === memberCategory) {
                    member.style.display = 'block';
                    // Pequeno delay para animação
                    setTimeout(() => {
                        member.classList.add('visible');
                    }, 50);
                } else {
                    member.classList.remove('visible');
                    // Espera a animação terminar antes de esconder
                    setTimeout(() => {
                        member.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Animação de aparecimento ao scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar todos os membros da equipe
    members.forEach(member => {
        observer.observe(member);
    });
    
    // Smooth scroll para as categorias
    document.querySelectorAll('.team-filters .btn-filter').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            if (filter !== 'all') {
                const targetSection = document.getElementById(filter);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Modal para detalhes dos membros
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('.member-name').textContent;
            const role = this.querySelector('.member-role').textContent;
            const desc = this.querySelector('.member-desc').textContent;
            const imgSrc = this.querySelector('.member-img').src;
            
            // Criar modal
            const modalHtml = `
                <div class="modal fade" id="memberModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${name}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="text-center mb-4">
                                    <img src="${imgSrc}" alt="${name}" class="img-fluid rounded-circle" style="width: 150px; height: 150px; object-fit: cover;">
                                </div>
                                <h6 class="text-accent">${role}</h6>
                                <p>${desc}</p>
                                <div class="social-links justify-content-center mt-4">
                                    <a href="#" class="social-link"><i class="bi bi-linkedin"></i></a>
                                    <a href="#" class="social-link"><i class="bi bi-envelope"></i></a>
                                    <a href="#" class="social-link"><i class="bi bi-file-person"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Adicionar modal ao DOM
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Mostrar modal
            const memberModal = new bootstrap.Modal(document.getElementById('memberModal'));
            memberModal.show();
            
            // Remover modal do DOM após fechar
            document.getElementById('memberModal').addEventListener('hidden.bs.modal', function() {
                this.remove();
            });
        });
    });
    
    // Efeito de parallax no header
    const pageHeader = document.querySelector('.page-header');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        pageHeader.style.backgroundPosition = `center ${rate}px`;
    });
    
    // Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});