// cbt-nav.js - Static navigation for CBT pages
// Include this in ALL CBT pages

(function() {
    // Function to inject navigation
    function injectCB TNavigation() {
        // Don't inject if already present
        if (document.getElementById('cbt-nav-container')) return;
        
        // Create nav container
        const navContainer = document.createElement('div');
        navContainer.id = 'cbt-nav-container';
        
        // Get current page filename
        const path = window.location.pathname;
        const currentPage = path.split('/').pop() || 'cbt-index.html';
        
        // Navigation HTML with icons
        navContainer.innerHTML = `
            <!-- BOTTOM NAV - STATIC -->
            <nav class="fixed bottom-0 left-0 right-0 bg-[var(--nav-bg)] backdrop-blur-xl border-t border-[var(--border)] py-2 px-4 z-[100]">
                <div class="flex justify-around items-center">
                    <a href="cbt-index.html" class="flex flex-col items-center gap-1 nav-item ${currentPage === 'cbt-index.html' ? 'active' : ''}">
                        <i data-lucide="home" size="22" class="${currentPage === 'cbt-index.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}"></i>
                        <span class="text-[8px] font-black uppercase tracking-widest ${currentPage === 'cbt-index.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}">HOME</span>
                    </a>
                    
                    <a href="cbt-create.html" class="flex flex-col items-center gap-1 nav-item ${currentPage === 'cbt-create.html' ? 'active' : ''}">
                        <i data-lucide="plus" size="22" class="${currentPage === 'cbt-create.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}"></i>
                        <span class="text-[8px] font-black uppercase tracking-widest ${currentPage === 'cbt-create.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}">CREATE</span>
                    </a>
                    
                    <a href="cbt-join.html" class="flex flex-col items-center gap-1 nav-item ${currentPage === 'cbt-join.html' ? 'active' : ''}">
                        <i data-lucide="user-plus" size="22" class="${currentPage === 'cbt-join.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}"></i>
                        <span class="text-[8px] font-black uppercase tracking-widest ${currentPage === 'cbt-join.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}">JOIN</span>
                    </a>
                    
                    <a href="cbt-creator.html" class="flex flex-col items-center gap-1 nav-item ${currentPage === 'cbt-creator.html' ? 'active' : ''}">
                        <i data-lucide="book-open" size="22" class="${currentPage === 'cbt-creator.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}"></i>
                        <span class="text-[8px] font-black uppercase tracking-widest ${currentPage === 'cbt-creator.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}">MY TESTS</span>
                    </a>
                    
                    <a href="cbt-leaderboard.html" class="flex flex-col items-center gap-1 nav-item ${currentPage === 'cbt-leaderboard.html' ? 'active' : ''}">
                        <i data-lucide="trophy" size="22" class="${currentPage === 'cbt-leaderboard.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}"></i>
                        <span class="text-[8px] font-black uppercase tracking-widest ${currentPage === 'cbt-leaderboard.html' ? 'text-sdel' : 'text-[var(--text-dim)]'}">RANKS</span>
                    </a>
                </div>
            </nav>
        `;
        
        // Append to body
        document.body.appendChild(navContainer);
        
        // Re-run lucide for icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
    
    // Inject when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCB TNavigation);
    } else {
        injectCB TNavigation();
    }
})();
