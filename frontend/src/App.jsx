import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import ChatInput from './components/ChatInput';
import { apiService } from './services/apiService';
import { INITIAL_SKILLS } from './utils/defaultSkills';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('initai_theme') || 'dark';
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [interviewTurn, setInterviewTurn] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const [projectData, setProjectData] = useState({
    projectName: 'InitAI Agent Project',
    coreIdea: '',
    prdDetails: '',
    designGuidelines: '',
    targetUsers: 'Full-Stack Developers, Product Managers, and AI Engineers',
    techStack: 'ReactJS, FastAPI, Docker, TailwindCSS'
  });

  const [skills, setSkills] = useState(() => {
    return JSON.parse(JSON.stringify(INITIAL_SKILLS));
  });

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 **Selamat Datang di InitAI Web Studio!**\n\n" +
        "Saya adalah **AI Architecture & PRD Assistant**. Saya akan memandu Anda melalui 3 tahap interaktif untuk menghasilkan 3 file artefak siap pakai (`prd.md`, `list_skills.md`, dan `systemdesign.md`).\n\n" +
        "---\n\n" +
        "### 🚀 **Tahap 1: Deskripsi & PRD Proyek**\n" +
        "**Apa ide utama dari proyek yang ingin Anda bangun?**\n" +
        "*(Ceritakan problem statement, solusi, atau konsep aplikasi yang Anda bayangkan)*"
    }
  ]);

  // Handle theme toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('initai_theme', theme);
  }, [theme]);

  // Ping backend to check status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:8000/health', { signal: AbortSignal.timeout(1000) });
        if (res.ok) setIsBackendOnline(true);
      } catch (e) {
        setIsBackendOnline(false);
      }
    };
    checkBackend();
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await apiService.sendMessage({
        message: text,
        step: currentStep,
        interviewTurn,
        projectData,
        selectedSkills: skills
      });

      // Update extracted project data
      if (response.extractedData) {
        setProjectData(prev => ({
          ...prev,
          ...response.extractedData
        }));
      }

      // Add AI reply to messages
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.reply }
      ]);

      setCurrentStep(response.nextStep);
      setInterviewTurn(response.nextInterviewTurn);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "⚠️ Terjadi kesalahan dalam memproses pesan. Menggunakan respons cadangan lokal..."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleSkill = (skillId) => {
    setSkills(prev => prev.map(s => {
      if (s.id === skillId) {
        return { ...s, selected: s.selected === false ? true : false };
      }
      return s;
    }));
  };

  const handleAddCustomSkill = async (skillName) => {
    setIsTyping(true);
    try {
      const newSkill = await apiService.searchCustomSkill(skillName);
      setSkills(prev => [newSkill, ...prev]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleConfirmSkills = async () => {
    const activeSkillsCount = skills.filter(s => s.selected !== false).length;
    await handleSendMessage(`Saya menyetujui ${activeSkillsCount} skill pilihan untuk proyek ini.`);
  };

  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mengulang wizard dari awal?")) {
      setCurrentStep(1);
      setInterviewTurn(1);
      setProjectData({
        projectName: 'InitAI Agent Project',
        coreIdea: '',
        prdDetails: '',
        designGuidelines: '',
        targetUsers: 'Full-Stack Developers, Product Managers, and AI Engineers',
        techStack: 'ReactJS, FastAPI, Docker, TailwindCSS'
      });
      setSkills(JSON.parse(JSON.stringify(INITIAL_SKILLS)));
      setMessages([
        {
          role: 'assistant',
          content: "👋 **Sesi Direset!**\n\n" +
            "Mari mulai dari awal. **Apa ide utama dari proyek yang ingin Anda bangun?**"
        }
      ]);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        currentStep={currentStep}
        onReset={handleReset}
        projectData={projectData}
      />

      <main className="main-workspace">
        <Header
          currentStep={currentStep}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isBackendOnline={isBackendOnline}
        />

        <div className="workspace-content">
          <ChatBox
            messages={messages}
            isTyping={isTyping}
            currentStep={currentStep}
            skills={skills}
            onToggleSkill={handleToggleSkill}
            onAddCustomSkill={handleAddCustomSkill}
            onConfirmSkills={handleConfirmSkills}
            projectData={projectData}
          />

          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            currentStep={currentStep}
          />
        </div>
      </main>
    </div>
  );
}
