
const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Map API errors to user-friendly messages
export const parseGeminiError = (error: any): string => {
  const code = error?.message || '';
  if (['API_KEY_MISSING', 'QUOTA_EXCEEDED', 'NETWORK_ERROR', 'UNKNOWN_ERROR'].includes(code)) return code;
  return 'UNKNOWN_ERROR';
};

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error('NETWORK_ERROR');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'UNKNOWN_ERROR');
  }

  return response.json();
}

export async function getScentRecommendation(answers: { mood: string; occasion: string; preference: string }) {
  return postJSON<{ productId: string; reason: string }>('/api/scent-recommendation', answers);
}

export async function generateProductImage(productName: string) {
  const { imageUrl } = await postJSON<{ imageUrl: string }>('/api/generate-image', { productName });
  return imageUrl;
}

export async function analyzeProductImage(imageFile: File) {
  const base64Data = await fileToBase64(imageFile);
  const { text } = await postJSON<{ text: string }>('/api/analyze-image', { base64Data, mimeType: imageFile.type });
  return text;
}
