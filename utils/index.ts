import moment from "moment";

export const formatDateFrontEnd = (date: string) => {
  return moment(date).format("MMM D, YYYY");
};
