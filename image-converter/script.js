// Скрипт для конвертера зображень

// Змінні для зберігання
let uploadedFiles = []; // Масив для зберігання завантажених файлів
let convertedFiles = []; // Масив для зберігання конвертованих файлів
let convertFormat = 'webp'; // Формат конвертації за замовчуванням
let imageQuality = 0.9; // Якість зображення (0.1 - 1.0)
let zipFiles = true; // Чи архівувати результати

// Отримання DOM елементів
const uploadDropzone = document.getElementById('upload-dropzone');
const fileInput = document.getElementById('file-input');
const formatSelect = document.getElementById('convert-format');
const qualitySlider = document.getElementById('image-quality');
const qualityValue = document.getElementById('quality-value');
const zipCheckbox = document.getElementById('zip-files');
const convertBtn = document.getElementById('convert-btn');
const statusContainer = document.getElementById('status-container');
const statusText = document.getElementById('status-text');
const statusPercentage = document.getElementById('status-percentage');
const progressFill = document.getElementById('progress-fill');
const filesPreview = document.getElementById('files-preview');
const downloadResults = document.getElementById('download-results');
const downloadConvertedBtn = document.getElementById('download-converted-btn');
const downloadText = document.getElementById('download-text');

// Додавання обробників подій
uploadDropzone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', handleFileSelect);

// Встановлення обробників drag & drop
uploadDropzone.addEventListener('dragover', (e) => {
	e.preventDefault();
	uploadDropzone.classList.add('drag-over');
});

uploadDropzone.addEventListener('dragleave', () => {
	uploadDropzone.classList.remove('drag-over');
});

uploadDropzone.addEventListener('drop', (e) => {
	e.preventDefault();
	uploadDropzone.classList.remove('drag-over');

	if (e.dataTransfer.files.length > 0) {
		handleFiles(e.dataTransfer.files);
	}
});

// Обробники для налаштувань конвертації
formatSelect.addEventListener('change', () => {
	convertFormat = formatSelect.value;

	// Показуємо/приховуємо слайдер якості в залежності від формату
	const qualityContainer = document.querySelector('.quality-container');
	if (convertFormat === 'svg') {
		qualityContainer.classList.add('hidden');
	} else {
		qualityContainer.classList.remove('hidden');
	}
});

qualitySlider.addEventListener('input', () => {
	imageQuality = parseInt(qualitySlider.value) / 100;
	qualityValue.textContent = qualitySlider.value;
});

zipCheckbox.addEventListener('change', () => {
	zipFiles = zipCheckbox.checked;

	// Якщо є конвертовані файли, оновлюємо текст кнопки завантаження
	if (convertedFiles.length > 0) {
		if (zipFiles) {
			downloadText.textContent = `Завантажити архів (${convertedFiles.length} файлів)`;
		} else {
			downloadText.textContent = convertedFiles.length === 1
					? 'Завантажити конвертований файл'
					: `Завантажити ${convertedFiles.length} файлів по черзі`;
		}
	}
});

// Обробник кнопки конвертації
convertBtn.addEventListener('click', startConversion);

// Функція обробки вибраних файлів
function handleFileSelect(event) {
	const files = event.target.files;
	if (files.length > 0) {
		handleFiles(files);
	}
}

// Функція для обробки файлів
function handleFiles(files) {
	// Перевіряємо, чи це файли зображень
	const imageFiles = Array.from(files).filter(file => {
		return file.type.startsWith('image/');
	});

	if (imageFiles.length === 0) {
		alert('Будь ласка, виберіть файли зображень для конвертації.');
		return;
	}

	// Додаємо файли до нашого масиву та створюємо попередній перегляд
	imageFiles.forEach(file => {
		if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
			uploadedFiles.push(file);
			createFilePreview(file);
		}
	});

	// Оновлюємо UI, якщо файли завантажені
	updateUIForFiles();
}

