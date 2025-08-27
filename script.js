// Navegação ativa baseada no scroll
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuOverlay.classList.toggle('active');
        });
        // Optional: close menu when a link is clicked
        mobileMenuOverlay.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
            });
        });
    }
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Executar na carga inicial

    // Smooth scroll para links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Formulário de reserva
    const reservationForm = document.getElementById('reservationForm');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validar campos obrigatórios
            const requiredFields = ['firstName', 'lastName', 'email', 'specialRequests', 'date', 'eventSize', 'time'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length > 0) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Criar mensagem para WhatsApp
            const message = `*Nova Reserva - Padoca do Leco*

*Nome:* ${data.firstName} ${data.lastName}
*E-mail:* ${data.email}
*Telefone:* ${data.phone || 'Não informado'}
*Data:* ${data.date}
*Horário:* ${data.time}
*Tamanho do evento:* ${data.eventSize}
*Pedidos especiais:* ${data.specialRequests}`;

            // Codificar mensagem para URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/5521967846780?text=${encodedMessage}`;
            
            // Abrir WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Limpar formulário
            this.reset();
            
            // Mostrar confirmação
            showNotification('Reserva enviada! Redirecionando para WhatsApp...', 'success');
        });
    }

    // Função para mostrar notificações
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Animações de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.menu-item, .chef-story, .reservation-form');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Botões de encomenda com feedback visual
    const orderButtons = document.querySelectorAll('.order-btn');
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Adicionar efeito de clique
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Header com efeito de transparência no scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Lazy loading para imagens
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            }
        });
    });

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        imageObserver.observe(img);
    });

    // Validação de data no formulário
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            const minDate = new Date();
            minDate.setDate(today.getDate() + 14); // Mínimo 2 semanas
            
            if (selectedDate < minDate) {
                alert('Por favor, selecione uma data com pelo menos 2 semanas de antecedência.');
                this.value = '';
            }
        });
    }

    // Formatação automática de telefone
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1 $2');
            }
            e.target.value = value;
        });
    }

    // Menu mobile (para telas pequenas)
    const navLinksContainer = document.querySelector('.nav-links');
    if (window.innerWidth <= 768) {
        navLinksContainer.style.display = 'none';
        
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuButton.className = 'mobile-menu-btn';
        mobileMenuButton.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #000;
        `;
        
        const nav = document.querySelector('.nav');
        nav.insertBefore(mobileMenuButton, nav.firstChild);
        
        mobileMenuButton.addEventListener('click', function() {
            const isVisible = navLinksContainer.style.display !== 'none';
            navLinksContainer.style.display = isVisible ? 'none' : 'flex';
            navLinksContainer.style.flexDirection = 'column';
            navLinksContainer.style.position = 'absolute';
            navLinksContainer.style.top = '100%';
            navLinksContainer.style.left = '0';
            navLinksContainer.style.right = '0';
            navLinksContainer.style.background = 'rgba(255, 255, 255, 0.98)';
            navLinksContainer.style.padding = '1rem';
            navLinksContainer.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        });
    }
});

// Função para compartilhar no WhatsApp
function shareOnWhatsApp(text) {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5521967846780?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
}

// Função para compartilhar no Instagram
function shareOnInstagram() {
    window.open('https://instagram.com/padocadoleco', '_blank');
}

// Adicionar botão flutuante do WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const floatingWhatsApp = document.createElement('div');
    floatingWhatsApp.innerHTML = `
        <a href="https://wa.me/5521967846780" target="_blank" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #25D366;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            text-decoration: none;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <i class="fab fa-whatsapp"></i>
        </a>
    `;
    document.body.appendChild(floatingWhatsApp);
});
