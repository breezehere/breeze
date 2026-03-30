document.addEventListener("DOMContentLoaded", () => {
    const modules = document.querySelectorAll('.module');
    const scatterBtn = document.getElementById('scatter-btn');
    let zIndexCounter = 10;

    function scatterModules() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const padding = vw < 600 ? 16 : 40;

        modules.forEach(mod => {
            const rect = mod.getBoundingClientRect();
            let maxX = Math.max(padding, vw - rect.width - padding);
            let maxY = Math.max(padding, vh - rect.height - padding);

            const randomX = padding + Math.random() * (maxX - padding);
            const randomY = padding + Math.random() * (maxY - padding);
            const randomRot = (Math.random() - 0.5) * 8;

            mod.style.left = `${randomX}px`;
            mod.style.top = `${randomY}px`;
            mod.dataset.rot = randomRot;
            mod.style.transform = `rotate(${randomRot}deg)`;
        });
    }

    setTimeout(scatterModules, 50);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(scatterModules, 200);
    });

    if (scatterBtn) scatterBtn.addEventListener('click', scatterModules);

    modules.forEach(mod => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const startDrag = (e) => {
            if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button') return;

            isDragging = true;
            zIndexCounter++;
            mod.style.zIndex = zIndexCounter;

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            startX = clientX;
            startY = clientY;
            initialLeft = mod.offsetLeft;
            initialTop = mod.offsetTop;

            mod.classList.add('dragging');
            mod.style.transform = `rotate(0deg) scale(1.02)`;
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            if (e.cancelable) e.preventDefault();

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            mod.style.left = `${initialLeft + (clientX - startX)}px`;
            mod.style.top = `${initialTop + (clientY - startY)}px`;
        };

        const stopDrag = () => {
            if (isDragging) {
                isDragging = false;
                mod.classList.remove('dragging');
                const newRot = (Math.random() - 0.5) * 8;
                mod.dataset.rot = newRot;
                mod.style.transform = `rotate(${newRot}deg) scale(1)`;
            }
        };

        mod.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onDrag, { passive: false });
        document.addEventListener('mouseup', stopDrag);

        mod.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    });
});