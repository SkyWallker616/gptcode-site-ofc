document.addEventListener('DOMContentLoaded', function() {
    // Filtragem de publicações
    const filters = document.querySelectorAll('.btn-filter');
    const publicationItems = document.querySelectorAll('.publication-item');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-box .btn');
    
    // Função para filtrar publicações
    function filterPublications() {
        const activeFilter = document.querySelector('.btn-filter.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();
        let visibleCount = 0;
        
        publicationItems.forEach(item => {
            const category = item.dataset.category;
            const title = item.querySelector('h4').textContent.toLowerCase();
            const authors = item.querySelector('.authors').textContent.toLowerCase();
            const journal = item.querySelector('.journal').textContent.toLowerCase();
            
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = searchTerm === '' || 
                                title.includes(searchTerm) || 
                                authors.includes(searchTerm) || 
                                journal.includes(searchTerm);
            
            if (matchesFilter && matchesSearch) {
                item.style.display = 'block';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 + (visibleCount * 100));
                visibleCount++;
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Atualizar contador de resultados
        updateResultsCounter(visibleCount);
        
        // Atualizar paginação
        updatePagination();
    }
    
    // Função para atualizar contador de resultados
    function updateResultsCounter(count) {
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter text-muted mb-3';
            document.querySelector('.publications-list').insertBefore(counter, document.querySelector('.publication-item'));
        }
        
        const total = publicationItems.length;
        counter.textContent = `Mostrando ${count} de ${total} publicações`;
    }
    
    // Event listeners para filtros
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            filterPublications();
        });
    });
    
    // Event listener para busca
    searchInput.addEventListener('input', filterPublications);
    searchButton.addEventListener('click', filterPublications);
    
    // Enter key na busca
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterPublications();
        }
    });
    
    // Paginação funcional
    const itemsPerPage = 5;
    let currentPage = 1;
    
    function updatePagination() {
        const visibleItems = Array.from(publicationItems).filter(item => 
            item.style.display !== 'none'
        );
        
        const totalPages = Math.ceil(visibleItems.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Mostrar apenas itens da página atual
        visibleItems.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Atualizar controles de paginação
        updatePaginationControls(totalPages);
    }
    
    function updatePaginationControls(totalPages) {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        
        // Limpar paginação atual
        pagination.innerHTML = '';
        
        // Botão Anterior
        const prevItem = document.createElement('li');
        prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevItem.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>`;
        pagination.appendChild(prevItem);
        
        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(pageItem);
        }
        
        // Botão Próxima
        const nextItem = document.createElement('li');
        nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextItem.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Próxima</a>`;
        pagination.appendChild(nextItem);
        
        // Event listeners para paginação
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.dataset.page);
                if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                    currentPage = page;
                    updatePagination();
                    
                    // Scroll para o topo da lista
                    document.querySelector('.publications-list').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Ordenação por ano
    function sortPublications(ascending = true) {
        const container = document.querySelector('.publications-list');
        const items = Array.from(publicationItems);
        
        items.sort((a, b) => {
            const yearA = parseInt(a.dataset.year);
            const yearB = parseInt(b.dataset.year);
            return ascending ? yearA - yearB : yearB - yearA;
        });
        
        // Reordenar no DOM
        items.forEach(item => container.appendChild(item));
        
        // Resetar paginação
        currentPage = 1;
        filterPublications();
    }
    
    // Adicionar botão de ordenação
    const filtersContainer = document.querySelector('.publication-filters');
    if (filtersContainer) {
        const sortButton = document.createElement('button');
        sortButton.className = 'btn btn-outline-secondary btn-sm ms-2';
        sortButton.innerHTML = '<i class="bi bi-sort-down"></i> Mais Recentes';
        
        let sortAscending = false;
        sortButton.addEventListener('click', function() {
            sortAscending = !sortAscending;
            this.innerHTML = sortAscending ? 
                '<i class="bi bi-sort-up"></i> Mais Antigos' : 
                '<i class="bi bi-sort-down"></i> Mais Recentes';
            sortPublications(sortAscending);
        });
        
        filtersContainer.appendChild(sortButton);
    }
    
    // Animação inicial
    publicationItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Inicializar
    setTimeout(() => {
        filterPublications();
    }, 500);
    
    // Expandir/Recolher abstracts
    document.querySelectorAll('.publication-abstract').forEach(abstract => {
        const paragraph = abstract.querySelector('p');
        if (paragraph && paragraph.textContent.length > 200) {
            const fullText = paragraph.textContent;
            const shortText = fullText.substring(0, 200) + '...';
            
            paragraph.textContent = shortText;
            
            const toggleButton = document.createElement('button');
            toggleButton.className = 'btn btn-link btn-sm p-0 text-accent';
            toggleButton.textContent = 'Ler mais';
            
            let expanded = false;
            toggleButton.addEventListener('click', function() {
                if (expanded) {
                    paragraph.textContent = shortText;
                    this.textContent = 'Ler mais';
                } else {
                    paragraph.textContent = fullText;
                    this.textContent = 'Ler menos';
                }
                expanded = !expanded;
            });
            
            abstract.appendChild(toggleButton);
        }
    });
});