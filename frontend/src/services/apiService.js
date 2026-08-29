import { mockLlmService } from './mockLlmService';

const BACKEND_URL = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : '';

export const apiService = {
  /**
   * Check unified live multi-provider LLM connection (Gemini or OpenAI)
   */
  async getLLMStatus() {
    try {
      const response = await fetch(`${BACKEND_URL}/llm/status`, {
        signal: AbortSignal.timeout(2000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Backend or network error
    }
    return {
      provider: "local",
      status: "missing_key",
      valid: false,
      model: "local-engine",
      message: "Backend offline atau API Key belum dikonfigurasi."
    };
  },

  /**
   * Actively test and connect an API Key live for a chosen provider (Gemini / OpenAI)
   */
  async verifyLLMKey({ provider = "auto", apiKey, model = null }) {
    try {
      const response = await fetch(`${BACKEND_URL}/llm/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, api_key: apiKey, model }),
        signal: AbortSignal.timeout(6000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Error
    }
    return {
      provider,
      status: "error",
      valid: false,
      message: "Gagal memverifikasi API Key ke server."
    };
  },

  /**
   * Check live Gemini connection and token quota (Legacy)
   */
  async getGeminiStatus() {
    return this.getLLMStatus();
  },

  /**
   * Actively test and connect a Gemini API Key live (Legacy)
   */
  async verifyGeminiKey(apiKey) {
    return this.verifyLLMKey({ provider: "gemini", apiKey });
  },

  /**
   * Fetch verified skill matrix directly from FastAPI backend
   */
  async getSkills() {
    try {
      const response = await fetch(`${BACKEND_URL}/skills`, {
        signal: AbortSignal.timeout(1500)
      });
      if (response.ok) {
        const data = await response.json();
        return data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          githubUrl: item.github_url,
          description: item.description,
          advantages: item.advantages,
          installGuide: item.install_guide,
          selected: item.selected !== false
        }));
      }
    } catch (e) {
      // Backend offline
    }
    return null;
  },

  /**
   * Send interview chat message to backend
   */
  async sendMessage({ message, step, interviewTurn, projectData, selectedSkills }) {
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          step,
          interview_turn: interviewTurn,
          project_data: projectData,
          selected_skills: selectedSkills ? selectedSkills.map(s => ({
            id: s.id,
            name: s.name,
            category: s.category,
            github_url: s.githubUrl || s.github_url,
            description: s.description,
            advantages: s.advantages,
            install_guide: s.installGuide || s.install_guide,
            selected: s.selected !== false
          })) : []
        }),
        signal: AbortSignal.timeout(2000)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.reply,
          nextStep: data.next_step,
          nextInterviewTurn: data.interview_turn,
          isStepComplete: data.is_step_complete,
          extractedData: data.data_extracted || {},
          suggestedSkills: data.suggested_skills ? data.suggested_skills.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            githubUrl: item.github_url,
            description: item.description,
            advantages: item.advantages,
            installGuide: item.install_guide,
            selected: item.selected !== false
          })) : null,
          suggestedOptions: data.suggested_options
        };
      }
    } catch (e) {
      // Fallback
    }

    return await mockLlmService.processMessage({ message, step, interviewTurn, projectData });
  },

  /**
   * Live search & synthesize custom skill from backend
   */
  async searchCustomSkill(skillName, category = "Development") {
    try {
      const response = await fetch(`${BACKEND_URL}/skills/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: skillName, category }),
        signal: AbortSignal.timeout(2000)
      });

      if (response.ok) {
        const item = await response.json();
        return {
          id: item.id,
          name: item.name,
          category: item.category,
          githubUrl: item.github_url,
          description: item.description,
          advantages: item.advantages,
          installGuide: item.install_guide,
          selected: true
        };
      }
    } catch (e) {
      // Fallback
    }

    return await mockLlmService.searchTrendSkill(skillName);
  },

  /**
   * Generate 4 markdown deliverables from backend
   */
  async generateFiles(payload) {
    try {
      const response = await fetch(`${BACKEND_URL}/generate-files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: payload.projectName || "Project InitAI",
          prd_summary: payload.prdDetails || payload.coreIdea || "SaaS Web Studio Application",
          target_users: payload.targetUsers || "Full-Stack Developers, Product Managers, and AI Engineers",
          tech_stack: payload.techStack || "React 18, FastAPI, Docker, TailwindCSS",
          design_references: payload.designGuidelines || "Modern Dark/Light SaaS Studio",
          selected_skills: (payload.skills || []).map(s => ({
            id: s.id,
            name: s.name,
            category: s.category,
            github_url: s.githubUrl || s.github_url,
            description: s.description,
            advantages: s.advantages,
            install_guide: s.installGuide || s.install_guide,
            selected: s.selected !== false
          })),
          design_images: payload.designImages || []
        }),
        signal: AbortSignal.timeout(2500)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          prdMd: data.prd_md,
          listSkillsMd: data.list_skills_md,
          systemDesignMd: data.systemdesign_md,
          readmeMd: data.readme_md
        };
      }
    } catch (e) {
      // Fallback
    }
    return null;
  }
};
