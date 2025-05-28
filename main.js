async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load semua komponen
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('nav-component', 'components/nav.html');
    loadComponent('hero-component', 'components/hero.html');
    loadComponent('about-component', 'components/about.html');
    loadComponent('skills-component', 'components/skills.html');
    loadComponent('experience-component', 'components/experience.html');
    loadComponent('projects-component', 'components/projects.html');
    loadComponent('contact-component', 'components/contact.html');
    loadComponent('footer-component', 'components/footer.html');
});