// Функція для створення попереднього перегляду файлу
function createFilePreview(file) {
	const fileItem = document.createElement('div');
	fileItem.className = 'file-item';
	fileItem.dataset.fileName = file.name;

	// Створюємо URL для зображення
	const imgUrl = URL.createObjectURL(file);

	// Створюємо елементи для мініатюри
	const img = document.createElement('img');
	img.src = imgUrl;
	img.alt = file.name;

	const fileName = document.createElement('div');
	fileName.className = 'file-name';
	fileName.textContent = truncateFilename(file.name, 20);

	const removeBtn = document.createElement('div');
	removeBtn.className = 'remove-file';
	removeBtn.innerHTML = '×';
	removeBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		// Видаляємо файл з масиву
		uploadedFiles = uploadedFiles.filter(f => f.name !== file.name || f.size !== file.size);
		// Видаляємо елемент з DOM
		fileItem.remove();
		// Звільняємо URL
		URL.revokeObjectURL(imgUrl);
		// Оновлюємо UI
		updateUIForFiles();
	});

	// Додаємо елементи до контейнера
	fileItem.appendChild(img);
	fileItem.appendChild(fileName);
	fileItem.appendChild(removeBtn);

	// Додаємо до списку файлів
	filesPreview.appendChild(fileItem);
}

// Функція для скорочення довгих імен файлів
function truncateFilename(filename, maxLength) {
	if (filename.length <= maxLength) {
		return filename;
	}

	const extension = filename.split('.').pop();
	const nameWithoutExt = filename.substring(0, filename.length - extension.length - 1);

	if (extension.length + 3 >= maxLength) {
		return filename.substring(0, maxLength - 3) + '...';
	}

	const truncatedLength = maxLength - extension.length - 4; // -4 для "..." та "."
	return nameWithoutExt.substring(0, truncatedLength) + '...' + '.' + extension;
}

// Функція для оновлення UI в залежності від наявності файлів
function updateUIForFiles() {
	if (uploadedFiles.length > 0) {
		convertBtn.disabled = false;
	} else {
		convertBtn.disabled = true;
		filesPreview.innerHTML = '';
		downloadResults.classList.add('hidden');
		// Скидаємо масив конвертованих файлів
		convertedFiles = [];
	}
}

// Функція для початку конвертації
function startConversion() {
	if (uploadedFiles.length === 0) {
		alert('Будь ласка, виберіть файли для конвертації.');
		return;
	}

	// Скидаємо попередні результати
	convertedFiles = [];

	// Показуємо статус конвертації
	statusContainer.classList.remove('hidden');
	downloadResults.classList.add('hidden');

	// Встановлюємо початковий статус
	statusText.textContent = 'Підготовка до конвертації...';
	statusPercentage.textContent = '0%';
	progressFill.style.width = '0%';

	// Блокуємо елементи інтерфейсу під час конвертації
	disableUIElements(true);

	// Починаємо процес конвертації з затримкою для відображення UI
	setTimeout(() => {
		convertFiles();
	}, 200);
}

// Функція для блокування/розблокування елементів інтерфейсу
function disableUIElements(disable) {
	// Блокуємо/розблокуємо кнопку конвертації
	convertBtn.disabled = disable;

	// Блокуємо/розблокуємо селектор формату
	formatSelect.disabled = disable;

	// Блокуємо/розблокуємо слайдер якості
	qualitySlider.disabled = disable;

	// Блокуємо/розблокуємо чекбокс архівування
	zipCheckbox.disabled = disable;

	// Блокуємо/розблокуємо можливість додавати нові файли
	fileInput.disabled = disable;

	// Змінюємо вигляд дроп-зони під час конвертації
	if (disable) {
		uploadDropzone.classList.add('disabled');
		// Блокуємо можливість клікнути на дроп-зону
		uploadDropzone.style.pointerEvents = 'none';
	} else {
		uploadDropzone.classList.remove('disabled');
		uploadDropzone.style.pointerEvents = 'auto';
	}

	// Блокуємо/розблокуємо кнопки видалення файлів
	const removeButtons = document.querySelectorAll('.remove-file');
	removeButtons.forEach(button => {
		button.style.display = disable ? 'none' : '';
	});
}

// Допоміжна функція для завантаження зображення
function loadImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('Не вдалось завантажити зображення'));
		img.src = url;
	});
}

// Функція для конвертації в WebP
async function convertToWebP(img, fileName, quality) {
	return new Promise((resolve) => {
		// Створюємо canvas для малювання зображення
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;

		// Малюємо зображення на canvas
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);

		// Конвертуємо canvas у WebP
		canvas.toBlob((blob) => {
			if (blob) {
				// Визначаємо нове ім'я файлу
				const originalName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
				const newFileName = `${originalName}.webp`;

				// Створюємо новий File об'єкт
				const convertedFile = {
					blob: blob,
					name: newFileName,
					type: 'image/webp',
					url: URL.createObjectURL(blob)
				};

				resolve(convertedFile);
			} else {
				resolve(null);
			}
		}, 'image/webp', quality);
	});
}

