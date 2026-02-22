document.write(`
<nav class="fixed bottom-0 inset-x-0 p-5 flex justify-around items-center bg-black/95 border-t border-white/10 z-50">
    <i data-lucide="home" class="text-sdel" size="28" onclick="location.href='index.html'"></i>
    <i data-lucide="compass" class="text-white" size="28" onclick="location.href='explore.html'"></i>
    <div class="bg-sdel h-14 w-14 rounded-2xl flex items-center justify-center -mt-12 shadow-2xl border-4 border-black active:scale-90 transition" onclick="location.href='post-story.html'">
        <i data-lucide="camera" class="text-black" size="28"></i>
    </div>
    <i data-lucide="shopping-cart" class="text-white" size="28" onclick="location.href='market.html'"></i>
    <i data-lucide="user" class="text-white" size="28" onclick="location.href='profile.html'"></i>
</nav>
`);

if (typeof lucide !== 'undefined') {
    setTimeout(() => lucide.createIcons(), 100);
}
