// Скрипт для генератора QR-кодів

let qrcodeInstance = null;
let qrSize = 256;
let qrText = 'https://example.com';
let qrDarkColor = '#000000';
let qrLightColor = '#FFFFFF';
let qrCorrection = 'H';
let isTransparent = false;
let selectedFormat = 'png';
let borderRadius = 0;

// Отримання всіх необхідних елементів
const textInput = document.getElementById('text');
const sizeSelect = document.getElementById('size');
const correctionSelect = document.getElementById('correction');
const darkColorInput = document.getElementById('dark-color');
const lightColorInput = document.getElementById('light-color');
const darkColorDisplay = document.getElementById('dark-color-display');
const lightColorDisplay = document.getElementById('light-color-display');
const transparentBgCheckbox = document.getElementById('transparent-bg');
const generateBtn = document.getElementById('generate-btn');
const qrcodeDiv = document.getElementById('qrcode');
const downloadBtn = document.getElementById('download-btn');
const downloadOptions = document.getElementById('download-options');
const formatOptions = document.querySelectorAll('.format-option');
const borderRadiusRange = document.getElementById('border-radius-range');
const borderRadiusValue = document.getElementById('border-radius-value');

// Синхронізація значень border-radius
borderRadiusRange.addEventListener('input', function() {
	borderRadius = this.value;
	borderRadiusValue.value = this.value;
	updateQrBorderRadius();
});

borderRadiusValue.addEventListener('input', function() {
	const value = parseInt(this.value);
	if (!isNaN(value) && value >= 0 && value <= 50) {
		borderRadius = value;
		borderRadiusRange.value = value;
		updateQrBorderRadius();
	}
});

function updateQrBorderRadius() {
	document.documentElement.style.setProperty('--qr-radius', borderRadius + 'px');

	// Також застосовуємо до зображення, якщо воно вже згенероване
	const img = qrcodeDiv.querySelector('img');
	if (img) {
		img.style.borderRadius = borderRadius + 'px';
	}
}

// Оновлення відображення кольорів при зміні
darkColorInput.addEventListener('input', function() {
	darkColorDisplay.style.backgroundColor = this.value;
	qrDarkColor = this.value;
});

lightColorInput.addEventListener('input', function() {
	lightColorDisplay.style.backgroundColor = this.value;
	qrLightColor = this.value;
});

// Обробники подій для вибору формату
formatOptions.forEach(option => {
	option.addEventListener('click', function() {
		// Видаляємо активний клас з усіх опцій
		formatOptions.forEach(opt => opt.classList.remove('active'));
		// Додаємо активний клас до поточної опції
		this.classList.add('active');
		// Оновлюємо обраний формат
		selectedFormat = this.getAttribute('data-format');
	});
});

// Обробник подій для прапорця "прозорий фон"
transparentBgCheckbox.addEventListener('change', function() {
	isTransparent = this.checked;
	const bgColorContainer = document.getElementById('bg-color-container');

	if (isTransparent) {
		bgColorContainer.classList.add('hidden');
		qrcodeDiv.classList.add('has-transparent-bg');
	} else {
		bgColorContainer.classList.remove('hidden');
		qrcodeDiv.classList.remove('has-transparent-bg');
	}

	lightColorInput.disabled = isTransparent;
});

// Генерація QR-коду при натисканні на кнопку
generateBtn.addEventListener('click', generateQRCode);