// Функція для конвертації в SVG
async function convertToSVG(img, fileName) {
	return new Promise((resolve) => {
		// Створюємо canvas для малювання зображення
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;

		// Малюємо зображення на canvas
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);

		// Отримуємо дані зображення
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		// Спрощений алгоритм трасування для SVG (може бути покращений)
		let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">`;

		// Додаємо базове зображення як прямокутники (дуже спрощений підхід)
		// Для кращого трасування рекомендується використовувати спеціалізовані бібліотеки
		// Для простоти використовуємо вбудоване зображення у форматі base64
		const dataUrl = canvas.toDataURL('image/png');
		svgContent += `<image width="${canvas.width}" height="${canvas.height}" href="${dataUrl}" />`;

		svgContent += '</svg>';

		// Створюємо blob з SVG контентом
		const blob = new Blob([svgContent], { type: 'image/svg+xml' });

		// Визначаємо нове ім'я файлу
		const originalName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
		const newFileName = `${originalName}.svg`;

		// Створюємо новий File об'єкт
		const convertedFile = {
			blob: blob,
			name: newFileName,
			type: 'image/svg+xml',
			url: URL.createObjectURL(blob)
		};

		resolve(convertedFile);
	});
}

// Функція для конвертації файлів
async function convertFiles() {
	const totalFiles = uploadedFiles.length;
	let completedFiles = 0;

	for (const file of uploadedFiles) {
		// Оновлення статусу
		statusText.textContent = `Конвертація ${file.name}...`;

		try {
			// Створюємо URL об'єкт з файлу
			const fileUrl = URL.createObjectURL(file);

			// Завантажуємо зображення
			const img = await loadImage(fileUrl);

			// Конвертуємо зображення у вибраний формат
			let convertedFile;

			if (convertFormat === 'webp') {
				convertedFile = await convertToWebP(img, file.name, imageQuality);
			} else if (convertFormat === 'svg') {
				convertedFile = await convertToSVG(img, file.name);
			}

			// Додаємо конвертований файл до масиву результатів
			if (convertedFile) {
				convertedFiles.push(convertedFile);
			}

			// Звільняємо ресурси
			URL.revokeObjectURL(fileUrl);

			// Оновлюємо прогрес
			completedFiles++;
			const progress = Math.round((completedFiles / totalFiles) * 100);
			statusPercentage.textContent = `${progress}%`;
			progressFill.style.width = `${progress}%`;

		} catch (error) {
			console.error('Помилка при конвертації файлу:', error);
			alert(`Помилка при конвертації ${file.name}: ${error.message}`);
		}
	}

	// Завершення конвертації
	statusText.textContent = 'Конвертація завершена!';
	statusPercentage.textContent = '100%';
	progressFill.style.width = '100%';

	// Розблоковуємо елементи інтерфейсу
	disableUIElements(false);

	// Показуємо кнопку завантаження результатів
	setTimeout(() => {
		downloadResults.classList.remove('hidden');

		// Оновлюємо текст кнопки в залежності від наявності архіву
		if (zipFiles) {
			downloadText.textContent = `Завантажити архів (${convertedFiles.length} файлів)`;
		} else {
			downloadText.textContent = convertedFiles.length === 1
					? 'Завантажити конвертований файл'
					: `Завантажити ${convertedFiles.length} файлів по черзі`;
		}
	}, 500);
}

// Функція для завантаження конвертованих зображень
async function downloadConvertedImages() {
	if (convertedFiles.length === 0) {
		alert('Немає конвертованих файлів для завантаження.');
		return;
	}

	try {
		if (zipFiles && convertedFiles.length > 1) {
			// Завантажуємо як архів
			await downloadAsZip();
		} else {
			// Завантажуємо файли окремо
			downloadFilesSequentially();
		}
	} catch (error) {
		console.error('Помилка при завантаженні файлів:', error);
		alert(`Помилка при завантаженні: ${error.message}`);
	}
}

// Обробник кнопки завантаження результатів
downloadConvertedBtn.addEventListener('click', () => {
	// Блокуємо елементи інтерфейсу під час завантаження
	disableUIElements(true);
	downloadConvertedImages();
});

