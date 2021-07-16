import Jimp from 'jimp';
import { Controls } from './uiHelper';

export class ImageToNotesInterface {
    protected _image = new Image(100, 100);
    protected _svg = '';
    protected _originalImage: Jimp;

    // A5 - all measurements in mm
    protected _width = 148;
    protected _height = 210;

    protected _padding = 3;

    protected _lineDistance = 1.5;
    protected _lineThickness = 0.25;

    protected _linesPerRow = 5;
    protected _notePlacesPerRow = (this._linesPerRow * 2) - 1;
    protected _rowDistance = 2;
    protected _clefWidth = 4;
    protected _noteDistance = 2.0;
    protected _noteWidth = 1.3;

    protected _useHalfSteps = true;

    protected _baseKeepFactor = 1.0;
    protected _halfKeepFactorWithHalfSteps = true;
    protected _keepFactor =
        this._baseKeepFactor * ((this._halfKeepFactorWithHalfSteps && this._useHalfSteps) ? 0.5 : 1.0);


    protected _clefs = [
        {
            name: 'treble',
            offsetY: -2,
            height: 8,
            path: 'M 0.21647976,7.9844326e-6 C 0.17843267,-9.7982287e-4 0.13393568,0.08987124 0.13541497,0.17089399 0.1357585,0.1955717 0.1435476,0.24562115 0.15491171,0.30847912 0.08324124,0.38265938 1.7136241e-5,0.45878869 1.7136241e-5,0.55867726 -0.00112561,0.65021607 0.05481984,0.76683922 0.18755356,0.7657175 c 0.0203731,-1.4022e-4 0.0387061,-0.002665 0.054992,-0.007011 0.0121355,0.0665316 0.0202049,0.11904182 0.0201558,0.14329887 4.2765e-4,0.0956261 -0.12521124,0.10509053 -0.13123344,0.0501266 0.0264795,-9.1139e-4 0.0475466,-0.0219435 0.0475466,-0.0479533 0,-0.0265706 -0.0219996,-0.0482337 -0.0492993,-0.0482337 -0.0150099,0 -0.0283863,0.00659 -0.03745821,0.0168958 -2.1031e-4,2.1033e-4 -4.5569e-4,4.2065e-4 -6.59e-4,6.3097e-4 -0.0020471,0.002173 -0.0037718,0.004767 -0.0054753,0.007712 -0.0055946,0.009465 -0.009226,0.0230652 -0.0094224,0.0424849 0,0.0800624 0.20243419,0.13159106 0.20243419,-0.0262901 C 0.27944998,0.87613604 0.2703155,0.82222384 0.2570086,0.75429 0.40145021,0.7020603 0.36516279,0.48760265 0.2322537,0.48659311 0.2219479,0.48669827 0.2120138,0.48789711 0.2024582,0.49032311 0.19488653,0.45388819 0.18758167,0.4185262 0.18120185,0.38603157 0.23167193,0.33645884 0.27574125,0.27228985 0.27475277,0.15402622 0.274907,0.06909851 0.24661179,9.9649664e-4 0.21647976,7.9844326e-6 Z M 0.22546029,0.08216647 c 0.0172183,-0.0016616 0.0308891,0.01432288 0.0308891,0.04950961 0.001395,0.0604323 -0.0409425,0.11320892 -0.0913565,0.16628698 -0.004824,-0.0290734 -0.007986,-0.0526294 -0.008329,-0.0666017 0.00143,-0.0944062 0.0400943,-0.14642564 0.0687964,-0.14919489 z m -0.0541155,0.31328749 c 0.006149,0.0316534 0.0127875,0.0650033 0.0194967,0.0985916 -0.0879704,0.0312958 -0.13018883,0.15391307 -0.005475,0.2087859 -0.0760171,-0.0647159 -0.0386009,-0.14132186 0.0162087,-0.15467025 0.0137831,0.0688171 0.0272436,0.13672282 0.0381242,0.19540247 -0.0147715,0.005188 -0.0320109,0.008202 -0.0521456,0.008343 -0.0503439,0 -0.15094754,-0.032039 -0.15094754,-0.15335925 0,-0.1016132 0.07043658,-0.14290627 0.13473854,-0.20309347 z m 0.0427232,0.15051288 c 0.002194,-1.3319e-4 0.004571,-7.711e-5 0.006786,0 0.0915809,0 0.12612263,0.14543713 0.0328662,0.19191815 C 0.24211786,0.6795559 0.2280473,0.61267373 0.21406799,0.54596684 Z'
        },
        {
            name: 'alto',
            offsetY: 0,
            height: 3,
            path: 'm 0.00295594,0.9717431 c 7.4e-4,0.0185 0.0137,0.0281 0.0385,0.0281 0.0126,7.4e-4 0.0274,-0.001 0.0444,-0.006 0.0166,-0.004 0.0355,-0.01 0.0562,-0.0177 0.0215,-0.007 0.0436,-0.0163 0.0666,-0.0281 0.0237,-0.0111 0.0473,-0.0237 0.071,-0.0384 0.0237,-0.0141 0.0473,-0.0296 0.071,-0.0473 0.0244,-0.017 0.0477,-0.0351 0.0695,-0.0547 0.0214,-0.0189 0.0418,-0.0396 0.0606,-0.0621 0.0185,-0.0218 0.0359,-0.0444 0.0518,-0.068 0.0226,-0.0355 0.0414,-0.068 0.0562,-0.0976 0.0155,-0.0288 0.0281,-0.0555 0.037,-0.0799 0.009,-0.0248 0.0152,-0.0488 0.0192,-0.0725 0.004,-0.0237 0.006,-0.0481 0.006,-0.0725 7.4e-4,-0.0407 -0.003,-0.0758 -0.0118,-0.10649 -0.009,-0.0314 -0.0178,-0.0566 -0.0266,-0.0754 -0.009,-0.0196 -0.0237,-0.0421 -0.0444,-0.068 -0.02,-0.0266 -0.0529,-0.0503 -0.0991,-0.071 -0.0466,-0.0214 -0.10465,-0.0329 -0.17453,-0.0340000017 -0.0396,0 -0.0769,0.007000002 -0.11241,0.0192000017 -0.0355,0.0129 -0.0673,0.0307 -0.0947,0.0532 -0.0266,0.0229 -0.0481,0.0496 -0.0636,0.0799 -0.0159,0.0307 -0.023699997,0.0636 -0.023699997,0.0991 0,0.0237 0.001999997,0.0459 0.006999997,0.0666 0.006,0.0207 0.0141,0.0388 0.0251,0.0547 0.0118,0.0155 0.0251,0.0281 0.0399,0.037 0.0155,0.009 0.0333,0.0133 0.0532,0.0133 0.0373,0 0.0643,-0.01 0.0813,-0.0281 0.0177,-0.0188 0.0296,-0.0366 0.0355,-0.0532 0.007,-0.0159 0.0103,-0.0336 0.0103,-0.0533 0,-0.0126 -0.003,-0.0251 -0.007,-0.037 -0.005,-0.0126 -0.0118,-0.024 -0.0207,-0.034 -0.008,-0.01 -0.0177,-0.017 -0.0296,-0.0222 -0.0111,-0.006 -0.0229,-0.009 -0.0355,-0.0103 -0.0129,0.001 -0.0248,0.004 -0.0355,0.007 -0.0111,0.004 -0.0203,0.009 -0.0281,0.0133 -0.007,0.005 -0.0126,0.01 -0.0163,0.0133 -0.004,0.004 -0.006,0.006 -0.004,0.006 -0.006,0 -0.009,-0.007 -0.007,-0.0207 0,-0.0196 0.005,-0.0392 0.0163,-0.0592 0.0118,-0.0207 0.0274,-0.0388 0.0473,-0.0547 0.0196,-0.0155 0.0414,-0.0281 0.0651,-0.037 0.0244,-0.01 0.0492,-0.0148 0.0739,-0.0148 0.0344,0 0.0654,0.007 0.0932,0.0207 0.0274,0.014 0.051,0.0333 0.071,0.0577 0.0196,0.0237 0.0344,0.0518 0.0444,0.0843 0.0107,0.0318 0.0163,0.0691 0.0163,0.11241 0,0.0433 -0.007,0.0895 -0.0207,0.13903 -0.0129,0.0492 -0.0322,0.098 -0.0577,0.14642 -0.0248,0.0481 -0.0547,0.095 -0.0902,0.14051 -0.0355,0.0451 -0.0754,0.0876 -0.11981,0.1272 -0.0473,0.0422 -0.11536,0.0773 -0.20411,0.10502 z m 0.74989,-0.81644 c 0,0.0177 0.005,0.0322 0.0163,0.0429 0.0118,0.0111 0.0266,0.017 0.0444,0.0178 0.0166,-7.4e-4 0.0303,-0.007 0.0414,-0.0178 0.0118,-0.0107 0.0181,-0.0251 0.0192,-0.0429 -0.001,-0.0166 -0.007,-0.0303 -0.0192,-0.0414 -0.0111,-0.0118 -0.0248,-0.0181 -0.0414,-0.0192 -0.0178,0.001 -0.0325,0.007 -0.0444,0.0192 -0.0111,0.0111 -0.0163,0.0248 -0.0163,0.0414 z m 0,0.30024 c 0,0.0178 0.005,0.0318 0.0163,0.0429 0.0118,0.0107 0.0266,0.0166 0.0444,0.0178 0.0166,-0.001 0.0303,-0.007 0.0414,-0.0178 0.0118,-0.0111 0.0181,-0.0251 0.0192,-0.0429 -0.001,-0.017 -0.007,-0.0311 -0.0192,-0.0429 -0.0111,-0.0111 -0.0248,-0.0163 -0.0414,-0.0163 -0.0178,0 -0.0325,0.005 -0.0444,0.0163 -0.0111,0.0118 -0.0163,0.0259 -0.0163,0.0429 z m 0,0'
        }
    ]
    protected _selectedClefIndex = 1;
    protected _quarterNotePath = 'M -0.2273939,0.5 C -0.1275284,0.5 -0.0277007,0.4810893 0.0733376,0.443646 0.1767211,0.40582451 0.2718581,0.35552194 0.3599592,0.2934947 0.4468877,0.22995461 0.5173609,0.15960666 0.5714169,0.08207262 0.6242625,0.00340393 0.652482,-0.0790469 0.656,-0.16679274 0.6524745,-0.26664145 0.6101905,-0.34644478 0.5291254,-0.40620272 0.4504057,-0.46482602 0.3470599,-0.49659607 0.2190126,-0.5 c -0.1010382,0.003517 -0.2020386,0.0226929 -0.3054221,0.0612708 -0.1010382,0.0340393 -0.1950026,0.0832073 -0.281931,0.14561271 -0.0845831,0.0635401 -0.15388373,0.13502269 -0.20676707,0.21596067 C -0.62916358,0.00151286 -0.655,0.08245083 -0.655,0.16717095 c 0,0.056354 0.009457,0.1043873 0.0283709,0.14561271 0.0211836,0.0400908 0.0516729,0.0752647 0.0892737,0.10325265 0.0399462,0.026475 0.0857558,0.0480333 0.13625594,0.0612708 C -0.34821609,0.4924357 -0.2906799,0.5 -0.2272426,0.5 Z m 0,0';
    protected _wholeNotePath = 'm 0.14260194,-0.5 c -0.09731634,0 -0.19240856,0.0201938 -0.28520413,0.0585938 -0.0939158,0.0362 -0.17977269,0.0886469 -0.2578558,0.15429687 -0.0758127,0.0634 -0.13640353,0.13534688 -0.18167113,0.21679688 -0.0453076,0.0781 -0.0683709,0.15878438 -0.0683709,0.24023438 0,0.0543 0.0117051,0.101035 0.0332087,0.140625 0.023804,0.0419 0.0567189,0.0763456 0.0996261,0.10351562 0.041907,0.0294 0.0902065,0.0501 0.14455552,0.0625 0.0543091,0.0147 0.11244013,0.0234376 0.17581078,0.0234376 0.10524767,0 0.20905884,-0.0160282 0.30864556,-0.0488282 0.0995167,-0.0305 0.19005629,-0.0762925 0.27153,-0.1328125 0.0814137,-0.0577 0.14473371,-0.12455875 0.19339188,-0.19921876 0.047508,-0.0758 0.0742315,-0.15754687 0.0742315,-0.24804687 0,-0.0566 -0.0133112,-0.10904687 -0.0371152,-0.15429687 -0.0249042,-0.0453 -0.071637,-0.091955 -0.14064862,-0.140625 C 0.40602435,-0.47472813 0.29650778,-0.5 0.14260194,-0.5 Z m 0.21292643,0.11328125 c 0.14146375,0 0.21292635,0.057625 0.21292635,0.171875 -0.003,0.0271 -0.0167118,0.0570438 -0.0371152,0.0898438 -0.018103,0.0306 -0.0433793,0.0635094 -0.0761848,0.0996094 -0.0339057,0.0328 -0.0719301,0.0656094 -0.1172072,0.0996094 -0.0430072,0.0328 -0.0897301,0.0652031 -0.14064862,0.0957031 -0.0486082,0.0328 -0.09944729,0.0610375 -0.15041587,0.0859375 -0.05200874,0.0272 -0.10145079,0.0502594 -0.15236934,0.0683594 -0.0487082,0.0204 -0.0948446,0.0363281 -0.13674171,0.0488281 -0.0430072,0.0113 -0.0804448,0.0175781 -0.11330027,0.0175781 -0.13919337,0 -0.20706602,-0.0581113 -0.20706602,-0.17578125 0,-0.0249 0.007292,-0.0531375 0.0253949,-0.0859375 0.018103,-0.0339 0.0442324,-0.0673356 0.0781381,-0.10351562 0.0362061,-0.0328 0.07423,-0.0657094 0.11720718,-0.0996094 0.0453076,-0.0328 0.0925168,-0.0652031 0.14455554,-0.0957031 0.0509085,-0.0294 0.10227404,-0.0552781 0.15432278,-0.0800781 0.05090855,-0.0272 0.09979426,-0.0502594 0.14846243,-0.0683594 0.0509085,-0.0204 0.097155,-0.0382812 0.13674171,-0.0507812 0.041907,-0.0113 0.0793446,-0.0175781 0.11330004,-0.0175782 z';
    protected _flagPath = 'm 7e-8,0.37531846 c 0.018398,0 0.0335764,0.00184 0.0459951,0.005519 0.0133386,0.00368 0.0248374,0.007819 0.0349563,0.0128786 0.01103884,0.005979 0.02115783,0.0128786 0.0312767,0.0202379 0.009659,0.007359 0.0202379,0.0147184 0.0312767,0.0220777 0.12234714,0.085551 0.18398058,0.18076089 0.18398058,0.2851699 v 0.007359 c -0.00138,0.0340365 -0.00276,0.0611735 -0.00368,0.0809515 -0.00138,0.0206978 -0.00322,0.0386359 -0.005519,0.0533544 -0.00276,0.0156384 -0.006899,0.0312767 -0.0128786,0.0459951 -0.005059,0.0147184 -0.0119587,0.0317366 -0.0202379,0.0515146 -0.007359,0.0133386 -0.0110388,0.0229976 -0.0110388,0.0294369 0,0.007359 0.00414,0.0110388 0.0128786,0.0110388 0.00368,9.2e-4 0.010119,-0.005059 0.0202379,-0.018398 0.009659,-0.0124187 0.019318,-0.0312767 0.0294369,-0.057034 0.0110388,-0.0248373 0.0206978,-0.056114 0.0294369,-0.0938301 0.008279,-0.0367961 0.0128786,-0.0791116 0.0128786,-0.1269466 v -0.007359 c 0,-0.065313 -0.0183981,-0.12648668 -0.0551942,-0.18398058 C 0.31368695,0.49582548 0.2672318,0.43511188 0.18398061,0.33116281 0.12004733,0.24791161 0.0653132,0.14672231 0.0202379,0.02759486 c -0.00138,-0.0036796 -0.00184,-0.0082792 -0.00184,-0.01471845 0,-0.00367961 4.5993e-4,-0.00735922 0.00184,-0.01103883 C 0.02115786,9.1761464e-4 0.0147189,-2.22938e-6 0,-2.22938e-6 Z m 0,0';

