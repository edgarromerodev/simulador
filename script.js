document.addEventListener('DOMContentLoaded', function() {
            const phone = document.getElementById('phone');
            const phoneFrame = document.getElementById('phone-frame');
            const laptopFrame = document.getElementById('laptop-frame');
            const loadings = document.querySelectorAll('.loading');
            const deviceModelSelect = document.getElementById('device-model');
            const urlInput = document.getElementById('url');
            const loadBtn = document.getElementById('load-btn');
            const deviceOptions = document.querySelectorAll('.device-option');
            const phoneContainer = document.getElementById('phone-container');
            const laptopContainer = document.getElementById('laptop-container');
            
            // Función para calcular el zoom necesario para el iframe del portátil
            function calculateLaptopZoom() {
                const laptopScreen = document.querySelector('.laptop-screen-inner');
                const desiredWidth = 1200; // Ancho deseado en px
                const actualWidth = laptopScreen.offsetWidth;
                
                // Solo aplicar zoom si el ancho real es menor que el deseado
                if (actualWidth < desiredWidth) {
                    const zoomLevel = actualWidth / desiredWidth;
                    laptopFrame.style.transform = `scale(${zoomLevel})`;
                    laptopFrame.style.width = `${desiredWidth}px`;
                    laptopFrame.style.height = `${desiredWidth * 0.625}px`; // Relación 16:10
                } else {
                    laptopFrame.style.transform = 'scale(1)';
                    laptopFrame.style.width = '100%';
                    laptopFrame.style.height = '100%';
                }
            }
            
            // Inicialización
            function init() {
                // Mostrar móvil por defecto
                phoneContainer.style.display = 'block';
                laptopContainer.style.display = 'none';
                
                // Activar opción móvil
                document.querySelector('.device-option[data-device="phone"]').classList.add('active');
                
                // Cargar URL inicial
                loadURL(urlInput.value);
                
                // Calcular zoom inicial para portátil
                calculateLaptopZoom();
                
                // Recalcular zoom cuando cambie el tamaño de la ventana
                window.addEventListener('resize', calculateLaptopZoom);
            }
            
            // Cargar URL en ambos dispositivos
            function loadURL(url) {
                // Mostrar loading
                loadings.forEach(loading => {
                    loading.style.display = 'flex';
                    loading.innerHTML = '<div class="spinner"></div><span>Cargando...</span>';
                });
                
                // Asegurar protocolo http/https
                let finalURL = url;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    finalURL = 'http://' + url;
                }
                
                // Cargar en ambos iframes
                phoneFrame.src = finalURL;
                laptopFrame.src = finalURL;
                
                // Ocultar loading al cargar
                phoneFrame.onload = () => {
                    document.querySelector('#phone-container .loading').style.display = 'none';
                };
                
                laptopFrame.onload = () => {
                    document.querySelector('#laptop-container .loading').style.display = 'none';
                    // Recalcular zoom después de cargar
                    calculateLaptopZoom();
                };
                
                // Manejar errores
                phoneFrame.onerror = () => {
                    document.querySelector('#phone-container .loading').innerHTML = '<div class="spinner"></div><span>Error al cargar la página</span>';
                };
                
                laptopFrame.onerror = () => {
                    document.querySelector('#laptop-container .loading').innerHTML = '<div class="spinner"></div><span>Error al cargar la página</span>';
                };
            }
            
            // Cambiar modelo de teléfono
            deviceModelSelect.addEventListener('change', function() {
                phone.classList.remove('iphone', 'samsung', 'pixel');
                phone.classList.add(this.value);
            });
            
            // Selector de dispositivo
            deviceOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // Quitar activo de todas las opciones
                    deviceOptions.forEach(opt => opt.classList.remove('active'));
                    // Activar la seleccionada
                    this.classList.add('active');
                    
                    const device = this.dataset.device;
                    if (device === 'phone') {
                        phoneContainer.style.display = 'block';
                        laptopContainer.style.display = 'none';
                    } else {
                        phoneContainer.style.display = 'none';
                        laptopContainer.style.display = 'block';
                        // Recalcular zoom al cambiar a portátil
                        setTimeout(calculateLaptopZoom, 100);
                    }
                });
            });
            
            // Botón de carga
            loadBtn.addEventListener('click', function() {
                const url = urlInput.value.trim();
                if (url) {
                    loadURL(url);
                } else {
                    alert('Por favor ingresa una URL válida');
                }
            });
            
            // Cargar con Enter
            urlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loadBtn.click();
                }
            });
            
            // Iniciar
            init();
        });