import Address from "@/components/shopping-view/address";
// import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleCashOnDelivery() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "عربة التسوق فارغة. يرجى إضافة منتجات للمتابعة",
        variant: "destructive",
      });
      return;
    }
    // الحصول على بيانات العنوان من العنوان المختار أو من النموذج
    const addressData = currentSelectedAddress || {};
    
    if (!addressData.address || !addressData.city || !addressData.phone) {
      toast({
        title: "يرجى إدخال جميع بيانات التوصيل للمتابعة.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id || "guest",
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        fullName: addressData?.fullName || "عميل",
        address: addressData?.address,
        city: addressData?.city,
        phone: addressData?.phone,
        country: "ليبيا",
      },
      orderStatus: "confirmed",
      paymentMethod: "cash_on_delivery",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "تم إرسال الطلب بنجاح! ادفع عند الاستلام.",
        });
        setIsPaymemntStart(false);
      } else {
        console.log('Order error:', data);
        toast({
          title: data?.payload?.message || "فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    });
  }



  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">يجب تسجيل الدخول أولاً</h2>
          <p className="text-gray-600">لإتمام عملية الشراء، يرجى تسجيل الدخول من خلال الزر الموجود في أعلى الصفحة</p>
          <div className="mt-6">
            <Button onClick={() => window.location.href = '/auth/login'} className="px-8 py-2">
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">

      <div className="relative h-[300px] w-full overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">إتمام الطلب</h1>
            <p className="text-lg">أسولة العسولة</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">الإجمالي</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleCashOnDelivery} className="w-full">
              إتمام الطلب - الدفع عند الاستلام
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
