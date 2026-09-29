import type { InsuranceOption, SearchDoctor } from "./doctor-search-types.js";

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isInsuranceOption(value: unknown): value is InsuranceOption {
  return isRecord(value)
    && typeof value["id"] === "number"
    && typeof value["name"] === "string";
}

export function isSearchDoctor(value: unknown): value is SearchDoctor {
  if (!isRecord(value)) return false;
  const doctor = value;
  const user = doctor["user"];
  return (
    typeof doctor["id"] === "number"
    && isNullableString(doctor["specialty"])
    && typeof doctor["crmNumber"] === "string"
    && typeof doctor["crmUf"] === "string"
    && typeof doctor["street"] === "string"
    && typeof doctor["addressNumber"] === "number"
    && isNullableString(doctor["addressComplement"])
    && (doctor["insurances"] === null
      || (Array.isArray(doctor["insurances"])
        && doctor["insurances"].every((insuranceId) => typeof insuranceId === "number")))
    && Array.isArray(doctor["acceptedInsurances"])
    && doctor["acceptedInsurances"].every((name) => typeof name === "string")
    && isRecord(user)
    && typeof user["name"] === "string"
    && isNullableString(user["photo"])
    && isNullableString(user["city"])
    && typeof user["stateAddress"] === "string"
    && (doctor["averageRating"] === null || typeof doctor["averageRating"] === "number")
  );
}
