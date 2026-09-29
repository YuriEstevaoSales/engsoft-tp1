export type SearchDoctor = {
  id: number;
  specialty: string | null;
  crmNumber: string;
  crmUf: string;
  street: string;
  addressNumber: number;
  addressComplement: string | null;
  insurances: number[] | null;
  acceptedInsurances: string[];
  user: {
    name: string;
    photo: string | null;
    city: string | null;
    stateAddress: string;
  };
  averageRating: number | null;
};

export type SearchFilters = {
  minRating?: number;
  insuranceId?: number;
  state?: string;
};

export type InsuranceOption = {
  id: number;
  name: string;
};

export const BRAZILIAN_STATES = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"],
  ["BA", "Bahia"], ["CE", "Ceará"], ["DF", "Distrito Federal"], ["ES", "Espírito Santo"],
  ["GO", "Goiás"], ["MA", "Maranhão"], ["MT", "Mato Grosso"],
  ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"], ["PA", "Pará"],
  ["PB", "Paraíba"], ["PR", "Paraná"], ["PE", "Pernambuco"], ["PI", "Piauí"],
  ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"], ["RS", "Rio Grande do Sul"],
  ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"],
  ["SP", "São Paulo"], ["SE", "Sergipe"], ["TO", "Tocantins"],
] as const;

export const DOCTOR_SEARCH_ROUTE_PATH = "/encontrar-medico/:specialty";
