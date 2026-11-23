import multer from "multer";

function errorHandler(error, _request, response, _next) {
  const uploadError = error instanceof multer.MulterError || error.message?.startsWith("Upload a ");
  if (uploadError) {
    response.status(400).json({ error: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Server error. Please try again." });
}

export default errorHandler;
