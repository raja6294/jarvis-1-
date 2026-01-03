const speak = (text, lang = "en-IN") => {
  if (!text) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1.2;

  const voices = speechSynthesis.getVoices();
  const female = voices.find(v =>
    v.lang.includes("en") && v.name.toLowerCase().includes("female")
  );

  if (female) utterance.voice = female;

  speechSynthesis.speak(utterance);
};

export default speak;
