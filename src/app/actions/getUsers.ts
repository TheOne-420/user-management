export function getUsers() {
  try {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}