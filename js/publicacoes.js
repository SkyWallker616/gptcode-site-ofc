document.addEventListener('DOMContentLoaded', function() {
    // Filtragem de publicações
    const filters = document.querySelectorAll('.btn-filter');
    const publicationItems = document.querySelectorAll('.publication-item');
    const searchInput = document.getElementById('searchInput');
    
    // Função para filtrar publicações
    function filterPublications() {
        const activeFilter = document.querySelector('.btn-filter.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();
        
        publicationItems.forEach(item => {
            const category = item.dataset.category;
            const title = item.querySelector('h4').textContent.toLowerCase();
            const authors = item.querySelector('.authors').textContent.toLowerCase();
            const abstract = item.querySelector('.publication-abstract p').textContent.toLowerCase();
            
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = searchTerm === '' || 
                                title.includes(searchTerm) || 
                                authors.includes(searchTerm) || 
                                abstract.includes(searchTerm);
            
            if (matchesFilter && matchesSearch) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('reveal-active');
                }, 50);
            } else {
                item.classList.remove('reveal-active');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
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
    
    // Animação de revelação
    const publicationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1 });
    
    publicationItems.forEach(item => {
        item.classList.add('reveal');
        publicationObserver.observe(item);
    });
    
    // Ordenação por ano
    const sortByYear = document.createElement('button');
    sortByYear.className = 'btn btn-outline-secondary btn-sm ms-2';
    sortByYear.innerHTML = '<i class="bi bi-sort-down"></i> Ordenar por Ano';
    let ascending = true;
    
    sortByYear.addEventListener('click', function