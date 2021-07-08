import Jimp from 'jimp';

export class ImageToNotesInterface {
    protected _image = new Image(100, 100);
    protected _canvas: HTMLCanvasElement;
    protected _svg = '';

    // A5 - all measurements in mm
    protected _width = 148;
    protected _height = 210;

    protected _padding = 3;

    protected _lineDistance = 2;
    protected _lineThickness = 0.25;

    protected _linesPerRow = 5;
    protected _rowDistance = 2;

    constructor() {
        this._canvas = document.getElementById('imagePreview') as HTMLCanvasElement;
        const context = this._canvas.getContext('2d');

        this._image.onload = () => {
            this._canvas.width = this._canvas.clientWidth;
            this._canvas.height = this._canvas.clientHeight;
            context.fillRect(0, 0, this._canvas.width, this._canvas.height);
            context.imageSmoothingEnabled = true;
            context.drawImage(this._image, 0, 0)
        }

        this.addLoadImageButton();
        this.addDownloadButton();
    }

    loadImage(path: string): void {
        Jimp.read(path).then((img) => {
            img.cover(this._canvas.clientWidth, this._canvas.clientHeight,
                undefined, Jimp.RESIZE_BICUBIC);
            img.getBase64(Jimp.MIME_PNG, (err, src) => {
                this._image.src = src;
            });
            this.generateSvg();
        })
    }

    generateSvg(): void {
        const svgStart = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${this._width}mm" height="${this._height}mm" viewBox="0 0 ${this._width} ${this._height}">
    <rect width="100%" height="100%" fill="white" />
`;
        const svgEnd = '</svg>';

        let lines = '';

        const rowHeight = this._lineDistance * (this._linesPerRow - 1);
        const rowGap = this._lineDistance * (this._rowDistance + 1);
        const rowStep = rowHeight + rowGap;
        const rowCount = (this._height - 2 * this._padding) / rowStep;

        console.log({ rowHeight, rowGap, rowStep });

        for (let i = 0; i < rowCount; i++) {
            const x1 = this._padding;
            const x2 = this._width - this._padding;
            const rowY = i * rowStep + this._padding;

            lines += `<line x1="${x1}" y1="${rowY}" x2="${x1}" y2="${rowY + rowHeight}" stroke="black" stroke-width="${this._lineThickness}" />`;
            lines += `<line x1="${x2}" y1="${rowY}" x2="${x2}" y2="${rowY + rowHeight}" stroke="black" stroke-width="${this._lineThickness}" />`;

            for (let l = 0; l < this._linesPerRow; l++) {
                const y = rowY + l * this._lineDistance;
                lines += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="black" stroke-width="${this._lineThickness}" />`;
            }
        }

        this._svg = svgStart + lines + svgEnd;


        const svgPreview = document.getElementById('svgPreview');
        svgPreview.innerHTML = this._svg;
        const svgElement = svgPreview.getElementsByTagName('svg')[0];
        console.log(svgElement);
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        console.log(this._svg);
    }

    addLoadImageButton(): void {
        const loadImageInput = document.createElement('input');
        loadImageInput.type = 'file';
        loadImageInput.accept = '.png';
        loadImageInput.multiple = false;
        loadImageInput.classList.add('d-none');

        const button = this.addActionButton('load image', () => loadImageInput.click());

        button.parentElement.appendChild(loadImageInput);

        loadImageInput.onchange = () => {
            button.value = Array.from(loadImageInput.files)
                .map((file) => file.name)
                .join('; ');

            const file = loadImageInput.files[0];
            // console.log(file);
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result;
                this.loadImage(dataUrl as string);
            }
            reader.readAsDataURL(file);
        }
    }

    addDownloadButton(): void {
        this.addActionButton('download svg', () => {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,'
                + encodeURIComponent(this._svg));
            element.setAttribute('download', 'notes.svg');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        });
    }

    addActionButton(text: string, onclick: () => void): HTMLButtonElement {
        const ui = document.getElementById('ui');

        const wrapper = document.createElement('div');
        ui.appendChild(wrapper);

        const button = document.createElement('input') as HTMLButtonElement;
        button.type = 'button';
        button.value = text;
        button.classList.add('btn');
        button.classList.add('btn-primary');
        button.style.width = '100%';
        button.style.overflow = 'hidden';
        button.style.textOverflow = 'ellipsis';
        button.style.margin = '5px auto';

        wrapper.appendChild(button);

        button.onclick = onclick;

        return button;
    }
}