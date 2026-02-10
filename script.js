const columnsContainer = document.getElementById('columns-container');
const solutionContent = document.getElementById('solution-content');

let masterData = [];

async function init() {
    try {
        const response = await fetch('erros.json');
        masterData = await response.json();
        addColumn(masterData, "Plataformas", 0);
    } catch (err) {
        console.error("Erro ao carregar JSON", err);
    }
}

function addColumn(items, title, level) {
    const allColumns = document.querySelectorAll('.column');
    allColumns.forEach((col, index) => {
        if (index >= level) {
            col.remove();
        }
    });

    const colDiv = document.createElement('div');
    colDiv.className = 'column';
    colDiv.setAttribute('data-level', level);
    colDiv.innerHTML = `
        <div class="column-header">${title}</div>
        <div class="column-options"></div>
    `;

    const optionsDiv = colDiv.querySelector('.column-options');

    items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        if (!item.children) btn.classList.add('is-final');
        btn.innerText = item.label;

        btn.onclick = () => {
            Array.from(optionsDiv.children).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (item.children) {
                addColumn(item.children, item.label, level + 1);
                clearSolution();
            } else if (item.solution) {
                const extraCols = document.querySelectorAll('.column');
                extraCols.forEach((col, index) => {
                    if (index > level) col.remove();
                });
                showSolution(item.label, item.solution);
            }
        };

        optionsDiv.appendChild(btn);
    });

    columnsContainer.appendChild(colDiv);
    
    columnsContainer.scrollTo({
        left: columnsContainer.scrollWidth,
        behavior: 'smooth'
    });
}

function showSolution(title, text) {
    solutionContent.innerHTML = `
        <div class="solution-card">
            <h2>${title}</h2>
            <div class="solution-text">${text}</div>
        </div>
    `;
}

function clearSolution() {
    solutionContent.innerHTML = `
        <div class="empty-state">
            <p>Selecione o fluxo para visualizar a solução aqui.</p>
        </div>
    `;
}

init();