import React, { useRef, useState } from 'react';
import { ChatMessage } from '../models/AcademyModels';
import { X, Send, Sparkles, Code2, Copy, Check } from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextSummary: string;
}

const QUICK_PROMPTS = [
  'How do I balance an overly tart Mezcal Sour without losing smoke?',
  'Explain the difference between shaking vs. stirring a Vesper Martini.',
  'Suggest a 3-ingredient low-ABV aperitivo with Sherry and Amaro.',
  'What are the key differences between Bourbon, Rye, and Single Pot Still Irish Whiskey?',
];

const KOTLIN_BLUEPRINT_FILES: Record<string, string> = {
  'app/build.gradle.kts': `import com.google.gms.googleservices.GoogleServicesPlugin.MissingGoogleServicesStrategy

plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.kotlin.compose)
  alias(libs.plugins.google.devtools.ksp)
  alias(libs.plugins.secrets)
  alias(libs.plugins.google.services)
}

android {
  namespace = "com.example"
  compileSdk { version = release(36) { minorApiLevel = 1 } }
  defaultConfig {
    applicationId = "com.barsrus.mixology.pub"
    minSdk = 24
    targetSdk = 36
    versionCode = 6
    versionName = "6.0"
    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
  }
  buildFeatures {
    compose = true
    buildConfig = true
  }
}`,
  'MainActivity.kt': `package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.example.ui.screens.MainAppScreen
import com.example.ui.theme.BarCraftTheme
import com.example.util.configureAppCheck
import com.example.viewmodel.AiAssistantViewModel
import com.example.viewmodel.BarCraftViewModel

class MainActivity : ComponentActivity() {
    private val barViewModel: BarCraftViewModel by viewModels()
    private val aiViewModel: AiAssistantViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        configureAppCheck(this, intent)
        enableEdgeToEdge()
        setContent {
            BarCraftTheme {
                MainAppScreen(
                    barViewModel = barViewModel,
                    aiViewModel = aiViewModel
                )
            }
        }
    }
}`,
  'AiAssistantViewModel.kt': `package com.example.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.Firebase
import com.google.firebase.ai.ai
import com.google.firebase.ai.type.content
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout

class AiAssistantViewModel(application: Application) : AndroidViewModel(application) {
    private val generativeModel by lazy {
        Firebase.ai.generativeModel(
            modelName = "gemini-3.8-flash",
            systemInstruction = content {
                text("You are Master Mixologist Alistair, the interactive AI bar mentor for Bars R Us...")
            }
        )
    }

    private val _messages = MutableStateFlow<List<ChatMessage>>(emptyList())
    val messages: StateFlow<List<ChatMessage>> = _messages.asStateFlow()

    private val _chatState = MutableStateFlow<AiChatState>(AiChatState.Idle)
    val chatState: StateFlow<AiChatState> = _chatState.asStateFlow()

    fun sendMessage(userText: String, isSuggestion: Boolean = false) {
        if (userText.isBlank()) return
        _messages.update {
            it + ChatMessage(
                id = "user_\${System.currentTimeMillis()}",
                sender = MessageSender.USER,
                text = userText.trim(),
                isSuggestionToCreator = isSuggestion
            )
        }
        viewModelScope.launch {
            _chatState.value = AiChatState.Loading
            val accumulated = StringBuilder()
            withTimeout(60_000L) {
                generativeModel.generateContentStream(userText).collect { chunk ->
                    accumulated.append(chunk.text.orEmpty())
                    _chatState.value = AiChatState.Streaming(accumulated.toString())
                }
            }
            _messages.update {
                it + ChatMessage(
                    id = "ai_\${System.currentTimeMillis()}",
                    sender = MessageSender.AI_BOT,
                    text = accumulated.toString()
                )
            }
            _chatState.value = AiChatState.Idle
        }
    }
}`,
};

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  contextSummary,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_alistair',
      sender: 'AI_BOT',
      text: 'Welcome to the backbar. I am Master Mixologist Alistair. Ask me about recipe balancing, spirit substitutions, dilution thermodynamics, wine & beer pairings, or state alcohol service laws.',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showKotlinModal, setShowKotlinModal] = useState(false);
  const [selectedKotlinFile, setSelectedKotlinFile] = useState<string>('app/build.gradle.kts');
  const [copiedKotlin, setCopiedKotlin] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'USER',
      text: trimmed,
      timestamp: Date.now(),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputText('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.slice(-10),
          contextInfo: contextSummary,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to connect to Master Mixologist Alistair.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const payload = JSON.parse(line.slice(6));
              if (payload.error) {
                throw new Error(payload.error);
              }
              if (payload.text) {
                accumulated += payload.text;
                setStreamingText(accumulated);
              }
            } catch {
              // ignore partial line
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'AI_BOT',
          text: accumulated || 'Let us examine that proportion together at the station.',
          timestamp: Date.now(),
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection interrupted.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'AI_BOT',
          text: `My apologies—our cellar telegraph encountered an issue (${msg}). Please verify your API key in Settings > Secrets.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setStreamingText(null);
      setIsLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  };

  const handleCopyKotlin = async () => {
    try {
      await navigator.clipboard.writeText(KOTLIN_BLUEPRINT_FILES[selectedKotlinFile] || '');
      setCopiedKotlin(true);
      setTimeout(() => setCopiedKotlin(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#0B0F17] border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl">
        {/* Drawer Header with Alistair Portrait */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#0F1623]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-500/50 bg-slate-800 shrink-0">
              <img
                src="/src/assets/images/mentor_alistair_portrait_1794388090370.jpg"
                alt="Master Mixologist Alistair"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="text-xs text-amber-400">
                Guild AI Mentor · gemini-3.8-flash
              </div>
              <h2 className="text-base font-bold text-slate-100">
                Master Mixologist Alistair
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKotlinModal(!showKotlinModal)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg"
              title="Inspect Android Kotlin Source Blueprint"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              Kotlin Specs
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close AI Mentor Drawer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Kotlin Blueprint Inspector View */}
        {showKotlinModal ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-amber-400">
                Android Studio Kotlin Reference (com.barsrus.mixology.pub)
              </div>
              <button
                type="button"
                onClick={handleCopyKotlin}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md"
              >
                {copiedKotlin ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy File
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(KOTLIN_BLUEPRINT_FILES).map((fileName) => (
                <button
                  key={fileName}
                  type="button"
                  onClick={() => setSelectedKotlinFile(fileName)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md ${
                    selectedKotlinFile === fileName
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  {fileName}
                </button>
              ))}
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
              {KOTLIN_BLUEPRINT_FILES[selectedKotlinFile]}
            </pre>
          </div>
        ) : (
          <>
            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'USER' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 mb-1">
                    {msg.sender === 'USER' ? 'You (Apprentice)' : 'Master Mixologist Alistair'}
                  </div>
                  <div
                    className={`max-w-[88%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'USER'
                        ? 'bg-amber-500 text-slate-950 font-medium'
                        : 'bg-[#0F1623] border border-slate-800 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {streamingText !== null && (
                <div className="flex flex-col items-start">
                  <div className="text-[11px] text-amber-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Alistair is formulating...</span>
                  </div>
                  <div className="max-w-[88%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-[#0F1623] border border-amber-500/40 text-slate-200">
                    {streamingText || '...'}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Prompts & Input Form */}
            <div className="p-4 border-t border-slate-800 bg-[#0F1623] space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {QUICK_PROMPTS.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg whitespace-nowrap shrink-0 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Alistair about recipes, spirits, or service laws..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ask
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
