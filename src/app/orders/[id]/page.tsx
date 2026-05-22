import { OrderTracker } from "@/components/orders/order-tracker";

export default function OrderPage({ params }: { params: { id: string } }) {
  return <OrderTracker orderId={params.id} />;
}
