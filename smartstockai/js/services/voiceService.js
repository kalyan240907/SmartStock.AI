// SmartStock AI - Robust Multilingual Voice Recognition & Speech Synthesis Service
window.SmartStock = window.SmartStock || {};

(function() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const synth = window.speechSynthesis || null;

  let recognition = null;
  let isListening = false;
  let listeners = [];
  let cachedVoices = [];

  // Pre-cache voices when available (Chrome/Edge loads voices asynchronously)
  function loadVoices() {
    if (!synth) return;
    try {
      cachedVoices = synth.getVoices() || [];
    } catch (e) {
      console.warn('Voice list load error', e);
    }
  }

  if (synth) {
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }

  const LANG_LOCALE_MAP = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ml: 'ml-IN',
    kn: 'kn-IN'
  };

  const VoiceService = {
    isSupported() {
      return !!SpeechRecognition;
    },

    isTTSSupported() {
      return !!synth;
    },

    subscribe(callback) {
      listeners.push(callback);
      return () => {
        listeners = listeners.filter(fn => fn !== callback);
      };
    },

    notify(event, data) {
      listeners.forEach(fn => {
        try { fn(event, data); } catch (e) { console.error('Voice listener error', e); }
      });
    },

    /**
     * Start listening to user's speech in selected language
     */
    startListening(langCode = 'en') {
      if (!SpeechRecognition) {
        this.notify('error', 'Voice input is not supported in this browser. Please use the manual command box.');
        return false;
      }

      try {
        if (recognition) {
          try { recognition.abort(); } catch (e) {}
        }

        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        const locale = LANG_LOCALE_MAP[langCode] || 'en-IN';
        recognition.lang = locale;

        recognition.onstart = () => {
          isListening = true;
          this.notify('start', { lang: locale });
        };

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          const isFinal = event.results[event.results.length - 1].isFinal;
          this.notify('result', { transcript, isFinal });

          if (isFinal) {
            this.handleParsedCommand(transcript, langCode);
          }
        };

        recognition.onerror = (event) => {
          isListening = false;
          this.notify('error', `Voice error (${event.error}). You can also type commands in the box below.`);
        };

        recognition.onend = () => {
          isListening = false;
          this.notify('end', null);
        };

        recognition.start();
        return true;
      } catch (err) {
        isListening = false;
        this.notify('error', 'Could not open microphone: ' + err.message);
        return false;
      }
    },

    stopListening() {
      if (recognition && isListening) {
        try { recognition.stop(); } catch (e) {}
        isListening = false;
        this.notify('end', null);
      }
    },

    getListeningStatus() {
      return isListening;
    },

    /**
     * Speak text aloud in the designated language
     */
    speak(text, langCode = 'en') {
      if (!synth || !text) return;

      try {
        synth.cancel(); // Cancel any ongoing speech

        const locale = LANG_LOCALE_MAP[langCode] || 'en-IN';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale;
        utterance.rate = 0.92; // Clear, comfortable speaking pace
        utterance.pitch = 1.0;

        // Ensure voices are loaded
        if (cachedVoices.length === 0) {
          loadVoices();
        }

        // Try exact locale match first (e.g. ta-IN, hi-IN), then language prefix (ta, hi, te)
        const primaryPrefix = locale.split('-')[0];
        let matchedVoice = cachedVoices.find(v => v.lang === locale || v.lang.replace('_', '-') === locale);
        
        if (!matchedVoice) {
          matchedVoice = cachedVoices.find(v => v.lang.toLowerCase().startsWith(primaryPrefix));
        }

        // Also check voice name for Indian language tags if lang code isn't in standard RFC format
        if (!matchedVoice && primaryPrefix !== 'en') {
          const langNames = {
            ta: 'tamil',
            hi: 'hindi',
            te: 'telugu',
            kn: 'kannada',
            ml: 'malayalam'
          };
          const targetName = langNames[primaryPrefix];
          if (targetName) {
            matchedVoice = cachedVoices.find(v => v.name.toLowerCase().includes(targetName));
          }
        }

        // Fallback to Indian English voice if no regional voice is installed on OS
        if (!matchedVoice) {
          matchedVoice = cachedVoices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        synth.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error', e);
      }
    },

    stopSpeaking() {
      if (synth) {
        try { synth.cancel(); } catch (e) {}
      }
    },

    /**
     * Parse natural language voice commands in all 6 languages
     */
    handleParsedCommand(rawText, langCode) {
      const text = rawText.trim().toLowerCase();

      // 1. Language Change Commands
      if (text.includes('tamil') || text.includes('தமிழ்')) {
        this.notify('command', { action: 'change_language', lang: 'ta', raw: rawText });
        return;
      }
      if (text.includes('hindi') || text.includes('हिन्दी') || text.includes('हिंदी')) {
        this.notify('command', { action: 'change_language', lang: 'hi', raw: rawText });
        return;
      }
      if (text.includes('english') || text.includes('ஆங்கிலம்') || text.includes('अंग्रेजी')) {
        this.notify('command', { action: 'change_language', lang: 'en', raw: rawText });
        return;
      }
      if (text.includes('telugu') || text.includes('తెలుగు')) {
        this.notify('command', { action: 'change_language', lang: 'te', raw: rawText });
        return;
      }
      if (text.includes('malayalam') || text.includes('മലയാളം')) {
        this.notify('command', { action: 'change_language', lang: 'ml', raw: rawText });
        return;
      }
      if (text.includes('kannada') || text.includes('ಕನ್ನಡ')) {
        this.notify('command', { action: 'change_language', lang: 'kn', raw: rawText });
        return;
      }

      // 2. Low Stock Alerts
      if (
        text.includes('low stock') || text.includes('shortage') || text.includes('running low') ||
        text.includes('குறைந்த இருப்பு') || text.includes('கம்மி') || text.includes('சரக்கு குறைவு') ||
        text.includes('कम स्टॉक') || text.includes('अलर्ट') || text.includes('कमी') ||
        text.includes('తక్కువ స్టాక్') || text.includes('స్టాక్ తక్కువ') ||
        text.includes('കുറഞ്ഞ സ്റ്റോക്ക്') || text.includes('സ്റ്റോക്ക് കുറവാണ്') ||
        text.includes('ಕಡಿಮೆ ಸ್ಟಾಕ್') || text.includes('ಸ್ಟಾಕ್ ಕಡಿಮೆ')
      ) {
        this.notify('command', { action: 'show_low_stock', raw: rawText });
        return;
      }

      // 3. Stock Inquiry / Show All Stock
      if (
        text.includes('how much stock') || text.includes('available stock') || text.includes('my stock') || text.includes('show stock') ||
        text.includes('இருப்பு எவ்வளவு') || text.includes('சரக்கு காட்டு') || text.includes('என் சரக்கு') ||
        text.includes('स्टॉक कितना') || text.includes('मेरा स्टॉक') || text.includes('स्टॉक दिखाओ') ||
        text.includes('ఎంత స్టాక్ ఉంది') || text.includes('నా స్టాక్') ||
        text.includes('എത്ര സ്റ്റോക്ക്') || text.includes('എന്റെ സ്റ്റോക്ക്') ||
        text.includes('ಎಷ್ಟು ಸ್ಟಾಕ್ ಇದೆ') || text.includes('ನನ್ನ ಸ್ಟಾಕ್')
      ) {
        this.notify('command', { action: 'show_all_stock', raw: rawText });
        return;
      }

      // 4. Find Supplier / B2B Trade Network
      if (
        text.includes('supplier') || text.includes('find business') || text.includes('other business') || text.includes('trade') ||
        text.includes('வியாபாரி') || text.includes('கடை தேடு') || text.includes('விற்பனையாளர்') ||
        text.includes('सप्लायर') || text.includes('व्यापारी ढूंढो') || text.includes('खरीदना') ||
        text.includes('సరఫరాదారు') || text.includes('వ్యాపారి') ||
        text.includes('സപ്ലയർ') || text.includes('വ്യാപാരി') ||
        text.includes('ಪೂರೈಕೆದಾರ') || text.includes('ವ್ಯಾಪಾರಿ ಹುಡುಕಿ')
      ) {
        this.notify('command', { action: 'find_supplier', raw: rawText });
        return;
      }

      // 5. Help / Explain Page
      if (
        text.includes('explain') || text.includes('help') || text.includes('how to use') ||
        text.includes('விளக்கு') || text.includes('உதவி') || text.includes('சொல்லு') ||
        text.includes('समझाओ') || text.includes('मदद') || text.includes('सहायता') ||
        text.includes('సహాయం') || text.includes('వివరించు') ||
        text.includes('സഹായം') || text.includes('വിശദീകരിക്കുക') ||
        text.includes('ಸಹಾಯ') || text.includes('ವಿವರಿಸಿ')
      ) {
        this.notify('command', { action: 'explain_page', raw: rawText });
        return;
      }

      // 6. Add Stock Voice Command Pattern: "Add 20 bags of rice" or "20 மூட்டை அரிசி சேர்"
      const numMatch = text.match(/\d+/);
      const hasAddWord = text.includes('add') || text.includes('சேர்') || text.includes('जोड़ें') ||
                         text.includes('చేర్చు') || text.includes('ചേർക്കുക') || text.includes('ಸೇರಿಸಿ');

      if (hasAddWord) {
        let qty = numMatch ? parseInt(numMatch[0], 10) : 10;
        let productName = 'Item';

        if (text.includes('rice') || text.includes('அரிசி') || text.includes('चावल') || text.includes('బియ్యం') || text.includes('അരി') || text.includes('ಅಕ್ಕಿ')) {
          productName = 'Sona Masoori Raw Rice (25kg Bag)';
        } else if (text.includes('wheat') || text.includes('atta') || text.includes('கோதுமை') || text.includes('गेहूं') || text.includes('గోధుమ') || text.includes('ഗോതമ്പ്') || text.includes('ಗೋಧಿ')) {
          productName = 'Chakki Fresh Whole Wheat Atta (10kg Bag)';
        } else if (text.includes('oil') || text.includes('எண்ணெய்') || text.includes('तेल') || text.includes('నూనె') || text.includes('എണ്ണ') || text.includes('ಎಣ್ಣೆ')) {
          productName = 'Refined Sunflower Cooking Oil (1L Pouch)';
        } else if (text.includes('dal') || text.includes('பருப்பு') || text.includes('दाल') || text.includes('పప్పు') || text.includes('പരിപ്പ്') || text.includes('ಬೇಳೆ')) {
          productName = 'Unpolished Premium Toor Dal (1kg Pkt)';
        } else if (text.includes('paneer') || text.includes('பன்னீர்') || text.includes('पनीर') || text.includes('పనీర్')) {
          productName = 'Fresh Malai Paneer (5kg Block)';
        } else if (text.includes('milk') || text.includes('பால்') || text.includes('दूध') || text.includes('పాలు') || text.includes('പാൽ') || text.includes('ಹಾಲು')) {
          productName = 'Standardized Whole Cow Milk (10L Can)';
        } else if (text.includes('wire') || text.includes('copper') || text.includes('கம்பி') || text.includes('तांबा') || text.includes('వైర్')) {
          productName = 'High-Purity Copper Magnet Wire (0.8mm Coil, 50kg)';
        } else if (text.includes('fabric') || text.includes('cotton') || text.includes('துணி') || text.includes('कपड़ा') || text.includes('బట్ట')) {
          productName = '100% Combed Cotton Fabric 40s (100 Meter Roll)';
        }

        this.notify('command', {
          action: 'add_product_voice',
          quantity: qty,
          productName,
          raw: rawText
        });
        return;
      }

      // Default Fallback
      this.notify('command', { action: 'unknown', raw: rawText });
    }
  };

  window.SmartStock.VoiceService = VoiceService;
})();
