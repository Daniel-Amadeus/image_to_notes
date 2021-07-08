import 'bootstrap';
import Jimp from 'jimp';

const image = new Image(100, 100);
let canvas: HTMLCanvasElement;

const loadImage = (path: string) => {
    // console.log(path);
    Jimp.read(path).then((img) => {
        img.cover(canvas.clientWidth, canvas.clientHeight,
            undefined, Jimp.RESIZE_BICUBIC);
        img.getBase64(Jimp.MIME_PNG, (err, src) => {
            image.src = src;
        })
    })
}

const addLoadImageButton = () => {
    const ui = document.getElementById('ui')

    const wrapper = document.createElement('div');
    wrapper.classList.add('fileInputWrapper');
    ui.appendChild(wrapper);

    const loadImageInput = document.createElement('input');
    loadImageInput.type = 'file';
    loadImageInput.accept = '.png';
    loadImageInput.multiple = false;
    loadImageInput.classList.add('d-none')

    const button = document.createElement('input') as HTMLButtonElement;
    button.type = 'button';
    button.value = 'load image';
    button.classList.add('btn');
    button.classList.add('btn-primary');

    wrapper.appendChild(button);
    wrapper.appendChild(loadImageInput);

    button.onclick = () => loadImageInput.click();
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
            loadImage(dataUrl as string);
        }
        reader.readAsDataURL(file);
    }
}

window.addEventListener('load', () => {
    console.log('main.ts');

    canvas = document.getElementById('imagePreview') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    image.onload = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0)
    }

    addLoadImageButton();
})