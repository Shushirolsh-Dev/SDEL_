// nav.js - Automatic bottom navigation for Sdel app
// Page mapping: dashboard.html (home), explore.html (feed), market.html (shop), fetch.html, profile.html

function initBottomNavigation() {
    // Get all bottom nav items
    const navItems = document.querySelectorAll('.nav-item-bottom');
    
    // Page detection - maps current URL to nav data-nav values
    function getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'dashboard.html';
        
        // Map your actual file names to nav data-nav attributes
        const pageMap = {
            'dashboard.html': 'home',    // Home page
            'explore.html': 'feed',      // Feed/Explore page
            'market.html': 'shop',       // Shop/Market page
            'fetch.html': 'fetch',       // Fetch page
            'profile.html': 'profile',   // Profile page
            'index.html': 'home',        // Fallback
            '': 'home'                    // Root path
        };
        
        return pageMap[page] || 'home';
    }
    
    // Highlight the active navigation item based on current page
    function highlightActiveNav() {
        const currentPage = getCurrentPageName();
        
        navItems.forEach(item => {
            const navValue = item.getAttribute('data-nav');
            if (navValue === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Convert buttons to actual links for proper navigation
    function convertToLinks() {
        const navLinks = {
            'home': 'dashboard.html',
            'feed': 'explore.html',
            'shop': 'market.html',
            'fetch': 'fetch.html',
            'profile': 'profile.html'
        };
        
        navItems.forEach(item => {
            const navValue = item.getAttribute('data-nav');
            if (navValue && navLinks[navValue]) {
                // Change from button to anchor tag while preserving content
                const link = document.createElement('a');
                link.href = navLinks[navValue];
                link.className = item.className;
                link.setAttribute('data-nav', navValue);
                link.setAttribute('id', item.id);
                
                // Copy all child elements
                while (item.firstChild) {
                    link.appendChild(item.firstChild);
                }
                
                // Replace button with link
                item.parentNode.replaceChild(link, item);
            }
        });
        
        // Re-query nav items after conversion
        return document.querySelectorAll('.nav-item-bottom');
    }
    
    // Add vibration effect when light sweep passes (for fun)
    function initLightSweepVibration() {
        const updatedNavItems = document.querySelectorAll('.nav-item-bottom');
        
        function triggerVibration(index) {
            if (updatedNavItems[index]) {
                const icon = updatedNavItems[index];
                icon.classList.add('vibrate');
                setTimeout(() => {
                    icon.classList.remove('vibrate');
                }, 250);
            }
        }
        
        const iconOrder = [0, 1, 2, 3, 4];
        
        function startSweepVibrationCycle() {
            let delay = 0;
            const stepDelay = 1400;
            iconOrder.forEach((idx, i) => {
                setTimeout(() => {
                    triggerVibration(idx);
                }, delay + i * stepDelay);
            });
        }
        
        startSweepVibrationCycle();
        setInterval(startSweepVibrationCycle, 8000);
    }
    
    // Convert buttons to links first
    const updatedNavItems = convertToLinks();
    
    // Highlight the active page
    highlightActiveNav();
    
    // Add click animation to all nav links
    updatedNavItems.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add scale animation before navigation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Initialize the light sweep vibration
    initLightSweepVibration();
    
    // Re-run highlighting after a small delay (ensures everything is loaded)
    setTimeout(highlightActiveNav, 100);
    
    // Also re-run when page is fully loaded
    window.addEventListener('load', highlightActiveNav);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBottomNavigation);
} else {
    initBottomNavigation();
}
