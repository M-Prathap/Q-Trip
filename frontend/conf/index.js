
const isLocalSeparateFrontend =
  window.location.hostname === "localhost" && window.location.port === "8081";

const isVercel = window.location.hostname.endsWith("vercel.app");

const config = {
  backendEndpoint: isLocalSeparateFrontend
    ? "http://localhost:8082"
    : isVercel
      ? "https://prathap110201-me-qtripdynamic.onrender.com"
      : window.location.origin,
};

export default config;
