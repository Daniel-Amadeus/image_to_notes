import 'bootstrap';

const addLoadImageButton = () => {
    const ui = document.getElementById('ui')

    const loadImageInput = document.createElement('input');
    loadImageInput.type = 'file';
    loadImageInput.accept = '.png';
    loadImageInput.multiple = false;
    loadImageInput.classList.add('d-none')

    const wrapper = document.createElement('div');
    wrapper.classList.add('fileInputWrapper');
    ui.appendChild(wrapper);

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
    }
}

window.addEventListener('load', () => {
    console.log('main.ts');

    addLoadImageButton();
})