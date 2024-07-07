(() => {
    function createVLineElement(value) {
        const div = document.createElement('div');
        div.className = `layout-grid-vline v-${value}`;
        div.style.left = `${value}px`;
        return div;
    }

    function createHLineElement(value) {
        const div = document.createElement('div');
        div.className = `layout-grid-hline h-${value}`;
        div.style.top = `${value}px`;
        return div;
    }

    function doIt() {
        const container = document.getElementById('layout-grid');

        for (let i = 0; i <= 1280; i += 10) {
            const vLineElement = createVLineElement(i);
            container.appendChild(vLineElement);
        }

        for (let i = 0; i <= 800; i += 10) {
            const hLineElement = createHLineElement(i);
            container.appendChild(hLineElement);
        }
    }

    setTimeout(() => doIt(), 1000);
})();
