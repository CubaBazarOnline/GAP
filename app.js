document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        generateBtn: document.getElementById('generateBtn'),
        copyBtn: document.getElementById('copyBtn'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        adContent: document.getElementById('adContent'),
        resultActions: document.getElementById('resultActions'),
        historyContainer: document.getElementById('historyContainer'),
        historyList: document.getElementById('historyList'),
        wordCount: document.getElementById('wordCount'),
        nameInput: document.getElementById('affiliateName'),
        phoneInput: document.getElementById('phoneNumber'),
        specialOffer: document.getElementById('specialOffer'),
        customMessage: document.getElementById('customMessage')
    };

    // Event Listeners
    elements.generateBtn.addEventListener('click', generateAd);
    elements.copyBtn.addEventListener('click', copyAdToClipboard);
    elements.clearHistoryBtn.addEventListener('click', clearHistory);
    elements.nameInput.addEventListener('input', () => validateField(elements.nameInput, 'nameError'));
    elements.phoneInput.addEventListener('input', validatePhone);
    
    // Mejorar accesibilidad con eventos de teclado
    elements.generateBtn.addEventListener('keyup', (e) => e.key === 'Enter' && generateAd());
    elements.copyBtn.addEventListener('keyup', (e) => e.key === 'Enter' && copyAdToClipboard());
    elements.clearHistoryBtn.addEventListener('keyup', (e) => e.key === 'Enter' && clearHistory());

    // Initialize
    loadHistory();

    // Validation Functions
    function validateField(field, errorId) {
        const errorElement = document.getElementById(errorId);
        const isValid = field.value.trim() !== '';
        
        field.classList.toggle('is-invalid', !isValid);
        errorElement.style.display = isValid ? 'none' : 'block';
        return isValid;
    }

    function validatePhone() {
        const errorElement = document.getElementById('phoneError');
        const phoneRegex = /^[0-9]{8}$/;
        const isValid = phoneRegex.test(elements.phoneInput.value);
        
        elements.phoneInput.classList.toggle('is-invalid', !isValid);
        errorElement.style.display = isValid ? 'none' : 'block';
        return isValid;
    }

    // Ad Generation
    function generateAd() {
        if (!validateField(elements.nameInput, 'nameError') || !validatePhone()) {
            // Mejor feedback para errores
            if (!validateField(elements.nameInput, 'nameError')) {
                elements.nameInput.focus();
            } else if (!validatePhone()) {
                elements.phoneInput.focus();
            }
            return;
        }

        const adData = {
            name: elements.nameInput.value.trim(),
            phone: '+53' + elements.phoneInput.value.trim(),
            tone: document.querySelector('input[name="tone"]:checked').value,
            format: document.querySelector('input[name="format"]:checked').value,
            specialOffer: elements.specialOffer.value.trim(),
            customMessage: elements.customMessage.value.trim()
        };

        const adText = createAdContent(adData);
        displayAd(adText);
        saveToHistory(adText);
    }

    function createAdContent({ name, phone, tone, format, specialOffer, customMessage }) {
        const templates = {
            simple: `¿SABÍAS QUE PUEDES TENER TU PROPIA PÁGINA WEB PROFESIONAL EN CUBA?

Con CubaHostPro puedes tener tu página web profesional en CubaHostPro con todas las ventajas:
- Presencia profesional en internet
- Diseño adaptado a tus necesidades
- Soporte técnico especializado

${specialOffer ? `\nOFERTA EXCLUSIVA: ${specialOffer.toUpperCase()}\n` : ''}
Contacta a ${name.toUpperCase()} hoy mismo:
📞 ${phone}
🌐 https://cubahostpro.com

${customMessage ? `\nNOTA: ${customMessage}` : ''}`,

            lista: `🚀 BENEFICIOS DE TU PÁGINA WEB CON CUBAHOSTPRO 🚀

🔹 Presencia profesional en internet
🔹 Diseño adaptado a tus necesidades
🔹 Soporte técnico especializado
🔹 Hosting rápido y seguro en Cuba
🔹 Dominio .com.cu incluido

${specialOffer ? `\n🔥 OFERTA ESPECIAL: ${specialOffer} 🔥\n` : ''}
📌 ¿Por qué elegirnos?
✔ 100% cubano
✔ Soporte 24/7
✔ Resultados garantizados

📱 CONTACTO:
${name}
${phone}
https://cubahostpro.com

${customMessage ? `\n💡 ${customMessage}` : ''}`,

            testimonio: `"Desde que creé mi página web con CubaHostPro, mi negocio ha crecido exponencialmente. Ahora mis clientes me encuentran fácilmente y mi imagen profesional ha mejorado notablemente."

- ${name}, cliente satisfecho de CubaHostPro

¿Quieres los mismos resultados para tu negocio?

${specialOffer ? `\n❗ APROVECHA NUESTRA OFERTA: ${specialOffer} ❗\n` : ''}
Contáctanos hoy:
📞 ${phone}
🌍 https://cubahostpro.com

${customMessage ? `\nℹ ${customMessage}` : ''}`,

            pregunta: `¿SABÍAS QUE EL 85% DE LOS CLIENTES BUSCAN NEGOCIOS EN INTERNET ANTES DE COMPRAR?

¿Quieres que te encuentren fácilmente?
¿Necesitas una presencia profesional en línea?
¿Buscas expandir tu negocio en Cuba?

📢 CON CUBAHOSTPRO PUEDES TENER:
→ Presencia profesional en internet
→ Diseño adaptado a tus necesidades
→ Soporte técnico especializado

${specialOffer ? `\n🎁 OFERTA LIMITADA: ${specialOffer} 🎁\n` : ''}
✆ CONTACTA A TU ASESOR:
${name}
${phone}
https://cubahostpro.com

${customMessage ? `\n🌟 ${customMessage}` : ''}`
        };

        let adText = templates[format] || templates.simple;
        adText = applyTone(adText, tone);
        return adText;
    }

    function applyTone(text, tone) {
        const toneModifiers = {
            profesional: t => t.toUpperCase(),
            amigable: t => t.replace(/!/g, '! 😊').replace(/\?/g, '? 👍').replace(/→/g, '👉').replace(/📌/g, '✨'),
            urgente: t => t.replace(/OFERTA/g, '🔥 OFERTA 🔥').replace(/ahora/g, '¡AHORA MISMO!').replace(/(\d{2}%)/g, '$1 DE DESCUENTO') + '\n\n⏳ OFERTA POR TIEMPO LIMITADO ⏳',
            emocional: t => "💖 " + t.replace(/\n/g, "\n💫 ").replace(/\./g, ' ❤️') + '\n\n✨ No pierdas esta oportunidad de crecer tu negocio ✨'
        };

        return toneModifiers[tone] ? toneModifiers[tone](text) : text;
    }

    // UI Functions
    function displayAd(text) {
        elements.adContent.innerHTML = ''; // Limpiar contenido previo
        const pre = document.createElement('pre');
        pre.textContent = text;
        elements.adContent.appendChild(pre);
        
        elements.resultActions.classList.remove('hidden');
        elements.wordCount.textContent = `${countWords(text)} palabras`;
        elements.wordCount.classList.remove('hidden');
        
        // Auto-enfocar el botón de copiar para mejor accesibilidad
        elements.copyBtn.focus();
    }

    function countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    async function copyAdToClipboard() {
        try {
            await navigator.clipboard.writeText(elements.adContent.textContent);
            elements.copyBtn.textContent = '¡Copiado!';
            elements.copyBtn.setAttribute('aria-label', 'Anuncio copiado al portapapeles');
            setTimeout(() => { 
                elements.copyBtn.textContent = 'Copiar Anuncio';
                elements.copyBtn.setAttribute('aria-label', 'Copiar anuncio al portapapeles');
            }, 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            elements.copyBtn.textContent = 'Error al copiar';
            setTimeout(() => { elements.copyBtn.textContent = 'Copiar Anuncio'; }, 2000);
        }
    }

    // History Functions
    function saveToHistory(adText) {
        const history = JSON.parse(localStorage.getItem('adHistory') || '[]');
        
        // Evitar duplicados consecutivos
        if (history.length > 0 && history[0].text === adText) {
            return;
        }
        
        if (history.length >= 5) history.pop();
        history.unshift({ 
            text: adText, 
            date: new Date().toLocaleString(),
            id: Date.now() // ID único para cada item
        });
        localStorage.setItem('adHistory', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('adHistory') || '[]');
        if (history.length === 0) {
            elements.historyContainer.classList.add('hidden');
            return;
        }

        elements.historyContainer.classList.remove('hidden');
        elements.historyList.innerHTML = '';

        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.tabIndex = 0;
            historyItem.setAttribute('role', 'button');
            historyItem.setAttribute('aria-label', `Anuncio generado el ${item.date}`);
            historyItem.dataset.id = item.id;
            
            const dateSpan = document.createElement('small');
            dateSpan.textContent = item.date;
            
            const contentPreview = document.createElement('div');
            contentPreview.style.whiteSpace = 'nowrap';
            contentPreview.style.overflow = 'hidden';
            contentPreview.style.textOverflow = 'ellipsis';
            contentPreview.textContent = item.text.split('\n')[0];
            
            // Botón de editar
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.style.marginLeft = 'auto';
            editBtn.style.fontSize = '12px';
            editBtn.style.padding = '4px 8px';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editHistoryItem(item);
            });
            
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '8px';
            container.appendChild(dateSpan);
            container.appendChild(contentPreview);
            container.appendChild(editBtn);
            
            historyItem.appendChild(container);
            historyItem.addEventListener('click', () => displayAd(item.text));
            historyItem.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    displayAd(item.text);
                }
            });
            
            elements.historyList.appendChild(historyItem);
        });
    }

    function clearHistory() {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
            localStorage.removeItem('adHistory');
            elements.historyContainer.classList.add('hidden');
        }
    }

    function editHistoryItem(item) {
        // Extraer datos del anuncio para edición
        const lines = item.text.split('\n');
        const nameMatch = lines.find(line => line.includes('Contacta a') || line.includes('CONTACTO:') || line.includes('Contáctanos hoy'))?.match(/Contacta a (.+?) hoy|CONTACTO:\s*(.+?)\s*$|Contáctanos hoy/);
        const phoneMatch = lines.find(line => line.includes('📞') || line.includes('✆'))?.match(/📞 (.+?)\s*$|✆ (.+?)\s*$/);
        
        // Llenar el formulario con los datos del historial
        if (nameMatch) {
            elements.nameInput.value = (nameMatch[1] || nameMatch[2] || '').replace(/[A-Z]/g, '').trim();
        }
        
        if (phoneMatch) {
            const phone = (phoneMatch[1] || phoneMatch[2] || '').replace('+53', '').trim();
            elements.phoneInput.value = phone;
        }
        
        // Detectar oferta especial
        const offerLine = lines.find(line => line.includes('OFERTA') || '');
        if (offerLine) {
            const offerMatch = offerLine.match(/OFERTA[^\w]*(.+?)[^\w]*$/);
            if (offerMatch) {
                elements.specialOffer.value = offerMatch[1].replace(/[^\w\s%]/g, '').trim();
            }
        }
        
        // Detectar mensaje personalizado
        const customMsgLine = lines.find(line => line.includes('NOTA:') || line.includes('💡') || line.includes('ℹ') || line.includes('🌟'));
        if (customMsgLine) {
            elements.customMessage.value = customMsgLine.split(':').slice(1).join(':').trim();
        }
        
        // Enfocar el primer campo para edición
        elements.nameInput.focus();
    }
});