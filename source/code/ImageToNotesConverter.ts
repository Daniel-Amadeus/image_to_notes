import Jimp from 'jimp';

export class ImageToNotesConverter {
    protected _image = new Image(100, 100);
    protected _canvas: HTMLCanvasElement;
    protected _svg = '';

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
        this._svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg>
    <rect width="100%" height="100%" fill="white" />
</svg>`;
        const svgPreview = document.getElementById('svgPreview');
        svgPreview.innerHTML = this._svg;
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
            console.log('not implemented yet :(');
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