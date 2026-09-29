const DOG_IMAGE_API_URL = "https://dog.ceo/api/breeds/image/random";

export async function loadRandomDoctorAvatar(): Promise<string> {
  const response = await fetch(DOG_IMAGE_API_URL);
  if (!response.ok) throw new Error("Não foi possível carregar a imagem do médico.");

  const data: unknown = await response.json();
  if (
    typeof data !== "object"
    || data === null
    || !("message" in data)
    || typeof data.message !== "string"
    || !data.message
  ) {
    throw new Error("A resposta da imagem do médico é inválida.");
  }

  return data.message;
}
