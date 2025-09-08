class ThumbnailGenerator {
    constructor() {
        this.form = document.getElementById('thumbnailForm');
        this.loadingDiv = document.getElementById('loading');
        this.resultDiv = document.getElementById('result');
        this.errorDiv = document.getElementById('error');
        this.thumbnailImg = document.getElementById('generatedThumbnail');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImg = document.getElementById('previewImg');
        this.placeholder = document.getElementById('placeholder');
        this.fileInput = document.getElementById('imageFile');
        this.titleInput = document.getElementById('title');
        
        this.apiUrl = '/api/v1/thumbnail';
        this.currentImageBlob = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.downloadBtn.addEventListener('click', () => this.downloadThumbnail());
        this.resetBtn.addEventListener('click', () => this.resetForm());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewImg.src = e.target.result;
                this.imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            this.hideImagePreview();
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const fileInput = document.getElementById('imageFile');
        const titleInput = document.getElementById('title');
        
        if (!fileInput.files[0] || !titleInput.value.trim()) {
            this.showError('Please select an image and enter a title.');
            return;
        }

        this.showLoading();
        this.hideError();
        this.hideResult();

        try {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('title', titleInput.value.trim());

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const imageBlob = await response.blob();
            this.currentImageBlob = imageBlob;
            
            const imageUrl = URL.createObjectURL(imageBlob);
            this.thumbnailImg.src = imageUrl;
            
            this.hideLoading();
            this.showResult();
            this.hidePlaceholder();
            
        } catch (error) {
            this.hideLoading();
            this.showError(`Failed to generate thumbnail: ${error.message}`);
            console.error('Error generating thumbnail:', error);
        }
    }

    downloadThumbnail() {
        if (!this.currentImageBlob) {
            this.showError('No thumbnail to download');
            return;
        }

        const url = URL.createObjectURL(this.currentImageBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `thumbnail-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    resetForm() {
        this.form.reset();
        this.hideResult();
        this.hideError();
        this.hideLoading();
        this.hideImagePreview();
        this.showPlaceholder();
        
        if (this.thumbnailImg.src) {
            URL.revokeObjectURL(this.thumbnailImg.src);
            this.thumbnailImg.src = '';
        }
        
        this.currentImageBlob = null;
    }

    hideImagePreview() {
        this.imagePreview.classList.add('hidden');
        this.previewImg.src = '';
    }

    showPlaceholder() {
        this.placeholder.classList.remove('hidden');
    }

    hidePlaceholder() {
        this.placeholder.classList.add('hidden');
    }

    showLoading() {
        this.loadingDiv.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingDiv.classList.add('hidden');
    }

    showResult() {
        this.resultDiv.classList.remove('hidden');
    }

    hideResult() {
        this.resultDiv.classList.add('hidden');
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        this.errorDiv.classList.remove('hidden');
    }

    hideError() {
        this.errorDiv.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThumbnailGenerator();
});