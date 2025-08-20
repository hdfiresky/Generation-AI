const STORAGE_KEY = 'spy_observations';

/**
 * Retrieves all stored observations from local storage.
 * @returns An array of observation strings.
 */
export const getObservations = (): string[] => {
  try {
    const storedObservations = localStorage.getItem(STORAGE_KEY);
    return storedObservations ? JSON.parse(storedObservations) : [];
  } catch (error) {
    console.error("Failed to retrieve observations from local storage:", error);
    return [];
  }
};

/**
 * Saves a new observation to local storage.
 * @param newObservation The new observation string to add.
 */
export const saveObservation = (newObservation: string): void => {
  if (!newObservation) return;
  try {
    const observations = getObservations();
    observations.push(newObservation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(observations));
  } catch (error) {
    console.error("Failed to save observation to local storage:", error);
  }
};

/**
 * Clears all stored observations from local storage.
 */
export const clearObservations = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear observations from local storage:", error);
    }
};