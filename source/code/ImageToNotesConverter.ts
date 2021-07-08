import Jimp from 'jimp';

export class ImageToNotesConverter {
    protected image = new Image(100, 100);
    protected canvas: HTMLCanvasElement;
    protected svg = '';

    constructor() {
        this.canvas = document.getElementById('imagePreview') as HTMLCanvasElement;
        const context = this.canvas.getContext('2d');

        this.image.onload = () => {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            context.imageSmoothingEnabled = true;
            context.drawImage(this.image, 0, 0)
        }

        this.addLoadImageButton();
        this.addDownloadButton();
    }

    loadImage(path: string): void {
        Jimp.read(path).then((img) => {
            img.cover(this.canvas.clientWidth, this.canvas.clientHeight,
                undefined, Jimp.RESIZE_BICUBIC);
            img.getBase64(Jimp.MIME_PNG, (err, src) => {
                this.image.src = src;
            })
        })
    }

    generateSvg(): void {
        this.svg = '<svg></svg>';
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
        this.addActionButton('download svg', () => console.log('not implemented yet :('))
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