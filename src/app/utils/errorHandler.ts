import { useAlert } from "../../context/AlertContext";

export interface ApiError {
  status?: number;
  message?: string;
  detail?: string;
  code?: string;
}

export const useApiError = () => {
  const { showAlert } = useAlert();

  const handleError = (error: any, context: string = "Operation") => {
    console.error(`[${context}]`, error);

    let errorMessage = `${context} failed. Please try again.`;
    let errorTitle = "Error";

    if (error?.status === 401) {
      errorTitle = "Unauthorized";
      errorMessage = "Your session has expired. Please log in again.";
    } else if (error?.status === 403) {
      errorTitle = "Access Denied";
      errorMessage = "You don't have permission to perform this action.";
    } else if (error?.status === 404) {
      errorTitle = "Not Found";
      errorMessage = "The requested resource was not found.";
    } else if (error?.status === 500) {
      errorTitle = "Server Error";
      errorMessage = "A server error occurred. Please try again later.";
    } else if (error?.status === 0 || error?.message?.includes("Network")) {
      errorTitle = "Network Error";
      errorMessage = "Check your internet connection and try again.";
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.detail) {
      errorMessage = error.detail;
    }

    showAlert(errorTitle, errorMessage);
    return { errorTitle, errorMessage };
  };

  return { handleError };
};

export const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  if (error.detail) return error.detail;
  if (error.data?.message) return error.data.message;
  return "An error occurred. Please try again.";
};

export const isNetworkError = (error: any): boolean => {
  return (
    error?.status === 0 ||
    error?.message?.toLowerCase().includes("network") ||
    error?.message?.toLowerCase().includes("connect") ||
    error?.message?.toLowerCase().includes("timeout")
  );
};

export const isAuthError = (error: any): boolean => {
  return error?.status === 401 || error?.status === 403;
};

export const isServerError = (error: any): boolean => {
  return (error?.status ?? 0) >= 500;
};

export const isClientError = (error: any): boolean => {
  return (error?.status ?? 0) >= 400 && (error?.status ?? 0) < 500;
};
