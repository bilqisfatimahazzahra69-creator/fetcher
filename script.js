document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const urlInput = document.getElementById('urlInput');
    const fetchBtn = document.getElementById('fetchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const apiUrlInput = document.getElementById('apiUrlInput');
    const btnText = fetchBtn.querySelector('.btn-text');
    const loader = fetchBtn.querySelector('.loader-inner');

    const resultsContainer = document.getElementById('resultsContainer');
    const resultsSkeleton = document.getElementById('resultsSkeleton');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');

    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    // --- I18N CONFIG ---
    const translations = {
        en: {
            downloader: "Downloader",
            subtitle: "Paste your video link and let Fetcher do the rest.",
            input_placeholder: "Enter URL (TikTok, IG, YouTube...)",
            fetch_btn: "Fetch Media",
            api_placeholder: "API URL Railway (e.g. https://api-production.up.railway.app)",
            api_tooltip: "Click to change API URL",
            media_title: "Video Title",
            section_video: "Video",
            section_audio: "Audio",
            error_generic: "An error occurred. Make sure the URL is correct.",
            history_title: "Recent History",
            history_clear: "Clear All",
            seo_title: "Why Choose Fetcher Downloader?",
            seo_desc: "Fetcher is the best social media video downloader supporting various popular platforms. We make it easy for you to save your favorite content directly to your device.",
            feat_1_title: "No Watermark",
            feat_1_desc: "Get pure videos without annoying watermarks.",
            feat_2_title: "Super Fast",
            feat_2_desc: "Lightning fast video downloading and merging process.",
            feat_3_title: "Mobile Friendly",
            feat_3_desc: "Comfortable interface for both Mobile and Desktop.",
            footer_copy: "&copy; 2026 Fetcher AI. Project for Railway Deployment.",
            bug_report: "Report Bug",
            report_title: "Report Issue",
            report_placeholder: "Describe the issue...",
            report_screenshot: "Take Screenshot",
            report_no_file: "No file selected",
            report_send: "Send Report",
            toast_success: "Success Message",
            toast_copy_success: "Link copied successfully!",
            toast_copy_fail: "Failed to copy link",
            toast_report_sent: "Bug report sent!",
            toast_video_ready: "Video ready to download!",
            preparing_video: "Preparing Video...",
            wait_merging: "Please wait, merging audio...",
            download_now: "DOWNLOAD NOW",
            video_bundled: "Video is bundled and ready!",
            failed_process: "Failed to process video.",
            server_no_resp: "Server not responding.",
            copy_link: "Copy Link",
            high_quality_audio: "High Quality Audio",
            download_full_hd: "DOWNLOAD FULL HD",
            recommended: "Recommended (Video+Audio)",
            media_slides: "Media / Slides",
            btn_fetch_text: "Fetch Media",
            empty_msg_err: "Message cannot be empty!",
            network_err: "Network error!",
            failed_report: "Failed: "
        },
        id: {
            downloader: "Downloader",
            subtitle: "Tempel tautan video Anda dan biarkan Fetcher melakukan sisanya.",
            input_placeholder: "Masukkan URL (TikTok, IG, YouTube...)",
            fetch_btn: "Ambil Media",
            api_placeholder: "API URL Railway (e.g. https://api-production.up.railway.app)",
            api_tooltip: "Klik untuk ubah API URL",
            media_title: "Judul Video",
            section_video: "Video",
            section_audio: "Audio",
            error_generic: "Terjadi kesalahan. Pastikan URL benar.",
            history_title: "Riwayat Terakhir",
            history_clear: "Hapus Semua",
            seo_title: "Mengapa Memilih Fetcher Downloader?",
            seo_desc: "Fetcher adalah alat downloader video sosial media terbaik yang mendukung berbagai platform populer. Kami memberikan kemudahan bagi Anda untuk menyimpan konten favorit langsung ke perangkat.",
            feat_1_title: "Tanpa Watermark",
            feat_1_desc: "Dapatkan video murni tanpa tanda air mengganggu.",
            feat_2_title: "Super Cepat",
            feat_2_desc: "Proses download dan penggabungan video secepat kilat.",
            feat_3_title: "Mobile Friendly",
            feat_3_desc: "Tampilan yang nyaman digunakan di HP maupun Desktop.",
            footer_copy: "&copy; 2026 Fetcher AI. Project for Railway Deployment.",
            bug_report: "Laporkan Bug",
            report_title: "Laporkan Masalah",
            report_placeholder: "Jelaskan masalahnya...",
            report_screenshot: "Ambil Screenshot",
            report_no_file: "Tidak ada file dipilih",
            report_send: "Kirim Laporan",
            toast_success: "Pesan Berhasil",
            toast_copy_success: "Link berhasil disalin!",
            toast_copy_fail: "Gagal menyalin link",
            toast_report_sent: "Laporan bug terkirim!",
            toast_video_ready: "Video siap didownload!",
            preparing_video: "Menyiapkan Video...",
            wait_merging: "Mohon tunggu, sedang menggabung audio...",
            download_now: "DOWNLOAD SEKARANG",
            video_bundled: "Video sudah siap dibundel!",
            failed_process: "Gagal memproses video.",
            server_no_resp: "Server tidak merespons.",
            copy_link: "Salin Link",
            high_quality_audio: "Audio Kualitas Tinggi",
            download_full_hd: "AMBIL FULL HD",
            recommended: "Direkomendasikan (Video+Audio)",
            media_slides: "Media / Slides",
            btn_fetch_text: "Ambil Media",
            empty_msg_err: "Pesan tidak boleh kosong!",
            network_err: "Kesalahan jaringan!",
            failed_report: "Gagal: "
        }
    };

    let currentLang = localStorage.getItem('fetcher_lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('fetcher_lang', lang);
        document.documentElement.lang = lang;

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const icon = el.querySelector('i');
                const text = translations[lang][key];

                if (icon) {
                    // Simpan icon, hapus sisanya, lalu tambah text baru
                    const iconClone = icon.cloneNode(true);
                    el.innerHTML = '';
                    el.appendChild(iconClone);

                    // Gunakan innerHTML untuk text jika ada entity (seperti &copy;)
                    const textSpan = document.createElement('span');
                    textSpan.innerHTML = ' ' + text;
                    el.appendChild(textSpan);
                } else {
                    el.innerHTML = text; // innerHTML supaya &copy; dkk ter-render
                }
            }
        });

        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
    }

    async function detectLanguage() {
        // 1. Cek Parameter URL (?lang=en atau ?lang=id)
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && (langParam === 'en' || langParam === 'id')) {
            setLanguage(langParam);
            return;
        }

        // 2. Cek LocalStorage
        if (localStorage.getItem('fetcher_lang')) {
            setLanguage(localStorage.getItem('fetcher_lang'));
            return;
        }

        // 3. Cek IP (ipapi.co)
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data.country_code === 'ID') {
                setLanguage('id');
            } else {
                setLanguage('en');
            }
        } catch (e) {
            setLanguage('en');
        }
    }

    detectLanguage();

    // UI Elements for results
    const mediaThumbnail = document.getElementById('mediaThumbnail');
    const mediaTitle = document.getElementById('mediaTitle');
    const mediaUploader = document.getElementById('mediaUploader');
    const mediaDuration = document.getElementById('mediaDuration');
    const mediaPlatform = document.getElementById('mediaPlatform');
    const mediaViews = document.getElementById('mediaViews');
    const mediaLikes = document.getElementById('mediaLikes');
    const videoFormats = document.getElementById('videoFormats');
    const audioFormats = document.getElementById('audioFormats');

    // --- API CONFIG & SECURITY ---
    const envUrl = window._env_?.API_BASE_URL;
    let API_BASE_URL = envUrl || window.location.origin;

    // FIX PROTOCOL: Pastikan ada http/https (PENTING!)
    if (API_BASE_URL && !API_BASE_URL.startsWith('http')) {
        const protocol = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1') ? 'http://' : 'https://';
        API_BASE_URL = protocol + API_BASE_URL.replace(/\/$/, "");
    }

    // Hilangkan trailing slash
    API_BASE_URL = API_BASE_URL.replace(/\/$/, "");

    // Update hidden input if exists
    if (apiUrlInput) apiUrlInput.value = API_BASE_URL;

    let AUTH_REQUIRED = false;

    async function initConfig() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/config`);
            if (res.ok) {
                const config = await res.json();
                AUTH_REQUIRED = config.AUTH_REQUIRED;
                // Sync jika server punya URL publik tapi .env kosong
                if (config.PUBLIC_API_URL && !envUrl) {
                    API_BASE_URL = config.PUBLIC_API_URL.replace(/\/$/, "");
                }
                if (AUTH_REQUIRED) console.log('🔐 API Key Protection Active');
            }
        } catch (e) { }
    }
    initConfig();

    // --- UX HELPERS ---
    const showToast = (msg, icon = 'fa-check-circle') => {
        toastMsg.textContent = msg;
        const iconEl = toast.querySelector('i');
        iconEl.className = `fas ${icon}`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast(translations[currentLang].toast_copy_success);
        }).catch(() => {
            showToast(translations[currentLang].toast_copy_fail, 'fa-times-circle');
        });
    };

    const setLoading = (isLoading) => {
        if (isLoading) {
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
            fetchBtn.disabled = true;
            resultsSkeleton.classList.remove('hidden');
            errorState.classList.add('hidden');
            resultsContainer.classList.add('hidden');
        } else {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            fetchBtn.disabled = false;
            resultsSkeleton.classList.add('hidden');
        }
    };

    // --- INPUT LOGIC ---
    urlInput.addEventListener('input', () => {
        clearBtn.classList.toggle('hidden', !urlInput.value);
    });

    clearBtn.addEventListener('click', () => {
        urlInput.value = '';
        clearBtn.classList.add('hidden');
        urlInput.focus();
    });

    // Auto-paste detection (premium feel)
    urlInput.addEventListener('paste', () => {
        setTimeout(handleFetch, 100);
    });

    fetchBtn.addEventListener('click', handleFetch);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleFetch();
    });

    async function handleFetch() {
        const url = urlInput.value.trim();
        if (!url) return;

        setLoading(true);

        const isAudioOnly = url.includes('music.youtube.com') || url.includes('music.apple.com');

        try {
            const apiPath = `${API_BASE_URL}/api/download?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiPath);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || translations[currentLang].error_generic);

            renderResults(data, isAudioOnly);
            addToHistory(data);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function renderResults(data, isAudioOnly = false) {
        mediaThumbnail.src = data.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail';
        mediaTitle.textContent = data.title;
        mediaUploader.textContent = data.uploader ? `@${data.uploader}` : 'Platform Media';
        mediaDuration.textContent = data.duration || '00:00';
        mediaPlatform.textContent = data.platform;

        const views = data.metadata?.views || 0;
        const likes = data.metadata?.likes || 0;
        mediaViews.innerHTML = `<i class="far fa-eye"></i> ${formatNumber(views)}`;
        mediaLikes.innerHTML = `<i class="far fa-heart"></i> ${formatNumber(likes)}`;

        videoFormats.innerHTML = '';
        audioFormats.innerHTML = '';

        // Handle Audio-Only (YouTube Music)
        const videoSection = videoFormats.closest('.section');
        if (isAudioOnly) {
            if (videoSection) videoSection.style.display = 'none';
        } else {
            if (videoSection) videoSection.style.display = 'block';
        }

        const isSlide = data.platform?.includes('Slide') || data.platform?.includes('Photo');

        if (data.download_url && !isSlide) {
            videoFormats.appendChild(createEnhancedItem(data.download_url, translations[currentLang].download_full_hd, translations[currentLang].recommended, 'fa-crown', true));
        }

        const formats = data.media?.all_formats || [];
        const hasImages = formats.some(f => f.vcodec === 'image');

        // Update section header
        const videoHeader = videoFormats.previousElementSibling;
        videoHeader.innerHTML = hasImages ? `<i class="fas fa-images"></i> ${translations[currentLang].media_slides}` : `<i class="fas fa-video"></i> ${translations[currentLang].section_video}`;

        // Render Media (Video or Image)
        formats.filter(f => f.vcodec !== 'none' || f.vcodec === 'image').slice(0, 15).forEach(f => {
            const isImg = f.vcodec === 'image';
            const size = f.filesize ? `(${(f.filesize / 1024 / 1024).toFixed(1)} MB)` : '';
            const icon = isImg ? 'fa-image' : 'fa-video';
            const label = f.quality || f.resolution || (isImg ? 'Photo' : 'Video');

            videoFormats.appendChild(createEnhancedItem(f.url, label, `${f.ext.toUpperCase()} ${size}`, icon));
        });

        // Audio
        formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none').slice(0, 3).forEach(f => {
            const size = f.filesize ? `(${(f.filesize / 1024 / 1024).toFixed(1)} MB)` : '';
            audioFormats.appendChild(createEnhancedItem(f.url, 'High Quality Audio', `${f.ext.toUpperCase()} ${size}`, 'fa-music'));
        });

        resultsContainer.classList.remove('hidden');
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function createEnhancedItem(url, title, meta, icon, isBest = false) {
        const row = document.createElement('div');
        row.className = 'download-row-container'; // Changed wrapper name
        row.style.width = '100%';
        row.style.marginBottom = '15px';

        const rowInner = document.createElement('div');
        rowInner.className = 'download-row';
        rowInner.style.display = 'flex';
        rowInner.style.gap = '8px';
        rowInner.style.alignItems = 'center';

        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = `download-item ${isBest ? 'best-quality' : ''}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'dl-content';
        contentDiv.innerHTML = `
            <div class="format-info">${title}</div>
            <div class="format-meta">${meta}</div>
        `;

        const iconI = document.createElement('i');
        iconI.className = `fas ${icon} dl-icon`;

        a.appendChild(contentDiv);
        a.appendChild(iconI);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-link-btn';
        copyBtn.title = translations[currentLang].copy_link;
        copyBtn.innerHTML = `<i class="far fa-copy"></i>`;
        copyBtn.onclick = (e) => {
            e.preventDefault();
            copyToClipboard(url);
        };

        rowInner.appendChild(a);
        rowInner.appendChild(copyBtn);
        row.appendChild(rowInner);

        // Progress UI for Best Quality
        if (isBest) {
            const progCont = document.createElement('div');
            progCont.className = 'progress-container';
            const progBar = document.createElement('div');
            progBar.className = 'progress-bar-active';
            progCont.appendChild(progBar);
            row.appendChild(progCont);

            a.onclick = (e) => {
                if (a.classList.contains('ready')) return; // Allow normal download
                e.preventDefault();
                startBestDownload(a, progCont, progBar, url);
            };
        }

        return row;
    }

    async function startBestDownload(btn, progCont, progBar, url) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const h = urlParams.get('h');
        const originalUrl = urlParams.get('url');

        btn.classList.add('preparing');
        const info = btn.querySelector('.format-info');
        const meta = btn.querySelector('.format-meta');
        const oldTitle = info.textContent;
        const oldMeta = meta.textContent;

        info.textContent = translations[currentLang].preparing_video;
        meta.textContent = translations[currentLang].wait_merging;
        progCont.style.display = 'block';

        try {
            // Trigger prepare
            await fetch(`${API_BASE_URL}/api/prepare?url=${encodeURIComponent(originalUrl)}&h=${h}`);

            // Poll progress
            const poll = setInterval(async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/progress?taskId=${h}`);
                    const data = await res.json();

                    progBar.style.width = `${data.progress}%`;
                    meta.textContent = `Progress: ${Math.floor(data.progress)}%`;

                    if (data.status === 'done' || data.progress >= 100) {
                        clearInterval(poll);
                        btn.classList.remove('preparing');
                        btn.classList.add('ready');
                        info.textContent = translations[currentLang].download_now;
                        meta.textContent = translations[currentLang].video_bundled;
                        progCont.style.display = 'none';
                        showToast(translations[currentLang].toast_video_ready, 'fa-check');
                    } else if (data.status === 'error') {
                        clearInterval(poll);
                        btn.classList.remove('preparing');
                        info.textContent = 'Gagal';
                        meta.textContent = translations[currentLang].failed_process;
                        showError(translations[currentLang].failed_process);
                    }
                } catch (e) {
                    clearInterval(poll);
                }
            }, 1000);
        } catch (err) {
            btn.classList.remove('preparing');
            info.textContent = oldTitle;
            meta.textContent = oldMeta;
            showError(translations[currentLang].server_no_resp);
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorState.classList.remove('hidden');
    }

    // --- HISTORY LOGIC ---
    function addToHistory(data) {
        let history = JSON.parse(localStorage.getItem('fetcher_history') || '[]');
        const newItem = {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            platform: data.platform,
            url: urlInput.value.trim(),
            time: Date.now()
        };

        // Remove duplicate if exists
        history = history.filter(item => item.id !== data.id);
        history.unshift(newItem);
        history = history.slice(0, 8); // Keep last 8

        localStorage.setItem('fetcher_history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('fetcher_history') || '[]');
        if (history.length === 0) {
            historySection.classList.add('hidden');
            return;
        }

        historySection.classList.remove('hidden');
        historyList.innerHTML = '';

        history.forEach(item => {
            const el = document.createElement('div');
            el.className = 'history-item glass';
            el.innerHTML = `
                <img src="${item.thumbnail}" class="history-thumb" alt="">
                <div class="history-info">
                    <div class="history-title">${item.title}</div>
                    <div class="history-meta">${item.platform} • ${new Date(item.time).toLocaleDateString()}</div>
                </div>
            `;
            el.onclick = () => {
                urlInput.value = item.url;
                clearBtn.classList.remove('hidden');
                handleFetch();
            };
            historyList.appendChild(el);
        });
    }

    clearHistoryBtn.onclick = () => {
        localStorage.removeItem('fetcher_history');
        renderHistory();
    };

    renderHistory(); // Initial load

    // --- BUG REPORT MODAL (RE-LINKED) ---
    const reportModal = document.getElementById('reportModal');
    const openReportBtn = document.getElementById('openReportBtn');
    const closeReportBtn = document.getElementById('closeReportBtn');
    const sendReportBtn = document.getElementById('sendReportBtn');
    const reportMsg = document.getElementById('reportMsg');
    const reportFile = document.getElementById('reportFile');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    openReportBtn.onclick = () => reportModal.classList.remove('hidden');
    closeReportBtn.onclick = () => reportModal.classList.add('hidden');
    window.onclick = (e) => { if (e.target == reportModal) reportModal.classList.add('hidden'); }

    reportFile.onchange = (e) => {
        fileNameDisplay.textContent = e.target.files[0] ? e.target.files[0].name : translations[currentLang].report_no_file;
    };

    sendReportBtn.onclick = async () => {
        const message = reportMsg.value.trim();
        if (!message) return alert(translations[currentLang].empty_msg_err);

        const formData = new FormData();
        formData.append('message', message);
        if (reportFile.files[0]) formData.append('screenshot', reportFile.files[0]);

        const ldr = sendReportBtn.querySelector('.loader-inner');
        const txt = sendReportBtn.querySelector('.btn-text');

        txt.classList.add('hidden');
        ldr.classList.remove('hidden');
        sendReportBtn.disabled = true;

        try {
            const resp = await fetch(`${API_BASE_URL}/api/report`, { method: 'POST', body: formData });
            const res = await resp.json();
            if (res.success) {
                showToast(translations[currentLang].toast_report_sent);
                reportModal.classList.add('hidden');
                reportMsg.value = ''; reportFile.value = '';
                fileNameDisplay.textContent = translations[currentLang].report_no_file;
            } else {
                alert(translations[currentLang].failed_report + res.error);
            }
        } catch (e) { alert(translations[currentLang].network_err); }
        finally {
            txt.classList.remove('hidden');
            ldr.classList.add('hidden');
            sendReportBtn.disabled = false;
        }
    };

    function formatNumber(num) {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
});
