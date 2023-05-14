interface Color {
    name: string;
    hex: string;
}

const pickableColors = [
    { name: 'red', hex: '#FF0000' },
    { name: 'green', hex: '#00FF00' },  
    { name: 'blue', hex: '#0000FF' },
    { name: 'yellow', hex: '#FFFF00' },
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#FFFFFF' },  
    { name: 'gray', hex: '#808080' },
    { name: 'purple', hex: '#800080' }
];

const htmlContainer = document.getElementById('html-picker');
if(!htmlContainer) throw new Error('html-container not found');
const canvasContainer = document.getElementById('canvas-picker') as HTMLCanvasElement;
if(!canvasContainer) throw new Error('canvas-container not found');


const colorDivs:HTMLDivElement[] = [];
let selectedColor: Color|null = null;
let selectedColorIndex: number|null = null;
let hoverColorIndex: number|null = null;

pickableColors.forEach((color,index) => {
    const htmlElement = document.createElement('div');
    htmlElement.style.backgroundColor = color.hex;
    htmlElement.classList.add('box');
    htmlElement.addEventListener('click', (ev) => {
        selectedColor = color;
        selectedColorIndex = index;
        renderHtmlDivs();
        renderCanvas();
    });
    htmlElement.addEventListener('mouseover', (ev) => {
        hoverColorIndex = index;
        renderHtmlDivs();
        renderCanvas();
    });
    htmlContainer.appendChild(htmlElement);
    colorDivs.push(htmlElement);
});

function renderHtmlDivs() {
    colorDivs.forEach((colorDiv,index) => {
        colorDiv.style.border = '';

        if(index === selectedColorIndex) {
            colorDiv.style.border = `3px solid white`;
        }
        else if (index === hoverColorIndex) {
            colorDiv.style.border = `3px solid gray`;
        }

    });
}
canvasContainer.width = 150;
canvasContainer.height = 150;
const maybeCtx = canvasContainer.getContext('2d');
if(!maybeCtx) throw new Error('context not found');
const ctx = maybeCtx as CanvasRenderingContext2D;
const columnsCount = canvasContainer.width / 25


canvasContainer.addEventListener('click', (ev) => {
    const x = Math.floor(ev.offsetX / 25);
    const y = Math.floor(ev.offsetY / 25);
    const index = y * columnsCount + x;
    if(index >= pickableColors.length) {
        selectedColor = null;
        selectedColorIndex = null;
        renderCanvas();
        renderHtmlDivs();
        return;
    };

    const color= pickableColors[index];
    console.log(x, y, index, color);
    selectedColor = color;
    selectedColorIndex = index;
    renderCanvas();
    renderHtmlDivs();
});

canvasContainer.addEventListener('mousemove', (ev) => {
    const x = Math.floor(ev.offsetX / 25);
    const y = Math.floor(ev.offsetY / 25);
    const index = y * columnsCount + x;
    if(index >= pickableColors.length) {
        hoverColorIndex = null;
        renderCanvas();

        renderHtmlDivs();
        return;
    };
    hoverColorIndex = index;
    renderCanvas();
    renderHtmlDivs();
});

renderCanvas();

function renderCanvas() {
    ctx.clearRect(0, 0, canvasContainer.width, canvasContainer.height);
    pickableColors.forEach((color, index) => {
        ctx.fillStyle = color.hex;
        const x = index % columnsCount;
        const y = Math.floor(index / columnsCount);
        ctx.fillRect(x * 25, y * 25, 25, 25);
        ctx.lineWidth = 3;
        if(index === selectedColorIndex) {
            ctx.strokeStyle = 'white';
            ctx.strokeRect(x * 25+ 3/2, y * 25+3/2, 25-3, 25-3);
        }
        else if (index === hoverColorIndex) {
            ctx.strokeStyle = 'gray';
            ctx.strokeRect(x * 25+ 3/2, y * 25+3/2, 25-3, 25-3);
        }
    });
}