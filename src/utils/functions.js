export const dateStringifier = (date) => {
  return date.toDate().toDateString();
};

export const retrieveEvent = (date) => {
  return localStorage.getItem(dateStringifier(date));
};