// Функція для завантаження файлів як ZIP-архіву
async function downloadAsZip() {
	// Оновлюємо статус
	statusText.textContent = 'Створення архіву...';
	statusContainer.classList.remove('hidden');

	// Створюємо новий JSZip об'єкт
	const zip = new JSZip();

	// Додаємо кожен файл до архіву
	convertedFiles.forEach(file => {
		zip.file(file.name, file.blob);
	});

	// Генеруємо архів
	const content = await zip.generateAsync({
		type: 'blob',
		compression: 'DEFLATE',
		compressionOptions: {
			level: 9
		}
	}, (metadata) => {
		// Оновлюємо прогрес
		const progress = Math.round(metadata.percent);
		statusPercentage.textContent = `${progress}%`;
		progressFill.style.width = `${progress}%`;
	});

	// Формуємо ім'я архіву
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
	const zipFileName = `converted_images_${timestamp}.zip`;

	// Створюємо URL для завантаження
	const zipUrl = URL.createObjectURL(content);

	// Створюємо посилання для завантаження і клікаємо по ньому
	const link = document.createElement('a');
	link.href = zipUrl;
	link.download = zipFileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// Звільняємо ресурси
	URL.revokeObjectURL(zipUrl);

	// Оновлюємо статус
	statusText.textContent = 'Архів завантажено!';
	setTimeout(() => {
		statusContainer.classList.add('hidden');
		// Розблоковуємо елементи інтерфейсу
		disableUIElements(false);
	}, 2000);
}

// Функція для послідовного завантаження файлів
function downloadFilesSequentially() {
	// Рекурсивна функція для завантаження по одному файлу
	function downloadNext(index) {
		if (index >= convertedFiles.length) {
			// Завершено всі файли
			statusText.textContent = 'Всі файли завантажено!';
			setTimeout(() => {
				statusContainer.classList.add('hidden');
				// Розблоковуємо елементи інтерфейсу
				disableUIElements(false);
			}, 2000);
			return;
		}

		const file = convertedFiles[index];

		// Оновлюємо статус
		statusText.textContent = `Завантаження ${file.name}...`;
		const progress = Math.round(((index + 1) / convertedFiles.length) * 100);
		statusPercentage.textContent = `${progress}%`;
		progressFill.style.width = `${progress}%`;

		// Створюємо посилання для завантаження і клікаємо по ньому
		const link = document.createElement('a');
		link.href = file.url;
		link.download = file.name;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Переходимо до наступного файлу через невелику затримку
		setTimeout(() => {
			downloadNext(index + 1);
		}, 1000);
	}

	// Починаємо завантаження
	statusContainer.classList.remove('hidden');
	downloadNext(0);
}

// Ініціалізація при завантаженні сторінки
window.addEventListener('DOMContentLoaded', function() {
	// Перевіряємо, який режим активний
	const modeSwitch = document.getElementById('mode-switch-checkbox');
	if (modeSwitch && !modeSwitch.checked) {
		// Якщо це режим конвертера, налаштовуємо початковий стан UI
		convertBtn.disabled = true;
		downloadResults.classList.add('hidden');
		statusContainer.classList.add('hidden');

		// Встановлюємо обробники для drag-and-drop в усій зоні додатка
		document.addEventListener('dragover', (e) => {
			e.preventDefault();
			// Якщо ми в режимі конвертера, активуємо drop zone
			if (!modeSwitch.checked) {
				uploadDropzone.classList.add('drag-over');
			}
		}, false);

		document.addEventListener('drop', (e) => {
			e.preventDefault();
			uploadDropzone.classList.remove('drag-over');

			// Якщо ми в режимі конвертера і перетягнуто файли, обробляємо їх
			if (!modeSwitch.checked && e.dataTransfer.files.length > 0) {
				handleFiles(e.dataTransfer.files);
			}
		}, false);

		document.addEventListener('dragleave', (e) => {
			e.preventDefault();
			// Перевіряємо, чи вийшли за межі вікна
			const rect = document.body.getBoundingClientRect();
			if (e.clientX < rect.left || e.clientX >= rect.right ||
					e.clientY < rect.top || e.clientY >= rect.bottom) {
				uploadDropzone.classList.remove('drag-over');
			}
		}, false);
	}
});