// src/api/mutation.ts

import { API_ENDPOINTS } from "../../apiConfig";
import { apiCall } from "./customApiCall";

// 🔥 Mutation: Login
export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return await apiCall(API_ENDPOINTS.AUTH.Login, "POST", { username, password });
};

// 🔥 Mutation: Chat with LLaMA (stream)
export const sendChatMessage = async ({
    message,
    token,
  }: {
    message: string;
    token: string;
  }) => {
    try {
      console.log("🔹 Sending Chat to API:", { message });
      const response = await apiCall(API_ENDPOINTS.CHAT.StreamChat, "POST", { message }, token); // 👈 CORRECT NOW
      console.log("✅ Chat API Success Response:", response);
      return response;
    } catch (error) {
      console.error("❌ Chat API Error:", error);
      throw error;
    }
  };
  

// 🔥 Mutation: Upload a file
export const uploadFile = async ({
  data,
  token,
}: {
  data: FormData;
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.FILES.Upload, "POST", data, token);
};

// 🔥 Mutation: Process (summarize) uploaded file
export const processFile = async ({
  data,
  token,
}: {
  data: FormData;
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.FILES.Process, "POST", data, token);
};

// 🔥 Mutation: Translate uploaded file
export const translateFile = async ({
  data,
  token,
}: {
  data: FormData;
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.FILES.Translate, "POST", data, token);
};
export const detectIntent = async ({
    message,
    token,
  }: {
    message: string;
    token: string;
  }) => {
    const formData = new FormData();
    formData.append('prompt', message);
  
    const response = await apiCall(API_ENDPOINTS.FILES.DetectIntent, "POST", formData, token);
    return response.intent; // 'summarize' or 'translate' or 'unknown'
  };
  

// 🔥 Mutation: Speech-to-Text (upload audio)
export const speechToText = async ({
  data,
  token,
}: {
  data: FormData;
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.AUDIO.STT, "POST", data, token);
};

// 🔥 Mutation: Text-to-Speech (send text)
export const textToSpeech = async ({
  text,
  token,
}: {
  text: string;
  token: string;
}) => {
  return await apiCall(`${API_ENDPOINTS.AUDIO.TTS}?text=${encodeURIComponent(text)}`, "POST", undefined, token);
};

// 🔥 Mutation: Create new subject
export const createSubject = async ({
  name,
  token,
}: {
  name: string;
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.SUBJECT.Create, "POST", { name }, token);
};

// 🔥 Mutation: Create new subobject
export const createSubobject = async ({
  subject_id,
  name,
  token,
}: {
  subject_id: string;
  name: string;
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.SUBJECT.CreateSubobject, "POST", { subject_id, name }, token);
};

// 🔥 Mutation: Scrape blog and summarize
export const scrapeBlog = async ({
  url,
  token,
}: {
  url: string;
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.BLOG.ScrapeAndSummarize, "POST", { url }, token);
};


// 🔥 Mutation: Create a new Admin
export const createAdmin = async ({
  username,
  password,
  token,
  formData,
  hasImage,
}: {
  username?: string;
  password?: string;
  token: string;
  formData?: FormData;
  hasImage?: boolean;
}) => {
  if (hasImage && formData) {
    // If image is provided, use FormData
    return await apiCall(API_ENDPOINTS.ADMINS.Create, "POST", formData, token);
  }
  // Default: no image, send as JSON
  return await apiCall(API_ENDPOINTS.ADMINS.Create, "POST", { username, password }, token);
};

// 🔥 Query: List all admins
export const listAdmins = async (token: string) => {
  return await apiCall(API_ENDPOINTS.ADMINS.List, "GET", undefined, token);
};

// 🔥 Mutation: Delete an Admin
export const deleteAdmin = async ({
  username,
  token,
}: {
  username: string;
  token: string;
}) => {
  const formData = new FormData();
  formData.append("username", username);

  return await apiCall(API_ENDPOINTS.ADMINS.Delete, "POST", formData, token);
};

// 🔥 Mutation: Update an Admin's Password
export const updateAdminPassword = async ({
  username,
  password,
  token,
}: {
  username: string;
  password: string;
  token: string;
}) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return await apiCall(API_ENDPOINTS.ADMINS.UpdatePassword, "POST", formData, token);
};