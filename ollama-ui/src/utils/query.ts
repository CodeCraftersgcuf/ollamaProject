// src/api/query.ts

import { API_ENDPOINTS } from "../../apiConfig";
import { apiCall } from "./customApiCall";

// 🔥 Query: Get file list
export const fetchChatHistory = async (token: string) => {
  return await apiCall(API_ENDPOINTS.CHAT.GetHistory, "GET", undefined, token);
};

export const fetchFiles = async (token: string) => {
  return await apiCall(API_ENDPOINTS.FILES.List, "GET", undefined, token);
};
export const getUserFiles = async (token: string) => {
  return await apiCall(API_ENDPOINTS.FILES.List, "GET", undefined, token);
};

// 🔥 Query: Get summary history
export const getSummaryHistory = async (token: string) => {
  return await apiCall(
    API_ENDPOINTS.FILES.SummaryHistory,
    "GET",
    undefined,
    token
  );
};

// 🔥 Query: Get subject list
export const getSubjectList = async (token: string) => {
  return await apiCall(API_ENDPOINTS.SUBJECT.List, "GET", undefined, token);
};

// 🔥 Query: Get subobjects under a subject
export const getSubobjectList = async (subjectId: string, token: string) => {
  return await apiCall(
    API_ENDPOINTS.SUBJECT.ListSubobject(subjectId),
    "GET",
    undefined,
    token
  );
};
