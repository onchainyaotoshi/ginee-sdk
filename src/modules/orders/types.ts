// src/modules/orders/types.ts
export type NextCursor = [number, string];

export type ListOrderV2Request = {
  size?: number;                 // default 10, max 100
  channel?: string;              // e.g. SHOPEE_ID
  shopIdList?: string[];         // max 50, starts with "SH"
  orderNumbers?: string[];       // max 100
  orderStatus?: string;          // per dictionary
  orderType?: string;            // per dictionary
  createSince?: string;          // UTC timestamp ISO
  createTo?: string;             // UTC timestamp ISO
  lastUpdateSince?: string;      // UTC timestamp ISO
  lastUpdateTo?: string;         // UTC timestamp ISO
  nextCursor?: NextCursor;
};

export type OrderInfo = {
  orderId: string;
  country?: string;
  channel?: string;
  shopId: string;
  orderType?: string;
  orderStatus?: string;
  currency?: string;
  totalAmount?: number;
  paymentMethod?: string;
  problemOrderTypes?: string[];
  promisedToShipBefore?: string | null;
  createAt?: string;
  payAt?: string | null;
  lastUpdateAt?: string;
  externalOrderId?: string | null;
  externalOrderSn?: string | null;
  externalBookingSn?: string | null;
  externalOrderStatus?: string | null;
  externalCreateAt?: string | null;
  externalUpdateAt?: string | null;

  // docs sample shows extra fields like closeAt, customerName, totalQuantity, nextCursor sometimes appears in item
  [k: string]: unknown;
};

export type ListOrderV2Data = {
  more: boolean;
  nextCursor?: NextCursor;
  content: OrderInfo[];
};

export type GetOrderDetailsRequest =
  | {
      orderIds: string[]; // <= 100
      shopId?: never;
      channelOrderIds?: never;
      historicalData?: boolean;
      includedSection?: string[]; // e.g. ["SHIPPING_DOCUMENT_INFO"]
    }
  | {
      orderIds?: never;
      shopId: string;
      channelOrderIds: string[]; // <= 100
      historicalData?: boolean;
      includedSection?: string[];
    };

// Detail object itu panjang banget; start permissive tapi tetap ada core fields.
export type OrderDetail = {
  orderId: string;
  channel?: string;
  shopId: string;
  orderType?: string;
  orderStatus?: string;

  country?: string;
  currency?: string;
  totalAmount?: number;
  paymentMethod?: string;

  createAt?: string;
  payAt?: string | null;
  closeAt?: string | null;
  lastUpdateAt?: string;

  externalShopId?: string;
  externalOrderId?: string;
  externalOrderSn?: string;
  externalBookingSn?: string;
  externalOrderStatus?: string;
  externalCreateAt?: string;
  externalUpdateAt?: string;

  customerInfo?: {
    customerId?: string;
    externalCustomerId?: string;
    name?: string;
    mobile?: string;
    email?: string;
    [k: string]: unknown;
  };

  paymentInfo?: Record<string, unknown>;
  shippingAddressInfo?: Record<string, unknown>;
  senderAddressInfo?: Record<string, unknown>;
  billingAddressInfo?: Record<string, unknown>;

  items?: Array<Record<string, unknown>>;
  logisticsInfos?: Array<Record<string, unknown>>;

  shippingDocumentInfo?: Record<string, unknown>;
  invoiceInfo?: Record<string, unknown>;
  cancelInfo?: Record<string, unknown>;
  extraInfo?: Record<string, unknown>;
  printInfo?: Record<string, unknown>;

  [k: string]: unknown;
};

export type GetOrderDetailsResponse = OrderDetail[];
