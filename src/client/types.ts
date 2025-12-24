export type GineeStatusCode =
  | "SUCCESS"
  | "ERROR"
  | "IAM_FAILED"
  | "PARAMETER_ERROR"
  | "SERVICE_BUSY"
  | (string & {}); // fallback untuk code lain di masa depan

export type GineeResponse<T> = {
  code: GineeStatusCode;
  message?: string;
  data: T;
  extra?: unknown;
  transactionId?: string;
  pricingStrategy?: "FREE" | "PAY" | string;
};