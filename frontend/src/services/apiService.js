import { mockLlmService } from './mockLlmService';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiService = {
  async sendMessage({ message, step, interviewTurn, projectData, selectedSkills }) {
    // Attempt backend call first
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          step,
          interview_turn: interviewTurn,
          project_data: projectData,
          selected_skills: selectedSkills
        }),
        signal: AbortSignal.timeout(1500) // fast fallback if backend is not running
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.reply,
          nextStep: data.next_step,
          nextInterviewTurn: data.interview_turn,
          isStepComplete: data.is_step_complete,
          extractedData: data.data_extracted || {},
          suggestedSkills: data.suggested_skills,
          suggestedOptions: data.suggested_options
        };
      }
    } catch (e) {
      // Backend unreachable -> Use intelligent mock LLM service directly
    }

    return await mockLlmService.processMessage({ message, step, interviewTurn, projectData });
  },

  async searchCustomSkill(skillName) {
    return await mockLlmService.searchTrendSkill(skillName);
  }
};
