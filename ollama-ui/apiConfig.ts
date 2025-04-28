// src/api/apiConfig.ts

const API_DOMAIN = "http://127.0.0.1:8000/api";

const API_ENDPOINTS = {
  AUTH: {
    Login: API_DOMAIN + "/auth/login",
  },

  CHAT: {
    StreamChat: API_DOMAIN + "/chat", // POST (stream response)
    GetHistory: API_DOMAIN + "/files/summary-history", // GET
  },

  FILES: {
    Upload: API_DOMAIN + "/files/upload", // POST FormData
    List: API_DOMAIN + "/files/list",     // GET
    Process: API_DOMAIN + "/files/process", // POST
    Translate: API_DOMAIN + "/files/translate", // POST
    SummaryHistory: API_DOMAIN + "/files/summary-history", // GET
    
  },

  AUDIO: {
    STT: API_DOMAIN + "/audio/stt", // POST FormData
    TTS: API_DOMAIN + "/audio/tts", // POST (query param)
  },

  SUBJECT: {
    Create: API_DOMAIN + "/subject", // POST
    List: API_DOMAIN + "/subject/list", // GET
    CreateSubobject: API_DOMAIN + "/subject/subobject", // POST
    ListSubobject: (subjectId: string) => API_DOMAIN + `/subject/subobject/list/${subjectId}`, // GET
  },

  BLOG: {
    ScrapeAndSummarize: API_DOMAIN + "/blog/scrape", // POST
  },
};

export { API_DOMAIN, API_ENDPOINTS };
