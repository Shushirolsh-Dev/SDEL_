// Bottom Navigation Component
// Get current page filename
const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

// Helper function to determine active class
const getActiveClass = (pageName) => {
    return currentPage === pageName ? 'text-[#FF6600]' : 'text-zinc-500';
};

// Generate navigation HTML
const renderNavigation = () => {
    return `
        <div class="bottom-nav">
            <div class="bottom-nav-inner">
                <div class="bottom-nav-item" onclick="location.href='dashboard.html'">
                    <i data-lucide="home" size="22" class="${getActiveClass('dashboard.html')}"></i>
                </div>
                <div class="bottom-nav-item" onclick="location.href='explore.html'">
                    <i data-lucide="compass" size="22" class="${getActiveClass('explore.html')}"></i>
                </div>
                <div class="center-btn" onclick="openPostModal()">
                    <i data-lucide="plus" size="22" class="text-black" stroke-width="2.5"></i>
                </div>
                <div class="bottom-nav-item" onclick="location.href='market.html'">
                    <i data-lucide="shopping-cart" size="22" class="${getActiveClass('market.html')}"></i>
                </div>
                <div class="bottom-nav-item" onclick="location.href='profile.html'">
                    <i data-lucide="user" size="22" class="${getActiveClass('profile.html')}"></i>
                </div>
            </div>
        </div>
    `;
};

// Write to document
document.write(renderNavigation());

// Initialize Lucide icons if available
if (typeof lucide !== 'undefined') {
    setTimeout(() => lucide.createIcons(), 100);
}
