export const downloadPdfFromResponse = async (
  response,
  { filename = "document.pdf", onError } = {}
) => {
  const blob =
    response.data instanceof Blob
      ? response.data
      : new Blob([response.data], { type: "application/pdf" });

  const head = await blob.slice(0, 4).text();
  if (head === "%PDF") {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  }

  let message = "Downloaded file is not a valid PDF.";
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text);
    if (parsed?.message) message = parsed.message;
  } catch {
    // keep default message
  }
  onError?.(message);
  return false;
};
