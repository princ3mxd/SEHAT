export default defineConfig({
  optimizeDeps: {
    exclude: [
      "@heroicons/react/24/outline",
      "react-dropzone",
      "@mui/material",
      "@mui/icons-material",
      "react-chartjs-2",
      "chart.js",
      "html2canvas",
      "zustand",
      "react-dom/client",
    ],
  },
});