    constructor() {
        this._image = document.getElementById('imagePreview') as HTMLImageElement;
        this._image.style.width = '100%';
        this._image.style.imageRendering = 'crisp-edges';


        const ui = document.getElementById('ui');

        this.addLoadImageButton();
        this.addDownloadButton();

        const controls = new Controls(ui);

        const lineDistanceInput = controls.createNumberInput(
            'line distance', null, this._lineDistance, null, 0, 5, 0.1);

        lineDistanceInput.addEventListener('change', (event) => {
            const value = (event.target as HTMLInputElement).value;
            this._lineDistance = parseFloat(value);
            this.generateSvg();
        });

        const deleteFactorInput = controls.createNumberInput(
            'base keep factor', null, this._baseKeepFactor, null, 0, 1, 0.05);

        deleteFactorInput.addEventListener('change', (event) => {
            const value = (event.target as HTMLInputElement).value;
            this._baseKeepFactor = parseFloat(value);
            this.generateSvg();
        });

        const useHalfStepInput = controls.createSelectListInput(
            'use half step notes', ['yes', 'no']);
        useHalfStepInput.selectedIndex = this._useHalfSteps ? 0 : 1;

        useHalfStepInput.addEventListener('change', (event) => {
            this._useHalfSteps = useHalfStepInput.selectedIndex == 0;
            this._keepFactor = this._baseKeepFactor * ((this._halfKeepFactorWithHalfSteps && this._useHalfSteps) ? 0.5 : 1.0);
            this.generateSvg();
        });

        const halfKeepFactorInput = controls.createSelectListInput(
            'half keep factor with half steps', ['yes', 'no']);
        halfKeepFactorInput.selectedIndex = this._halfKeepFactorWithHalfSteps ? 0 : 1;

        halfKeepFactorInput.addEventListener('change', (event) => {
            this._halfKeepFactorWithHalfSteps = halfKeepFactorInput.selectedIndex == 0;
            this._keepFactor = this._baseKeepFactor * ((this._halfKeepFactorWithHalfSteps && this._useHalfSteps) ? 0.5 : 1.0);
            this.generateSvg();
        });

    }

