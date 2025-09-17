import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">رقم الطلب</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">تاريخ الطلب</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">إجمالي الطلب</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">طريقة الدفع</p>
            <Label>{
              orderDetails?.paymentMethod === "cash_on_delivery" 
                ? "الدفع عند الاستلام" 
                : orderDetails?.paymentMethod
            }</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">حالة الدفع</p>
            <Label>{
              orderDetails?.paymentStatus === "pending" 
                ? "في الانتظار" 
                : orderDetails?.paymentStatus === "paid" 
                ? "تم الدفع" 
                : orderDetails?.paymentStatus
            }</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">حالة الطلب</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {
                  orderDetails?.orderStatus === "confirmed" 
                    ? "مؤكد" 
                    : orderDetails?.orderStatus === "rejected" 
                    ? "مرفوض" 
                    : orderDetails?.orderStatus === "inProcess" 
                    ? "جاري التحضير" 
                    : orderDetails?.orderStatus === "inShipping" 
                    ? "جاري التوصيل" 
                    : orderDetails?.orderStatus === "delivered" 
                    ? "تم التوصيل" 
                    : orderDetails?.orderStatus
                }
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">تفاصيل الطلب</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between">
                      <span>المنتج: {item.title}</span>
                      <span>الكمية: {item.quantity}</span>
                      <span>السعر: ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">بيانات التوصيل</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>الاسم: {orderDetails?.addressInfo?.fullName || user.userName}</span>
              <span>العنوان: {orderDetails?.addressInfo?.address}</span>
              <span>المنطقة: {orderDetails?.addressInfo?.city}</span>
              <span>رقم الهاتف: {orderDetails?.addressInfo?.phone}</span>
              <span>الدولة: {orderDetails?.addressInfo?.country || "ليبيا"}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