// Функція для генерації QR-коду
function generateQRCode() {
	// Отримання значень з полів
	qrText = textInput.value || 'https://example.com';
	qrSize = parseInt(sizeSelect.value);
	qrDarkColor = darkColorInput.value;
	qrCorrection = correctionSelect.value;
	qrLightColor = isTransparent ? 'transparent' : lightColorInput.value;

	// Очищення попереднього QR-коду
	qrcodeDiv.innerHTML = '';

	// Створення нового QR-коду
	qrcodeInstance = new QRCode(qrcodeDiv, {
		text: qrText,
		width: qrSize,
		height: qrSize,
		colorDark: qrDarkColor,
		colorLight: qrLightColor,
		correctLevel: getCorrectLevel(qrCorrection)
	});

	// Показуємо кнопку завантаження
	downloadOptions.style.display = 'block';

	// Якщо обрано прозорий фон, робимо фон QR-коду прозорим
	if (isTransparent) {
		qrcodeDiv.classList.add('has-transparent-bg');

		setTimeout(function() {
			const img = qrcodeDiv.querySelector('img');
			if (img) {
				// Застосовуємо заокруглення кутів
				img.style.borderRadius = borderRadius + 'px';

				// Створюємо канвас і малюємо QR-код з прозорим фоном
				const canvas = document.createElement('canvas');
				canvas.width = qrSize;
				canvas.height = qrSize;
				const ctx = canvas.getContext('2d');

				// Завантажуємо зображення в канвас
				img.onload = function() {
					ctx.drawImage(img, 0, 0, qrSize, qrSize);

					// Отримуємо дані зображення
					const imageData = ctx.getImageData(0, 0, qrSize, qrSize);
					const data = imageData.data;

					// Проходимо через всі пікселі і робимо білі (255,255,255) пікселі прозорими
					for (let i = 0; i < data.length; i += 4) {
						if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
							data[i + 3] = 0; // Альфа-канал = 0 (повністю прозорий)
						}
					}

					// Застосовуємо зміни
					ctx.putImageData(imageData, 0, 0);

					// Заміняємо оригінальне зображення на канвас
					img.src = canvas.toDataURL('image/png');
				};

				// Перезавантажуємо зображення, щоб активувати onload
				const originalSrc = img.src;
				img.src = originalSrc;
			}
		}, 50); // Невелика затримка, щоб QR-код встиг створитися
	} else {
		qrcodeDiv.classList.remove('has-transparent-bg');

		// Застосовуємо заокруглення кутів
		setTimeout(function() {
			const img = qrcodeDiv.querySelector('img');
			if (img) {
				img.style.borderRadius = borderRadius + 'px';
			}
		}, 50);
	}
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

// Функція для отримання текстового представлення розміру для імені файлу
function getSizeTextForFileName() {
	switch(qrSize) {
		case 128: return '_128x128';
		case 256: return '_256x256';
		case 384: return '_384x384';
		case 512: return '_512x512';
		default: return `_${qrSize}x${qrSize}`;
	}
}

