// cbt-nav.js - STATIC NAVIGATION - LOADS ONCE
(function() {
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNav);
    } else {
        injectNav();
    }

    function injectNav() {
        // Don't inject twice
        if (document.getElementById('cbt-bottom-nav')) return;

        // Get current page
        const path = window.location.pathname;
        const current = path.split('/').pop() || 'cbt-index.html';
        
        // Navigation HTML matching your design
        const nav = document.createElement('nav');
        nav.id = 'cbt-bottom-nav';
        nav.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] glass-panel rounded-full p-2 border-white/10 flex justify-between items-center z-50';
        nav.innerHTML = `
            <a href="cbt-index.html" class="flex-1 flex flex-col items-center ${current === 'cbt-index.html' ? 'nav-active' : 'text-gray-500'}">
                <span class="text-[10px] font-black uppercase">HOME</span>
            </a>
            <a href="cbt-create.html" class="flex-1 flex flex-col items-center ${current === 'cbt-create.html' ? 'nav-active' : 'text-gray-500'}">
                <span class="text-[10px] font-black uppercase">BUILD</span>
            </a>
            <a href="cbt-join.html" class="relative flex-1 flex flex-col items-center">
                <div class="bg-white p-4 rounded-full -mt-8 shadow-[0_10px_30px_rgba(255,255,255,0.2)] active:scale-90 transition">
                    <div class="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <span class="text-white text-xl font-bold leading-none">+</span>
                    </div>
                </div>
                <span class="text-[10px] font-black uppercase ${current === 'cbt-join.html' ? 'text-orange-500' : 'text-gray-500'} -mt-1">JOIN</span>
            </a>
            <a href="cbt-creator.html" class="flex-1 flex flex-col items-center ${current === 'cbt-creator.html' ? 'nav-active' : 'text-gray-500'}">
                <span class="text-[10px] font-black uppercase">TESTS</span>
            </a>
            <a href="cbt-leaderboard.html" class="flex-1 flex flex-col items-center ${current === 'cbt-leaderboard.html' ? 'nav-active' : 'text-gray-500'}">
                <span class="text-[10px] font-black uppercase">RANKS</span>
            </a>
        `;
        
        document.body.appendChild(nav);
    }
})();