    loadImage(path: string): void {
        Jimp.read(path).then((img) => {
            this._originalImage = img;
            const previewImage = new Jimp(img);
            previewImage.cover(this._width, this._height,
                undefined, Jimp.RESIZE_BICUBIC);
            this.dither(previewImage);
            previewImage.getBase64(Jimp.MIME_PNG, (err, src) => {
                this._image.src = src;
            });
            this.generateSvg();
        })
    }

    protected weightedGray(img: Jimp): void {
        for (let x = 0; x < img.getWidth(); x++) {
            for (let y = 0; y < img.getHeight(); y++) {
                const color = Jimp.intToRGBA(img.getPixelColor(x, y));
                const value =
                    color.r * 0.212 + color.g * 0.7152 + color.b * 0.0722;
                img.setPixelColor(
                    Jimp.rgbaToInt(value, value, value, 255, undefined), x, y);
            }
        }
    }

    getClosestValue(value: number, steps: number): number {
        let v = value * (steps - 1);
        v += 0.5;
        v = Math.floor(v);
        v = v / (steps - 1);
        return v;
    }

    dither(img: Jimp): void {
        this.weightedGray(img);
        const values: number[] = [];
        for (let y = 0; y < img.getHeight(); y++) {
            for (let x = 0; x < img.getWidth(); x++) {
                const color = Jimp.intToRGBA(img.getPixelColor(x, y));
                const value = color.r / 255.0;
                values[x + y * img.getWidth()] = value;
            }
        }

        for (let y = 0; y < img.getHeight(); y++) {
            for (let x = 0; x < img.getWidth(); x++) {
                const value = values[x + y * img.getWidth()];
                const newValue = this.getClosestValue(value, 3)
                const error = value - newValue;

                values[(x + 1) + (y + 0) * img.getWidth()]
                    += error * (7 / 16);
                values[(x - 1) + (y + 1) * img.getWidth()]
                    += error * (3 / 16);
                values[(x + 0) + (y + 1) * img.getWidth()]
                    += error * (5 / 16);
                values[(x + 1) + (y + 1) * img.getWidth()]
                    += error * (1 / 16);

                values[x + y * img.getWidth()] = newValue;
            }
        }

        for (let y = 0; y < img.getHeight(); y++) {
            for (let x = 0; x < img.getWidth(); x++) {
                const value = values[x + y * img.getWidth()] * 255;

                img.setPixelColor(
                    Jimp.rgbaToInt(value, value, value, 255, undefined), x, y);
            }
        }
    }

