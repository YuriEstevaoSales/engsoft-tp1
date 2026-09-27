export interface TestDataInsurance {
  id: number;
  name: string;
}

export interface TestData {
  source: "insurances";
  count: number;
  insurances: TestDataInsurance[];
}

function isTestData(value: unknown): value is TestData {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;
  return (
    data["source"] === "insurances" &&
    typeof data["count"] === "number" &&
    Array.isArray(data["insurances"]) &&
    data["insurances"].every(
      (insurance: unknown) =>
        typeof insurance === "object" &&
        insurance !== null &&
        typeof (insurance as Record<string, unknown>)["id"] === "number" &&
        typeof (insurance as Record<string, unknown>)["name"] === "string",
    )
  );
}

export async function loadTestData(): Promise<TestData> {
  const response = await fetch("/api/insurances");
  if (!response.ok) {
    throw new Response(null, {
      status: response.status,
      statusText: "A API não conseguiu consultar o banco de dados.",
    });
  }

  const data: unknown = await response.json();
  if (!isTestData(data)) {
    throw new Error("A API retornou dados em um formato inesperado.");
  }

  return data;
}
