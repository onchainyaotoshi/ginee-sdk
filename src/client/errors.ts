import type { GineeResponse, GineeStatusCode } from "./types.js";

export class GineeApiError extends Error {
  public readonly code?: GineeStatusCode;
  public readonly httpStatus?: number;
  public readonly transactionId?: string;
  public readonly extra?: unknown;
  public readonly raw?: unknown;

  constructor(
    message: string,
    opts: {
      code?: GineeStatusCode;
      httpStatus?: number;
      transactionId?: string;
      extra?: unknown;
      raw?: unknown;
    } = {}
  ) {
    super(message);
    this.name = "GineeApiError";
    this.code = opts.code;
    this.httpStatus = opts.httpStatus;
    this.transactionId = opts.transactionId;
    this.extra = opts.extra;
    this.raw = opts.raw;
  }
}

export class GineeIamFailedError extends GineeApiError {
  constructor(message: string, opts: any) { super(message, opts); this.name = "GineeIamFailedError"; }
}
export class GineeParameterError extends GineeApiError {
  constructor(message: string, opts: any) { super(message, opts); this.name = "GineeParameterError"; }
}
export class GineeServiceBusyError extends GineeApiError {
  constructor(message: string, opts: any) { super(message, opts); this.name = "GineeServiceBusyError"; }
}

/** mapping common codes per docs */
export function mapGineeError<T>(json: GineeResponse<T>, httpStatus: number) {
  const opts = {
    code: json.code,
    httpStatus,
    transactionId: json.transactionId,
    extra: json.extra,
    raw: json,
  };

  switch (json.code) {
    case "IAM_FAILED":
      return new GineeIamFailedError(json.message || "IAM failed", opts);
    case "PARAMETER_ERROR":
      return new GineeParameterError(json.message || "Parameter error", opts);
    case "SERVICE_BUSY":
      return new GineeServiceBusyError(json.message || "Service busy", opts);
    default:
      return new GineeApiError(json.message || "Ginee API Error", opts);
  }
}

export function isRetryableGineeError(err: unknown) {
  // SERVICE_BUSY (body code) or HTTP 429 / 5xx
  const anyErr = err as any;

  // our errors keep httpStatus & code
  const code = anyErr?.code;
  const httpStatus = anyErr?.httpStatus;

  if (code === "SERVICE_BUSY") return true;
  if (httpStatus === 429) return true;
  if (typeof httpStatus === "number" && httpStatus >= 500 && httpStatus <= 599) return true;

  return false;
}