    ditherRow(img: Jimp, y: number): { rowImage: Jimp, averageImage: Jimp } {
        const rowImage = new Jimp(img);
        this.weightedGray(rowImage);
        rowImage.crop(0, y * 2, rowImage.getWidth(), this._notePlacesPerRow);
        const averageImage = new Jimp(rowImage);
        averageImage.resize(averageImage.getWidth(), 1, Jimp.RESIZE_BICUBIC);

        const values: number[] = [];
        for (let y = 0; y < rowImage.getHeight(); y++) {
            for (let x = 0; x < rowImage.getWidth(); x++) {
                // console.log(rowImg.getWidth(), rowImg.getHeight(), x, y);
                const pixel = rowImage.getPixelColor(x, y);
                const color = Jimp.intToRGBA(pixel);
                const value = color.r / 255.0;
                values[x + y * rowImage.getWidth()] = value;
            }
        }

        let sawBlackNote = false;
        let lastWasBlack = false;

        const noteValues = [];

        for (let x = 0; x < rowImage.getWidth(); x++) {
            const averagePixel = averageImage.getPixelColor(x, 0);
            const averageValue = Jimp.intToRGBA(averagePixel).r / 255.0;
            // console.log(averageValue);

            let value = 0.0;
            if (averageValue < 0.5 || (sawBlackNote && !lastWasBlack)) {
                value = 0.0;
                sawBlackNote = true;
                lastWasBlack = true;
            } else {
                value = 0.5;
                lastWasBlack = false;
            }

            // console.log(value);

            value *= 255.0;

            averageImage.setPixelColor(
                Jimp.rgbaToInt(value, value, value, 255, undefined), x, 0
            )
        }
        for (let y = 0; y < rowImage.getHeight(); y++) {
            for (let x = 0; x < rowImage.getWidth(); x++) {
                const value = values[x + y * rowImage.getWidth()];

                const averagePixel = averageImage.getPixelColor(x, 0);
                const averageValue = Jimp.intToRGBA(averagePixel).r / 255.0;

                const minValue = averageValue < 0.5 ? 0.0 : 0.5;
                // console.log(minValue);
                const maxValue = 1.0;

                const newValue = Math.abs(value - minValue) < Math.abs(value - maxValue) ? minValue : maxValue;

                const error = value - newValue;

                values[(x + 1) + (y + 0) * rowImage.getWidth()]
                    += error * (7 / 16);
                values[(x - 1) + (y + 1) * rowImage.getWidth()]
                    += error * (3 / 16);
                values[(x + 0) + (y + 1) * rowImage.getWidth()]
                    += error * (5 / 16);
                values[(x + 1) + (y + 1) * rowImage.getWidth()]
                    += error * (1 / 16);

                values[x + y * rowImage.getWidth()] = newValue;
            }
        }

        for (let y = 0; y < rowImage.getHeight(); y++) {
            for (let x = 0; x < rowImage.getWidth(); x++) {
                const value = values[x + y * rowImage.getWidth()] * 255;

                rowImage.setPixelColor(
                    Jimp.rgbaToInt(value, value, value, 255, undefined), x, y);
            }
        }

        return { rowImage, averageImage };
    }

