export function success<T>(data: T, message = 'OK') {
  return { success: true, message, data };
}

export function failure(message = 'Error', status = 400) {
  return { success: false, message, status };
}
