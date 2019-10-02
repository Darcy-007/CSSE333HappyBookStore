export class Order {
  OrderID: number;
  PaymentMethod: string;
  OrderType: string;
  Time: string;
  CustomerID: string;
  BookID: string;
  StoreID: string;
  Status: number;
}

export const OrderType = ['Online', 'Instore'];
export const PaymentMethod = ['Cash', 'Credit Card'];
export const OrderStatus = ['Pending', 'Completed', 'Denied'];
