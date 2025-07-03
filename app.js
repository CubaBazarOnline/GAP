// app.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        generateBtn: document.getElementById('generateBtn'),
        copyBtn: document.getElementById('copyBtn'),
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
    elements.nameInput.addEventListener('input', () => validateField(elements.nameInput, 'nameError'));
    elements.phoneInput.addEventListener('input', validatePhone);

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
        if (!validateField(elements.nameInput, 'nameError') || !validatePhone()) return;

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
        elements.adContent.textContent = text;
        elements.resultActions.classList.remove('hidden');
        elements.wordCount.textContent = `${countWords(text)} palabras`;
        elements.wordCount.classList.remove('hidden');
    }

    function countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    async function copyAdToClipboard() {
        try {
            await navigator.clipboard.writeText(elements.adContent.textContent);
            elements.copyBtn.textContent = '¡Copiado!';
            setTimeout(() => { elements.copyBtn.textContent = 'Copiar Anuncio'; }, 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    }

    // History Functions
    function saveToHistory(adText) {
        const history = JSON.parse(localStorage.getItem('adHistory') || '[]');
        if (history.length >= 5) history.pop();
        history.unshift({ text: adText, date: new Date().toLocaleString() });
        localStorage.setItem('adHistory', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('adHistory') || '[]');
        if (history.length === 0) return;

        elements.historyContainer.classList.remove('hidden');
        elements.historyList.innerHTML = '';

        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `<small>${item.date}</small><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.text.split('\n')[0]}</div>`;
            
            historyItem.addEventListener('click', () => displayAd(item.text));
            elements.historyList.appendChild(historyItem);
        });
    }
});