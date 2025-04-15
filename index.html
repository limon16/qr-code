<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Генератор QR-кодів</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Arial', sans-serif;
    }

    body {
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
      padding: 30px;
    }

    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
    }

    .input-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: #555;
    }

    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    input:focus, select:focus {
      border-color: #007bff;
      outline: none;
    }

    .options {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .options .input-group {
      width: 48%;
    }

    button {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 12px 20px;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #0056b3;
    }

    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;
    }

    #qrcode {
      margin-bottom: 20px;
      padding: 15px;
      background-color: white;
      border-radius: 5px;
    }

    #download-btn {
      background-color: #28a745;
      display: none;
      margin-top: 10px;
    }

    #download-btn:hover {
      background-color: #218838;
    }

    .color-picker {
      display: flex;
      align-items: center;
    }

    .color-picker input[type="color"] {
      width: 50px;
      height: 40px;
      padding: 2px;
      margin-right: 10px;
    }

    .color-display {
      width: calc(100% - 60px);
      height: 40px;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
  </style>
</head>
<body>
<div class="container">
  <h1>Генератор QR-кодів</h1>

  <div class="input-group">
    <label for="text">Текст або URL</label>
    <input type="text" id="text" placeholder="Введіть текст або URL" value="https://example.com">
  </div>

  <div class="options">
    <div class="input-group">
      <label for="size">Розмір</label>
      <select id="size">
        <option value="128">Малий (128×128)</option>
        <option value="256" selected>Середній (256×256)</option>
        <option value="384">Великий (384×384)</option>
        <option value="512">Дуже великий (512×512)</option>
      </select>
    </div>

    <div class="input-group">
      <label for="correction">Рівень корекції</label>
      <select id="correction">
        <option value="L">Низький (7%)</option>
        <option value="M">Середній (15%)</option>
        <option value="Q">Високий (25%)</option>
        <option value="H" selected>Дуже високий (30%)</option>
      </select>
    </div>
  </div>

  <div class="input-group">
    <label for="dark-color">Колір QR-коду</label>
    <div class="color-picker">
      <input type="color" id="dark-color" value="#000000">
      <div class="color-display" id="dark-color-display" style="background-color: #000000;"></div>
    </div>
  </div>

  <div class="input-group">
    <label for="light-color">Колір фону</label>
    <div class="color-picker">
      <input type="color" id="light-color" value="#FFFFFF">
      <div class="color-display" id="light-color-display" style="background-color: #FFFFFF;"></div>
    </div>
  </div>

  <button id="generate-btn">Згенерувати QR-код</button>

  <div class="qr-container">
    <div id="qrcode"></div>
    <button id="download-btn">Завантажити QR-код</button>
  </div>
</div>

<script>
	// Отримання всіх необхідних елементів
	const textInput = document.getElementById('text');
	const sizeSelect = document.getElementById('size');
	const correctionSelect = document.getElementById('correction');
	const darkColorInput = document.getElementById('dark-color');
	const lightColorInput = document.getElementById('light-color');
	const darkColorDisplay = document.getElementById('dark-color-display');
	const lightColorDisplay = document.getElementById('light-color-display');
	const generateBtn = document.getElementById('generate-btn');
	const qrcodeDiv = document.getElementById('qrcode');
	const downloadBtn = document.getElementById('download-btn');

	// Змінні для зберігання QR-коду та його параметрів
	let qrcode = null;
	let qrSize = 256;
	let qrText = 'https://example.com';
	let qrDarkColor = '#000000';
	let qrLightColor = '#FFFFFF';
	let qrCorrection = 'H';

	// Оновлення відображення кольорів при зміні
	darkColorInput.addEventListener('input', function() {
		darkColorDisplay.style.backgroundColor = this.value;
		qrDarkColor = this.value;
	});

	lightColorInput.addEventListener('input', function() {
		lightColorDisplay.style.backgroundColor = this.value;
		qrLightColor = this.value;
	});

	// Генерація QR-коду при натисканні на кнопку
	generateBtn.addEventListener('click', generateQRCode);

	// Функція для генерації QR-коду
	function generateQRCode() {
		// Отримання значень з полів
		qrText = textInput.value || 'https://example.com';
		qrSize = parseInt(sizeSelect.value);
		qrDarkColor = darkColorInput.value;
		qrLightColor = lightColorInput.value;
		qrCorrection = correctionSelect.value;

		// Очищення попереднього QR-коду
		qrcodeDiv.innerHTML = '';

		// Створення нового QR-коду
		qrcode = new QRCode(qrcodeDiv, {
			text: qrText,
			width: qrSize,
			height: qrSize,
			colorDark: qrDarkColor,
			colorLight: qrLightColor,
			correctLevel: getCorrectLevel(qrCorrection)
		});

		// Показуємо кнопку завантаження
		downloadBtn.style.display = 'block';
	}

	// Конвертація рівня корекції з букв в константи бібліотеки
	function getCorrectLevel(level) {
		switch(level) {
			case 'L': return QRCode.CorrectLevel.L;
			case 'M': return QRCode.CorrectLevel.M;
			case 'Q': return QRCode.CorrectLevel.Q;
			case 'H': return QRCode.CorrectLevel.H;
			default: return QRCode.CorrectLevel.H;
		}
	}

	// Завантаження QR-коду як зображення
	downloadBtn.addEventListener('click', function() {
		// Пошук IMG елемента в контейнері QR-коду
		const img = qrcodeDiv.querySelector('img');
		if (img) {
			// Створення тимчасового посилання для завантаження
			const link = document.createElement('a');
			link.href = img.src;
			link.download = 'qrcode.png';

			// Імітація кліку для завантаження
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	});

	// Генерація QR-коду при завантаженні сторінки
	window.onload = generateQRCode;
</script>
</body>
</html>
