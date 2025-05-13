// src/api/apiConfig.ts

const API_DOMAIN = "http://127.0.0.1:8000/api";

const API_ENDPOINTS = {
  AUTH: {
    Login: API_DOMAIN + "/auth/login",
  },

  ADMINS: {
    Create: API_DOMAIN + "/admins/create",
    List: API_DOMAIN + "/admins/list",
    Delete: API_DOMAIN + "/admins/delete",
    UpdatePassword: API_DOMAIN + "/admins/update-password",
  },

  CHAT: {
    StreamChat: API_DOMAIN + "/chat",
    GetHistory: (username?: string) =>
      username
        ? `${API_DOMAIN}/chat/history?username=${username}`
        : `${API_DOMAIN}/chat/history`,
  },

  FILES: {
    Upload: API_DOMAIN + "/files/upload",
    List: API_DOMAIN + "/files/list",
    Process: API_DOMAIN + "/files/process",
    Translate: API_DOMAIN + "/files/translate",
    SummaryHistory: API_DOMAIN + "/files/summary-history", // ✅ new
    DetectIntent: API_DOMAIN + "/files/detect-intent",
  },

  AUDIO: {
    STT: API_DOMAIN + "/audio/stt",
    TTS: API_DOMAIN + "/audio/tts",
  },

  SUBJECT: {
    Create: API_DOMAIN + "/subject",
    List: API_DOMAIN + "/subject/list",
    CreateSubobject: API_DOMAIN + "/subject/subobject",
    ListSubobject: (subjectId: string) =>
      `${API_DOMAIN}/subject/subobject/list/${subjectId}`,
  },

  BLOG: {
    ScrapeAndSummarize: API_DOMAIN + "/blog/scrape",
  },
};

export { API_DOMAIN, API_ENDPOINTS };