    generateSvg(): void {
        const clef = this._clefs[this._selectedClefIndex];

        const rowHeight = this._lineDistance * (this._linesPerRow - 1);
        const rowGap = this._lineDistance * (this._rowDistance + 1);
        const rowStep = rowHeight + rowGap;
        const rowCount = (this._height - 2 * this._padding) / rowStep;

        const svgStart = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${this._width}mm" height="${this._height}mm" viewBox="0 0 ${this._width} ${this._height}">
    <rect width="100%" height="100%" fill="white" />
`;
        const svgEnd = '</svg>';

        let defs = `<defs>
    <path id="clef" fill="black" stroke="none" transform="translate(0 ${clef.offsetY * this._lineDistance}) scale(${clef.height * this._lineDistance})" d="${clef.path}" />
    <path id="quarterNote" fill="black" stroke="none" d="${this._quarterNotePath}" />
    <path id="wholeNote" fill="black" stroke="none" d="${this._wholeNotePath}" />
    <path id="flag" fill="black" stroke="none" d="${this._flagPath}" />
</defs>`;

        let elements = '';

        // console.log({ rowHeight, rowGap, rowStep });

        const img = new Jimp(this._originalImage);

        img.cover(
            (this._width * 2.0) / this._lineDistance,
            (this._height * 2.0) / this._lineDistance,
            undefined, Jimp.RESIZE_BICUBIC
        );
        img.resize(
            img.getWidth() / (this._noteDistance * 2.0),
            img.getHeight(), Jimp.RESIZE_BICUBIC
        );

        // this.dither(img);

        for (let r = 0; r < rowCount; r++) {
            console.log('row')
            const x1 = this._padding;
            const x2 = this._width - this._padding;
            const rowY = r * rowStep + this._padding;

            const ditherResult = this.ditherRow(img, rowY / this._lineDistance);
            const rowImage = ditherResult.rowImage;
            const averageImage = ditherResult.averageImage;

            elements += `<line x1="${x1}" y1="${rowY}" x2="${x1}" y2="${rowY + rowHeight}" stroke-width="${this._lineThickness}" stroke="black" stroke-linecap="square" />\n`;
            elements += `<line x1="${x2}" y1="${rowY}" x2="${x2}" y2="${rowY + rowHeight}" stroke-width="${this._lineThickness}" stroke="black" stroke-linecap="square" />\n`;

            elements += `<use transform="translate(${this._padding + 0.5 * this._lineDistance} ${rowY})" xlink:href="#clef" />\n`;

            // draw horizontal lines
            for (let line = 0; line < this._linesPerRow; line++) {
                const y = rowY + line * this._lineDistance;
                elements += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke-width="${this._lineThickness}" stroke="black" stroke-linecap="square" />\n`;
            }

