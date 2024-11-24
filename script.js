
const container = document.getElementsByClassName("container")[0];
const encodeSection = document.getElementById('encodeSection');
const decodeSection = document.getElementById('decodeSection');

document.getElementById('encodeBtn').addEventListener('click', function () {


    if (encodeSection.style.display === 'block') {
        encodeSection.style.display = 'none';
        container.style.top = "40vh";
    } else {
        encodeSection.style.display = 'block';
        decodeSection.style.display = 'none';
        container.style.top = "18vh";
    }
});


document.getElementById('decodeBtn').addEventListener('click', function () {


    if (decodeSection.style.display === 'block') {
        decodeSection.style.display = 'none';
        container.style.top = "40vh";
    } else {
        decodeSection.style.display = 'block';
        encodeSection.style.display = 'none';
        container.style.top = "18vh";
    }
});

document.getElementById('encodeImageBtn').addEventListener('click', function () {
    const imageInput = document.getElementById('imageInput');
    const textInput = document.getElementById('textInput');

    if (imageInput.files.length === 0 || textInput.value === '') {
        alert('Please select an image and enter text.');
        return;
    }

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            const text = textInput.value;
            const textLength = text.length;

            // Encode text length in the first pixel's blue channel
            data[2] = textLength;

            for (let i = 0; i < textLength; i++) {
                data[i * 4 + 3] = text.charCodeAt(i); // Store text in alpha channel
            }

            ctx.putImageData(imageData, 0, 0);
            const encodedImage = canvas.toDataURL('image/png');
            download(encodedImage, 'encoded_image.png');
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

document.getElementById('decodeImageBtn').addEventListener('click', function () {
    const decodeImageInput = document.getElementById('decodeImageInput');

    if (decodeImageInput.files.length === 0) {
        alert('Please select an image to decode.');
        return;
    }

    const file = decodeImageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            const textLength = data[2];
            let decodedText = '';

            for (let i = 0; i < textLength; i++) {
                decodedText += String.fromCharCode(data[i * 4 + 3]); // Read text from alpha channel
            }

            document.getElementById('decodedText').innerText = decodedText;
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// Download function
function download(data, filename) {
    const a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
