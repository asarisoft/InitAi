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
    targetUsers: 'Full-Stack Engineers, Product Architects, and AI Designers',
    techStack: 'React 18, FastAPI, Docker, TailwindCSS',
    designImages: []
  });

  const [skills, setSkills] = useState(() => {
    return JSON.parse(JSON.stringify(INITIAL_SKILLS));
  });

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to **InitAI Web Studio**.\n\n" +
        "I will guide you through a 3-step structured architectural interview to produce production-grade specifications and deliver 3 markdown deliverables (`prd.md`, `list_skills.md`, and `systemdesign.md`).\n\n" +
        "---\n\n" +
        "### 🚀 Step 1: Product Concept & Problem Statement\n" +
        "**What is the core vision or problem statement of your project?**\n" +
        "*(Feel free to describe the target audience, user pain points, or high-level functionality)*"
    }
  ]);

  // Handle theme persistence
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('initai_theme', theme);
  }, [theme]);

  // Ping backend status
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

      if (response.extractedData) {
        setProjectData(prev => ({
          ...prev,
          ...response.extractedData
        }));
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          suggestedOptions: response.suggestedOptions || response.suggested_options
        }
      ]);

      setCurrentStep(response.nextStep);
      setInterviewTurn(response.nextInterviewTurn);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Encountered a processing error. Resuming with client-side fallback state."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectOption = async (optionPrompt) => {
    await handleSendMessage(optionPrompt);
  };

  const handleConfirmDesign = async ({ text, images }) => {
    if (images && images.length > 0) {
      setProjectData(prev => ({
        ...prev,
        designImages: images
      }));
    }
    await handleSendMessage(text);
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
    await handleSendMessage(`Confirmed ${activeSkillsCount} active capabilities for this project.`);
  };

  const handleReset = () => {
    if (window.confirm("Reset active wizard session back to step 1?")) {
      setCurrentStep(1);
      setInterviewTurn(1);
      setProjectData({
        projectName: 'InitAI Agent Project',
        coreIdea: '',
        prdDetails: '',
        designGuidelines: '',
        targetUsers: 'Full-Stack Engineers, Product Architects, and AI Designers',
        techStack: 'React 18, FastAPI, Docker, TailwindCSS',
        designImages: []
      });
      setSkills(JSON.parse(JSON.stringify(INITIAL_SKILLS)));
      setMessages([
        {
          role: 'assistant',
          content: "Session reset.\n\n" +
            "**What is the core vision or problem statement of your project?**"
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
            onConfirmDesign={handleConfirmDesign}
            onSelectOption={handleSelectOption}
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
