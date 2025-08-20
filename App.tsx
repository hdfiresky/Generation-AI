import React, { useState, useEffect, useCallback } from 'react';
import { Generation, Gender, Message, Persona, Theme } from './types';
import { THEMES } from './constants';
import { 
  createChatSession, 
  generatePersonaDetails, 
  generateUserProfile,
  USE_BACKEND,
  streamChatWithBackend
} from './services/geminiService';
import { getObservations, saveObservation, clearObservations } from './utils/localStorage';
import Header from './components/Header';
import PersonaSelector from './components/PersonaSelector';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import ProfileModal from './components/ProfileModal';
import ObservationsModal from './components/ObservationsModal';

import { Chat } from '@google/genai';

const App: React.FC = () => {
  const [persona, setPersona] = useState<Persona>({
    generation: Generation.GEN_Z,
    gender: Gender.FEMALE,
  });

  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[persona.generation][persona.gender]);
  const [isRefreshingPersona, setIsRefreshingPersona] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatSession, setChatSession] = useState<Chat | { prompt: string } | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<string>('');
  const [isGeneratingProfile, setIsGeneratingProfile] = useState<boolean>(false);

  const [isObservationsModalOpen, setIsObservationsModalOpen] = useState<boolean>(false);
  const [observations, setObservations] = useState<string[]>([]);

  useEffect(() => {
    updateObservations();
  }, []);
  
  const updateObservations = () => {
    setObservations(getObservations());
  };

  const initializeChat = useCallback(() => {
    console.log("Initializing chat for:", activeTheme.botName);
    setIsLoading(true);
    setMessages([]);
    try {
      const newChat = createChatSession(activeTheme);
      setChatSession(newChat);
      const welcomeText = `Hey! I'm ${activeTheme.botName}. ${activeTheme.placeholder}`;
      setMessages([{
        id: crypto.randomUUID(),
        text: welcomeText,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error("Error initializing chat:", error);
      setMessages([{
        id: crypto.randomUUID(),
        text: 'Sorry, something went wrong while setting up my personality. Please try again.',
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTheme]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSendMessage = async (userMessage: string) => {
    if (!chatSession) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      text: userMessage,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    let botResponseText = '';
    let currentBotMessageId: string | null = null;
    
    // Helper to process stream and update state
    const processStream = async (stream: AsyncIterable<{ text: string }>) => {
      for await (const chunk of stream) {
        botResponseText += chunk.text;
        setMessages((prev) => {
           if (currentBotMessageId) {
             return prev.map(msg => msg.id === currentBotMessageId ? {...msg, text: botResponseText} : msg);
           } else {
             const newBotMessage: Message = {
               id: crypto.randomUUID(),
               text: botResponseText,
               sender: 'bot',
             };
             currentBotMessageId = newBotMessage.id;
             return [...prev, newBotMessage];
           }
        });
      }
    };

    try {
      if (USE_BACKEND && 'prompt' in chatSession) {
        const stream = streamChatWithBackend(chatSession.prompt, messages, userMessage);
        await processStream(stream);
      } else if (!USE_BACKEND && 'sendMessageStream' in chatSession) {
        const response = await (chatSession as Chat).sendMessageStream({ message: userMessage });
        await processStream(response);
      } else {
         throw new Error("Chat session is not configured correctly for the selected mode.");
      }

      // After stream, parse for observation
      const observationMarker = '{"observation":';
      const jsonStartIndex = botResponseText.lastIndexOf(observationMarker);

      if (jsonStartIndex > -1) {
        const jsonString = botResponseText.substring(jsonStartIndex);
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed.observation) {
            saveObservation(parsed.observation);
            updateObservations();
            console.log("Observation saved:", parsed.observation);
          }
          const cleanText = botResponseText.substring(0, jsonStartIndex).trim();
          setMessages((prev) => prev.map(msg => msg.id === currentBotMessageId ? { ...msg, text: cleanText } : msg));
        } catch (e) {
          console.warn("Could not parse observation JSON from response.", e);
        }
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "Oops, my brain just short-circuited. Try asking that again.",
        sender: 'bot',
      };
      // Ensure we don't add duplicate error messages
      setMessages((prev) => {
        if (prev[prev.length -1]?.id === currentBotMessageId) {
            return prev.map(m => m.id === currentBotMessageId ? errorMessage : m);
        }
        return [...prev, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePersonaChange = (newPersona: Persona) => {
    setPersona(newPersona);
    setActiveTheme(THEMES[newPersona.generation][newPersona.gender]);
  };

  const handlePersonaRefresh = async () => {
    setIsRefreshingPersona(true);
    try {
      const newDetails = await generatePersonaDetails(persona.generation, persona.gender);
      const baseStyle = THEMES[persona.generation][persona.gender];
      
      const newTheme: Theme = {
        ...baseStyle,
        ...newDetails,
      };
      setActiveTheme(newTheme);

    } catch (error) {
      console.error("Failed to generate new persona:", error);
      alert("Sorry, I couldn't come up with a new persona right now. Please try again!");
    } finally {
      setIsRefreshingPersona(false);
    }
  };

  const handleGenerateProfile = async () => {
    const currentObservations = getObservations();
    if (currentObservations.length < 3) {
      alert("Not enough data to generate a profile yet. Keep chatting to gather more intelligence!");
      return;
    }

    setIsGeneratingProfile(true);
    setIsProfileModalOpen(true);
    try {
      const profile = await generateUserProfile(currentObservations);
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to generate profile:", error);
      setUserProfile("### Error\nCould not generate a profile at this time. The AI profiler might be on a coffee break. Please try again later.");
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const handleShowObservations = () => {
    updateObservations();
    setIsObservationsModalOpen(true);
  };

  const handleClearObservations = () => {
    clearObservations();
    updateObservations();
    setIsObservationsModalOpen(false);
  };


  return (
    <div className={`flex flex-col h-dvh w-full overflow-hidden ${activeTheme.font} ${activeTheme.bg} transition-all duration-500`}>
      <Header 
        theme={activeTheme} 
        onGenerateProfile={handleGenerateProfile}
        isGeneratingProfile={isGeneratingProfile}
        onShowObservations={handleShowObservations}
        observationCount={observations.length}
      />
      <PersonaSelector 
        selectedPersona={persona} 
        onPersonaChange={handlePersonaChange}
        onPersonaRefresh={handlePersonaRefresh}
        isRefreshingPersona={isRefreshingPersona}
        theme={{ 
            primary: activeTheme.primary,
            secondary: activeTheme.secondary,
            text: activeTheme.text
        }}
      />
      <ChatWindow messages={messages} theme={activeTheme} isLoading={isLoading} />
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={activeTheme} />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileText={userProfile}
        isLoading={isGeneratingProfile}
        theme={{
            bg: activeTheme.bg,
            primary: activeTheme.primary,
            text: activeTheme.text
        }}
       />
       <ObservationsModal
        isOpen={isObservationsModalOpen}
        onClose={() => setIsObservationsModalOpen(false)}
        observations={observations}
        onClearObservations={handleClearObservations}
        theme={{
            primary: activeTheme.primary,
            secondary: activeTheme.secondary,
            text: activeTheme.text
        }}
       />
    </div>
  );
};

export default App;
