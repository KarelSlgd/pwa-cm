import jwt_decode from "jwt-decode";

const getRole = () => {
  const { roles } = jwt_decode(localStorage.getItem("token"));
  console.log(roles);
  const roleName = roles[0].authority;
  return roleName;
};
const getUserName = () => {
  const { sub } = jwt_decode(localStorage.getItem("token"));
  return sub;
};
const session = () => {
  const { roles, sub } = jwt_decode(localStorage.getItem("token"));
  const roleName = roles[0].authority;
  return roleName !== null && sub !== null;
};
const getToken = () => {
  return localStorage.getItem("token");
};

const formatDate = (dateString) => {
  const date = new Date(dateString.replace(" ", "T"));
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "America/Mexico_City",
  };
  
  return new Intl.DateTimeFormat("es-MX", options).format(date);
};

export default {
  getRole,
  getToken,
  getUserName,
  session,
  formatDate,
};
