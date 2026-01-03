import { useEffect, useRef, useContext } from "react";
import axios from "axios";
import speak from "../utils/speak";
import { UserDataContext } from "../context/UserContext";

const WAKE_WORDS = ["jarvis", "hey jarvis", "hello jarvis"];

const useJarvisVoice = () => {
  const recognitionRef = useRef(null);
  const waitingForCommand = useRef(false);
  const commandTimeoutRef = useRef(null);
  const accumulatedTranscriptRef = useRef("");
  const { serverURL } = useContext(UserDataContext);

  // Function to remove wake words from transcript
  const removeWakeWords = (text) => {
    let cleaned = text.toLowerCase().trim();
    WAKE_WORDS.forEach((wakeWord) => {
      cleaned = cleaned.replace(new RegExp(wakeWord, "gi"), "").trim();
    });
    return cleaned;
  };

  // Function to start/restart recognition
  const startRecognition = () => {
    if (!recognitionRef.current) return;
    
    try {
      if (recognitionRef.current.state === "running") {
        recognitionRef.current.stop();
      }
      
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Recognition might already be starting, ignore error
          console.log("Recognition already starting...");
        }
      }, 100);
    } catch (e) {
      console.error("Error starting recognition:", e);
    }
  };

  const sendCommand = async (command) => {
    // Clear any pending timeouts
    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current);
      commandTimeoutRef.current = null;
    }

    // Clean the command - remove wake words
    const cleanedCommand = removeWakeWords(command).trim();

    if (!cleanedCommand || cleanedCommand.length === 0) {
      waitingForCommand.current = false;
      startRecognition();
      return;
    }

    console.log("🎤 Sending command:", cleanedCommand);
    waitingForCommand.current = false;

    try {
      // Get token from localStorage if available
      const token = localStorage.getItem("token");
      const config = {
        withCredentials: true,
      };
      
      // Add Authorization header if token exists
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await axios.post(
        `${serverURL || "http://localhost:8000"}/api/user/assistant`,
        { command: cleanedCommand },
        config
      );

      handleResponse(res.data);
    } catch (err) {
      console.error("Command error:", err);
      speak("Something went wrong");
    } finally {
      // Restart recognition after processing
      accumulatedTranscriptRef.current = "";
      startRecognition();
    }
  };

  const handleResponse = (data) => {
    if (!data?.type) return;

    speak(data.response);

    switch (data.type) {
      case "google_search":
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(
            data.userinput
          )}`
        );
        break;

      case "youtube_open":
        window.open("https://www.youtube.com");
        break;

      case "youtube_search":
      case "youtube_play":
        // If userinput is empty or just "youtube", open YouTube homepage
        const youtubeQuery = data.userinput?.trim();
        if (!youtubeQuery || youtubeQuery.toLowerCase() === "youtube") {
          window.open("https://www.youtube.com");
        } else {
          window.open(
            `https://www.youtube.com/results?search_query=${encodeURIComponent(
              youtubeQuery
            )}`
          );
        }
        break;

      case "instagram_open":
        window.open("https://www.instagram.com");
        break;

      case "facebook_open":
        window.open("https://www.facebook.com");
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true; // Enable interim results to get faster feedback
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      // Concatenate ALL results to get the full transcript
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        fullTranscript += transcript + " ";
      }
      
      fullTranscript = fullTranscript.trim().toLowerCase();
      const isFinal = event.results[event.results.length - 1].isFinal;

      // Only process when we have a final result
      if (!isFinal) {
        // Show interim results but don't process yet
        console.log("🎤 Listening...", fullTranscript);
        return;
      }

      console.log("🎤 Final transcript:", fullTranscript);

      // STEP 1: Check for wake word
      if (!waitingForCommand.current) {
        const hasWakeWord = WAKE_WORDS.some((w) => 
          fullTranscript.includes(w.toLowerCase())
        );
        
        if (hasWakeWord) {
          waitingForCommand.current = true;
          accumulatedTranscriptRef.current = "";
          speak("yes, how can I help you?");
          
          // Clear any existing timeout
          if (commandTimeoutRef.current) {
            clearTimeout(commandTimeoutRef.current);
          }
          return;
        }
        return;
      }

      // STEP 2: We're waiting for command
      accumulatedTranscriptRef.current += " " + fullTranscript;
      accumulatedTranscriptRef.current = accumulatedTranscriptRef.current.trim();

      // Clear existing timeout
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
      }

      // Wait a bit more for additional speech (debounce)
      commandTimeoutRef.current = setTimeout(() => {
        if (accumulatedTranscriptRef.current) {
          sendCommand(accumulatedTranscriptRef.current);
        }
      }, 800); // Wait 800ms after speech ends before processing
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      
      // If error is "no-speech", just restart
      if (e.error === "no-speech") {
        startRecognition();
      }
    };

    recognition.onend = () => {
      // Automatically restart recognition when it ends
      if (recognitionRef.current) {
        startRecognition();
      }
    };

    // Start recognition
    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [serverURL]);

  return null;
};

export default useJarvisVoice;
