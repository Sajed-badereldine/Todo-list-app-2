export function getApiErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.message) {
    const { message } = error.response.data;

    if (Array.isArray(message)) {
      return message[0];
    }

    return message;
  }

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
}
