// src/modules/orders/OrdersModule.ts
import { GineeClient } from "../../client/GineeClient.js";
import { ORDER_ENDPOINTS } from "./endpoints.js";
import type {
  ListOrderV2Request, ListOrderV2Data, OrderInfo,
  GetOrderDetailsRequest,
  GetOrderDetailsResponse,
  OrderDetail,
} from "./types.js";
import { wibDayToUtcRange } from "./dateWIB.js";

export class OrdersModule {
  constructor(private readonly client: GineeClient) { }

  listV2(params: ListOrderV2Request): Promise<ListOrderV2Data> {
    return this.client.request<ListOrderV2Data>(ORDER_ENDPOINTS.LIST_V2, params);
  }

  async listAll(
    params: Omit<ListOrderV2Request, "nextCursor">
  ): Promise<OrderInfo[]> {
    const all: OrderInfo[] = [];
    let nextCursor: ListOrderV2Request["nextCursor"] | undefined;

    // 👉 default size = 100 kalau user tidak isi
    const baseParams = {
      size: 100,
      ...params,
    };

    while (true) {
      const res = await this.listV2({
        ...baseParams,
        nextCursor,
      });

      all.push(...res.content);

      if (!res.more || !res.nextCursor) break;
      nextCursor = res.nextCursor;
    }

    return all;
  }

  /**
  * List ALL pages by a single WIB date (YYYY-MM-DD).
  */
  listAllByDateWIB(
    dateYYYYMMDD: string,
    opts: Omit<ListOrderV2Request, "nextCursor" | "createSince" | "createTo" | "lastUpdateSince" | "lastUpdateTo"> & {
      mode?: "create" | "update";
    } = {}
  ): Promise<OrderInfo[]> {
    const { since, to } = wibDayToUtcRange(dateYYYYMMDD);
    const { mode = "create", ...rest } = opts;

    return this.listAll({
      ...rest,
      ...(mode === "create"
        ? { createSince: since, createTo: to }
        : { lastUpdateSince: since, lastUpdateTo: to }),
    });
  }

  getDetails(params: GetOrderDetailsRequest): Promise<GetOrderDetailsResponse> {
    return this.client.request<GetOrderDetailsResponse>(ORDER_ENDPOINTS.BATCH_GET, params);
  }

  getDetailsByOrderIds(
    orderIds: string[],
    opts: {
      historicalData?: boolean;
      includedSection?: string[];
    } = {}
  ): Promise<OrderDetail[]> {
    return this.getDetails({
      orderIds,
      historicalData: opts.historicalData,
      includedSection: opts.includedSection,
    });
  }
}
