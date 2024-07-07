(() => {
    function createVLineElement(value) {
        const div = document.createElement('div');
        div.className = `layout-grid-vline`;
        div.style.left = `${value}px`;
        return div;
    }

    function createHLineElement(value) {
        const div = document.createElement('div');
        div.className = `layout-grid-hline`;
        div.style.top = `${value}px`;
        return div;
    }

    function createVLineLabelElement(value) {
        const div = document.createElement('div');
        div.innerText = value;
        div.className = 'layout-grid-vlabel';
        div.style.left = `${value}px`;
        return div;
    }

    function createHLineLabelElement(value) {
        const div = document.createElement('div');
        div.innerText = value;
        div.className = `layout-grid-hlabel`;
        div.style.top = `${value}px`;
        return div;
    }

    function doIt() {
        const container = document.getElementById('layout-grid');

        for (let i = 0; i <= 1280; i += 10) {
            const vLineElement = createVLineElement(i);
            container.appendChild(vLineElement);

            if (i % 100 === 0) {
                const labelElement = createVLineLabelElement(i);
                container.appendChild(labelElement);
            }
        }

        for (let i = 0; i <= 720; i += 10) {
            const hLineElement = createHLineElement(i);
            container.appendChild(hLineElement);

            if (i % 100 === 0) {
                const labelElement = createHLineLabelElement(i);
                container.appendChild(labelElement);
            }
        }
    }

    setTimeout(() => doIt(), 100);
})();