            const notePatterns = [
                [0],
                [2, 1, 2],
                [2, 2, 1],
                [3, 3, 2, 1],
                [2, 2, 2, 2],
            ];

            const patternMatch = (a1: Array<number>, a2: Array<number>) => {
                if (a1.length != a2.length) {
                    return false;
                }
                for (let i = 0; i < a1.length; i++) {
                    if ((a1[i] < 2) != (a2[i] < 2)) {
                        return false;
                    }
                }
                return true;
            }

            let noteValues: Array<number> = [];
            let lastNotes: Array<number> = [];
            let barLinePlaces = [];
            for (let column = 0; column < averageImage.getWidth(); column++) {
                const x = this._padding + column * this._lineDistance * this._noteDistance + this._clefWidth * this._lineDistance;
                const px = x / (this._lineDistance * this._noteDistance);
                const py = 0;
                const pixel = Jimp.intToRGBA(averageImage.getPixelColor(px, py));
                const pixelValue = (pixel.r / 255.0);
                let value = 0;
                if (pixelValue < 0.5) {
                    value = 2;
                }
                lastNotes.push(value);
                const matchingPattern = notePatterns.find(element => patternMatch(element, lastNotes));

                if (matchingPattern) {
                    lastNotes = [];
                    barLinePlaces.push(column);
                    noteValues = noteValues.concat(matchingPattern);
                }
            }