// Завантаження QR-коду як зображення
downloadBtn.addEventListener('click', function() {
	// Пошук IMG елемента в контейнері QR-коду
	const img = qrcodeDiv.querySelector('img');
	if (img) {
		// Створюємо canvas для обробки зображення
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Встановлюємо розмір canvas відповідно до розміру QR-коду
		canvas.width = qrSize;
		canvas.height = qrSize;

		// Створюємо тимчасове зображення для завантаження в canvas
		const tempImg = new Image();
		tempImg.crossOrigin = "Anonymous";

		tempImg.onload = function() {
			// Створюємо заокруглений QR-код
			if (borderRadius > 0) {
				// Очищаємо canvas
				ctx.clearRect(0, 0, qrSize, qrSize);

				// Малюємо заокруглений прямокутник як шлях
				ctx.beginPath();
				ctx.moveTo(borderRadius, 0);
				ctx.lineTo(qrSize - borderRadius, 0);
				ctx.quadraticCurveTo(qrSize, 0, qrSize, borderRadius);
				ctx.lineTo(qrSize, qrSize - borderRadius);
				ctx.quadraticCurveTo(qrSize, qrSize, qrSize - borderRadius, qrSize);
				ctx.lineTo(borderRadius, qrSize);
				ctx.quadraticCurveTo(0, qrSize, 0, qrSize - borderRadius);
				ctx.lineTo(0, borderRadius);
				ctx.quadraticCurveTo(0, 0, borderRadius, 0);
				ctx.closePath();

				// Встановлюємо цей шлях як маску відсікання
				ctx.clip();
			}

			// Якщо прозорий фон, обробляємо зображення
			if (isTransparent) {
				// Малюємо зображення на canvas
				ctx.drawImage(tempImg, 0, 0, qrSize, qrSize);

				// Отримуємо дані зображення
				const imageData = ctx.getImageData(0, 0, qrSize, qrSize);
				const data = imageData.data;

				// Проходимо через всі пікселі і робимо білі (255,255,255) пікселі прозорими
				for (let i = 0; i < data.length; i += 4) {
					if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
						data[i + 3] = 0; // Альфа-канал = 0 (повністю прозорий)
					}
				}

				// Застосовуємо зміни
				ctx.putImageData(imageData, 0, 0);
			} else {
				// Просто малюємо зображення, якщо не потрібний прозорий фон
				ctx.drawImage(tempImg, 0, 0, qrSize, qrSize);
			}

			// Визначаємо формат та налаштування для завантаження
			let mimeType, fileName, quality;

			// Визначаємо частину імені файлу, що відповідає розміру
			const sizeText = getSizeTextForFileName();
			// Визначаємо частину імені файлу, що відповідає заокругленню
			const radiusText = borderRadius > 0 ? `_r${borderRadius}` : '';
			// Визначаємо частину імені файлу, що відповідає прозорості
			const transparentText = isTransparent ? '_transparent' : '';

			switch(selectedFormat) {
				case 'svg':
					// Створюємо SVG напряму з даних QR-коду
					// Використовуємо бібліотеку qrcode-generator
					const qrGenerator = qrcode(0, qrCorrection);
					qrGenerator.addData(qrText);
					qrGenerator.make();

					// Отримуємо кількість модулів і обчислюємо розмір одного модуля
					const moduleCount = qrGenerator.getModuleCount();
					const moduleSize = qrSize / moduleCount;

					// Створюємо SVG
					let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qrSize} ${qrSize}" width="${qrSize}" height="${qrSize}">`;

					// Якщо потрібно заокруглення кутів
					if (borderRadius > 0) {
						svgContent += `<defs>
                            <clipPath id="rounded-corners">
                                <rect x="0" y="0" width="${qrSize}" height="${qrSize}" rx="${borderRadius}" ry="${borderRadius}" />
                            </clipPath>
                        </defs>
                        <g clip-path="url(#rounded-corners)">`;
					}

					// Якщо фон не прозорий, додаємо прямокутник фону
					if (!isTransparent) {
						if (borderRadius > 0) {
							svgContent += `<rect width="${qrSize}" height="${qrSize}" fill="${qrLightColor}" rx="${borderRadius}" ry="${borderRadius}" />`;
						} else {
							svgContent += `<rect width="${qrSize}" height="${qrSize}" fill="${qrLightColor}" />`;
						}
					}

					// Додаємо темні модулі як прямокутники
					for (let row = 0; row < moduleCount; row++) {
						for (let col = 0; col < moduleCount; col++) {
							if (qrGenerator.isDark(row, col)) {
								const x = col * moduleSize;
								const y = row * moduleSize;
								svgContent += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${qrDarkColor}" />`;
							}
						}
					}

					// Закриваємо групу, якщо використовувалось заокруглення
					if (borderRadius > 0) {
						svgContent += '</g>';
					}

					svgContent += '</svg>';

					// Створення Blob з SVG даними
					const svgBlob = new Blob([svgContent], {type: 'image/svg+xml'});
					// Створюємо URL для завантаження
					const svgUrl = URL.createObjectURL(svgBlob);
					// Завантажуємо файл
					fileName = `qrcode${sizeText}${radiusText}${transparentText}.svg`;
					downloadFile(svgUrl, fileName);
					return;
				case 'jpeg':
					mimeType = 'image/jpeg';
					fileName = `qrcode${sizeText}${radiusText}.jpg`;
					quality = 1.0; // Найвища якість

					// JPEG не підтримує прозорість, тому додаємо білий фон
					if (isTransparent) {
						// Зберігаємо поточне зображення
						const tempData = ctx.getImageData(0, 0, qrSize, qrSize);
						// Очищуємо canvas білим кольором
						ctx.fillStyle = '#FFFFFF';
						ctx.fillRect(0, 0, qrSize, qrSize);
						// Накладаємо QR-код на білий фон
						ctx.putImageData(tempData, 0, 0);
					}
					break;
				case 'png':
				default:
					mimeType = 'image/png';
					fileName = `qrcode${sizeText}${radiusText}${transparentText}.png`;
					quality = 1.0;
					break;
			}

			// Отримуємо URL зображення з canvas
			const imgUrl = canvas.toDataURL(mimeType, quality);

			// Завантажуємо файл
			downloadFile(imgUrl, fileName);
		};

		// Завантажуємо зображення QR-коду в тимчасове зображення
		tempImg.src = img.src;
	}
});

// Функція для завантаження файлу
function downloadFile(url, fileName) {
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	// Очищаємо URL об'єкт, якщо він був створений з Blob
	if (url.startsWith('blob:')) {
		URL.revokeObjectURL(url);
	}
}

// Генеруємо QR-код при завантаженні сторінки
window.addEventListener('DOMContentLoaded', function() {
	// Перевіряємо, чи активний режим QR-кодів
	const modeSwitch = document.getElementById('mode-switch-checkbox');
	if (modeSwitch && modeSwitch.checked) {
		generateQRCode();
	}
});
