// Stringifies date objects
export const dateStringifier = (date) => {
  return date.toDate().toDateString();
};

// Pulls events from DB (Local Storage)
export const retrieveEvent = (date) => {
  return localStorage.getItem(dateStringifier(date));
};

// Removes events from DB (Local Storage)
export const removeEvent = (date) => {
  localStorage.removeItem(dateStringifier(date));
};
