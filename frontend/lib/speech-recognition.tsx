import SpeechToText from 'speech-to-text';

interface VoiceRecognitionOptions {
  onResult: (text: string) => void;
  onError: (error: any) => void;
  onListening: (isListening: boolean) => void;
  language?: string;
}

class VoiceRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private options: VoiceRecognitionOptions;
  private activationPhrases: string[] = [
    'hello assistant', // English
    'হ্যালো অ্যাসিস্ট্যান্ট', // Bengali
    'হ্যালো সহায়ক', // Alternative Bengali
    'সহায়ক', // Short Bengali
  ];

  constructor(options: VoiceRecognitionOptions) {
    this.options = options;
    this.initRecognition();
  }

  private initRecognition() {
    try {
      // Initialize speech recognition
      this.recognition = new SpeechToText(this.options.language || 'en-US, bn-BD');
      
      // Set up event handlers
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Speech recognized:", transcript);
        this.options.onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
        this.options.onError(event);
        this.isListening = false;
        this.options.onListening(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.options.onListening(false);
      };
      
      console.log("Speech recognition initialized");
    } catch (error) {
      console.error("Failed to initialize speech recognition:", error);
      this.options.onError(error);
    }
  }

  public startContinuousListening() {
    if (!this.recognition) {
      console.error("Speech recognition not initialized");
      return;
    }
    
    try {
      if (!this.isListening) {
        // Start listening for activation phrase
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.start();
        this.isListening = true;
        console.log("Started listening for activation phrase");
        
        // Event handler specifically for activation phrase detection
        this.recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
          console.log("Heard:", transcript);
          
          // Check if any activation phrase is detected
          if (this.activationPhrases.some(phrase => transcript.includes(phrase.toLowerCase()))) {
            console.log("Activation phrase detected!");
            this.stopListening();
            
            // Notify that the assistant is now listening for a command
            this.options.onListening(true);
            
            // Wait a moment then start listening for the actual command
            setTimeout(() => {
              this.startCommandListening();
            }, 300);
          }
        };
      }
    } catch (error) {
      console.error("Error starting continuous listening:", error);
      this.options.onError(error);
    }
  }

  private startCommandListening() {
    try {
      // Reset recognition to listen for a single command
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.start();
      this.isListening = true;
      console.log("Listening for command...");
      
      // Configure to listen for a full command
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Command detected:", transcript);
        
        // Pass the command to the handler
        this.options.onResult(transcript);
      };
      
      // Add a timeout to stop listening if no command is detected
      setTimeout(() => {
        if (this.isListening) {
          this.stopListening();
          this.startContinuousListening(); // Go back to listening for activation phrase
        }
      }, 8000); // Stop listening after 8 seconds of silence
    } catch (error) {
      console.error("Error listening for command:", error);
      this.options.onError(error);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
        this.options.onListening(false);
        console.log("Stopped listening");
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  }

  public isActive(): boolean {
    return this.isListening;
  }
  
  // Detect language from text for appropriate response
  public static detectLanguage(text: string): 'english' | 'bengali' {
    // Bengali Unicode range: \u0980-\u09FF
    const bengaliPattern = /[\u0980-\u09FF]/;
    return bengaliPattern.test(text) ? 'bengali' : 'english';
  }
}

export default VoiceRecognitionService;