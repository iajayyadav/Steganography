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
    const passwordInput = document.getElementById('encodePassword');

    const encryptionKey = passwordInput.value;

    if (imageInput.files.length === 0 || textInput.value === '' || encryptionKey === '') {
        alert('Please select an image, enter text, and provide a password.');
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

            // Encrypt the text
            const plainText = textInput.value;
            const encryptedText = CryptoJS.AES.encrypt(plainText, encryptionKey).toString();

            const textLength = encryptedText.length;

            // Encode text length in the first pixel's blue channel
            data[2] = textLength;

            for (let i = 0; i < textLength; i++) {
                data[i * 4 + 3] = encryptedText.charCodeAt(i); // Store text in alpha channel
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
    const passwordInput = document.getElementById('decodePassword');

    const decryptionKey = passwordInput.value;

    if (decodeImageInput.files.length === 0 || decryptionKey === '') {
        alert('Please select an image and provide the password.');
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
            let encodedText = '';

            for (let i = 0; i < textLength; i++) {
                encodedText += String.fromCharCode(data[i * 4 + 3]); // Read text from alpha channel
            }

            // Decrypt the text
            let decryptedText;
            try {
                const bytes = CryptoJS.AES.decrypt(encodedText, decryptionKey);
                decryptedText = bytes.toString(CryptoJS.enc.Utf8);
                if (!decryptedText) throw new Error("Decryption failed.");
            } catch (error) {
                alert("Decryption failed. Check your password.");
                return;
            }

            document.getElementById('decodedText').innerText = decryptedText;
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