            // draw notes & bar lines
            let placedNote = false;
            for (let column = 0; column < rowImage.getWidth(); column++) {
                const x = this._padding + this._lineDistance * (column * this._noteDistance + this._clefWidth);

                const noteValue = noteValues[column];

                let minPos = this._notePlacesPerRow - 1;
                let maxPos = 0;
                // draw notes
                for (let line = 0; line < this._notePlacesPerRow; line++) {
                    if (Math.random() > this._keepFactor) {
                        continue;
                    }
                    if (!this._useHalfSteps && line % 2 != 0) {
                        continue;
                    }
                    const y = rowY + line * this._lineDistance * 0.5;

                    if (x >= x2) {
                        break;
                    }
                    const px = x / (this._lineDistance * this._noteDistance);
                    const py = line;
                    const pixel = Jimp.intToRGBA(rowImage.getPixelColor(px, py));
                    const value = (pixel.r / 255.0) * 2;
                    if (value < 2.0) {
                        minPos = Math.min(minPos, line);
                        maxPos = Math.max(maxPos, line);
                        if (noteValue < 2) {
                            elements += `<use x="0" y="0" transform="translate(${x} ${y}) scale(${this._lineDistance})" xlink:href="#wholeNote" />\n`;
                        } else {
                            elements += `<use x="0" y="0" transform="translate(${x} ${y}) scale(${this._lineDistance})" xlink:href="#quarterNote" />\n`;
                        }
                    }
                }

                // draw note stem
                if (maxPos >= minPos) {
                    placedNote = true;
                    if (noteValue > 0) {
                        let noteLineX = x;
                        const noteLineXOffset = this._noteWidth * this._lineDistance * 0.5;
                        if (minPos < this._notePlacesPerRow - 1 - maxPos) {
                            maxPos += 6;
                            maxPos = Math.min(maxPos, this._notePlacesPerRow + 1);
                            noteLineX -= noteLineXOffset;
                        } else {
                            minPos -= 6;
                            minPos = Math.max(minPos, -2);
                            noteLineX += noteLineXOffset;
                        }

                        let noteLineStart = rowY + minPos * this._lineDistance * 0.5;
                        let noteLineEnd = rowY + maxPos * this._lineDistance * 0.5;

                        elements += `<line x1="${noteLineX}" y1="${noteLineStart}" x2="${noteLineX}" y2="${noteLineEnd}" stroke-width="${this._lineThickness}" stroke="black" stroke-linecap="square" />\n`;

                        if (noteValue == 3) {
                            elements += `<use transform="translate(${noteLineX} ${noteLineStart}) scale(${this._lineDistance * 2.5})" xlink:href="#flag" />\n`;
                            console.log(`placed flag at row ${r} & column ${column}`)
                        }
                    }
                }

                if (placedNote && barLinePlaces.includes(column)) {
                    const barLineX = x + this._noteDistance * this._lineDistance * 0.5;
                    elements += `<line x1="${barLineX}" y1="${rowY}" x2="${barLineX}" y2="${rowY + rowHeight}" stroke-width="${this._lineThickness}" stroke="black" stroke-linecap="square" />\n`;
                    placedNote = false;
                }
            }
        }

        this._svg = svgStart + defs + elements + svgEnd;


        const svgPreview = document.getElementById('svgPreview');
        svgPreview.innerHTML = this._svg;
        const svgElement = svgPreview.getElementsByTagName('svg')[0];
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
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