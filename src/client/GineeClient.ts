// src/client/GineeClient.ts
import { buildAuthorization } from "./sign.js";
import { mapGineeError, isRetryableGineeError } from "./errors.js";
import type { GineeResponse } from "./types.js";
import { withRetry } from "./retry.js";

import { OrdersModule } from "../modules/orders/OrdersModule.js";

export class GineeClient {
  public readonly orders: OrdersModule;

  constructor(
    private readonly cfg: {
      accessKey: string;
      secretKey: string;
      country?: string;
      baseUrl?: string;
      retry?: {
        maxRetries?: number;
        baseDelayMs?: number;
        maxDelayMs?: number;
      };
    }
  ) {
    this.orders = new OrdersModule(this);
  }

  async request<T>(requestUri: string, body: unknown): Promise<T> {
    const method = "POST";
    const baseUrl = this.cfg.baseUrl ?? "https://api.ginee.com";

    const doRequest = async () => {
      const authorization = buildAuthorization({
        accessKey: this.cfg.accessKey,
        secretKey: this.cfg.secretKey,
        method,
        requestUri,
      });

      const res = await fetch(baseUrl + requestUri, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Advai-Country": this.cfg.country ?? "ID",
          Authorization: authorization,
        },
        body: JSON.stringify(body),
      });

      const json = (await res.json()) as GineeResponse<T>;

      if (!res.ok || json?.code !== "SUCCESS") {
        throw mapGineeError(json, res.status);
      }

      return json.data;
    };

    return withRetry(doRequest, isRetryableGineeError, this.cfg.retry);
  }
}
