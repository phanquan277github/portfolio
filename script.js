// Matrix effect
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41'; // Neon green
    ctx.font = fontSize + 'px "Fira Code", monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Load data from me.json dynamically
document.addEventListener("DOMContentLoaded", () => {
    fetch('me.json')
        .then(response => response.json())
        .then(data => {
            renderHero(data.hero, data.about);
            renderSkills(data.skills);
            renderProjects(data.projects);
            renderContact(data.contact);
        })
        .catch(error => console.error("Error loading me.json data:", error));
});

function renderHero(heroConfig, aboutConfig) {
    const nameEl = document.getElementById('hero-name');
    if (nameEl) {
        nameEl.textContent = heroConfig.name;
        nameEl.setAttribute('data-text', heroConfig.name);
    }
    
    // Setup typing effect for role & tagline
    const subtitleElement = document.getElementById('hero-role');
    if(subtitleElement) {
        const fullRole = heroConfig.role + " | " + heroConfig.tagline;
        subtitleElement.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < fullRole.length) {
                subtitleElement.textContent += fullRole.charAt(i);
                i++;
                setTimeout(typeWriter, 30); // Speed of typing
            }
        };
        setTimeout(typeWriter, 500);
    }
    
    const descEl = document.getElementById('hero-intro');
    if (descEl) descEl.textContent = aboutConfig.description;
}

function renderSkills(skillsConfig) {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;
    
    const iconMap = {
        'networking': '<i class="fa-solid fa-network-wired"></i>',
        'security': '<i class="fa-solid fa-shield-halved"></i>',
        'cloud': '<i class="fa-brands fa-aws"></i>',
        'tools': '<i class="fa-solid fa-toolbox"></i>'
    };
    
    let html = '';
    for (const [key, items] of Object.entries(skillsConfig)) {
        html += `
        <div class="skill-card">
            <div class="skill-icon">
                ${iconMap[key.toLowerCase()] || '<i class="fa-solid fa-code"></i>'}
            </div>
            <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <p>${items.join(', ')}</p>
        </div>`;
    }
    skillsGrid.innerHTML = html;
}

function renderProjects(projectsConfig) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    let html = '';
    projectsConfig.forEach(proj => {
        const techList = proj.technologies.map(t => `<li>${t}</li>`).join('');
        
        html += `
        <div class="project-card">
            <div class="project-content">
                <p class="project-category">Project</p>
                <h3 class="project-title">${proj.name}</h3>
                <div class="project-desc" style="margin-bottom: 20px;">
                    <p style="margin-bottom: 8px;"><strong>Problem:</strong> ${proj.problem}</p>
                    <p style="margin-bottom: 8px;"><strong>What I did:</strong> ${proj.description}</p>
                    <p><strong>Result:</strong> ${proj.result}</p>
                </div>
                <ul class="project-tech-list" style="margin-bottom: 25px;">
                    ${techList}
                </ul>
                <a href="${proj.github}" target="_blank" class="btn btn-outline" style="padding: 6px 12px; font-size: 13px;"><i class="fa-brands fa-github"></i> Source Code</a>
            </div>
        </div>`;
    });
    projectsGrid.innerHTML = html;
}

function renderContact(contactConfig) {
    const emailLink = document.getElementById('contact-email');
    const githubLink = document.getElementById('contact-github');
    const linkedinLink = document.getElementById('contact-linkedin');
    const phoneLink = document.getElementById('contact-phone');

    if (emailLink) emailLink.href = 'mailto:' + contactConfig.email;
    if (githubLink) githubLink.href = contactConfig.github;
    if (linkedinLink) linkedinLink.href = contactConfig.linkedin;
    
    if (contactConfig.phone && contactConfig.phone.trim() !== '') {
        if (phoneLink) {
            phoneLink.href = 'tel:' + contactConfig.phone;
            phoneLink.style.display = 'flex';
        }
    } else if (phoneLink) {
        phoneLink.style.display = 'none';
    }
}

// Form submission handler (prevent default for demo purposes)
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang truyền dữ liệu...';
        btn.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã Gửi Thành Công';
            form.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
            }, 3000);
        }, 1500);
    });
}
