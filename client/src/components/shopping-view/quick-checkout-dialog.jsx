import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";
import { createNewOrder } from "@/store/shop/order-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllAddresses } from "@/store/shop/address-slice";
import OrderSuccessDialog from "./order-success-dialog";

const libyanCities = [
  { id: "tripoli", label: "طرابلس" },
  { id: "benghazi", label: "بنغازي" },
  { id: "misrata", label: "مصراتة" },
  { id: "zawiya", label: "الزاوية" },
  { id: "bayda", label: "البيضاء" },
  { id: "tobruk", label: "طبرق" },
  { id: "derna", label: "درنة" },
  { id: "sirte", label: "سرت" },
  { id: "sebha", label: "سبها" },
  { id: "ghat", label: "غات" },
  { id: "other", label: "منطقة أخرى" },
];

function QuickCheckoutDialog({ open, setOpen, productDetails, quantity = 1 }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id && open) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user?.id, open]);

  useEffect(() => {
    // إذا كان لدى المستخدم عنوان محفوظ، استخدمه كقيم افتراضية
    if (addressList && addressList.length > 0) {
      const defaultAddress = addressList[0];
      setFormData({
        fullName: defaultAddress.fullName || "",
        address: defaultAddress.address || "",
        city: defaultAddress.city || "",
        phone: defaultAddress.phone || "",
      });
    }
  }, [addressList]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return formData.fullName.trim() !== "" && 
           formData.address.trim() !== "" && 
           formData.city !== "" && 
           formData.phone.trim() !== "";
  };

  const handleQuickCheckout = async () => {
    if (!isFormValid()) {
      toast({
        title: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // إضافة المنتج للسلة أولاً
      const addToCartResult = await dispatch(addToCart({
        userId: user.id,
        productId: productDetails._id,
        quantity: quantity,
      }));

      if (!addToCartResult?.payload?.success) {
        throw new Error("فشل في إضافة المنتج للسلة");
      }

      // جلب بيانات السلة المحدثة
      const cartResult = await dispatch(fetchCartItems(user.id));
      const cartItems = cartResult?.payload?.data;

      if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
        throw new Error("لا توجد منتجات في السلة");
      }

      // حساب المبلغ الإجمالي
      const totalAmount = cartItems.items.reduce((sum, item) => {
        const price = item.salePrice > 0 ? item.salePrice : item.price;
        return sum + (price * item.quantity);
      }, 0);

      // إنشاء الطلب
      const orderData = {
        userId: user.id,
        cartId: cartItems._id,
        cartItems: cartItems.items.map((item) => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          price: item.salePrice > 0 ? item.salePrice : item.price,
          quantity: item.quantity,
        })),
        addressInfo: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
          country: "ليبيا",
        },
        orderStatus: "confirmed",
        paymentMethod: "cash_on_delivery",
        paymentStatus: "pending",
        totalAmount: totalAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
      };

      console.log('Order data being sent:', orderData);
      const orderResult = await dispatch(createNewOrder(orderData));
      console.log('Order result:', orderResult);

      if (orderResult?.payload?.success) {
        setOrderResult(orderResult.payload);
        setOpen(false);
        setShowSuccessDialog(true);
        // إطلاق حدث لتحديث الهيدر
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        const errorMessage = orderResult?.payload?.message || orderResult?.error?.message || "فشل في إرسال الطلب";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("خطأ في الشراء السريع:", error);
      toast({
        title: error.message || "حدث خطأ أثناء إتمام الطلب",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      fullName: "",
      address: "",
      city: "",
      phone: "",
    });
  };

  if (!productDetails) return null;

  const productPrice = productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price;
  const totalPrice = productPrice * quantity;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>إتمام الشراء السريع</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* معلومات المنتج */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src={productDetails.image} 
                alt={productDetails.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm">{productDetails.title}</h3>
                <p className="text-sm text-gray-600">الكمية: {quantity}</p>
                <p className="font-bold text-lg">${totalPrice}</p>
              </div>
            </div>
          </div>

          {/* بيانات التوصيل */}
          <div className="space-y-3">
            <h3 className="font-medium">بيانات التوصيل</h3>
            
            <div>
              <Label htmlFor="fullName">الاسم الكامل *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <Label htmlFor="address">العنوان *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="أدخل عنوانك التفصيلي"
              />
            </div>

            <div>
              <Label htmlFor="city">المنطقة *</Label>
              <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {libyanCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="أدخل رقم هاتفك"
              />
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isProcessing}
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleQuickCheckout}
              className="flex-1"
              disabled={!isFormValid() || isProcessing}
            >
              {isProcessing ? "جاري المعالجة..." : "إتمام الطلب"}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            سيتم التوصيل والدفع عند الاستلام
          </p>
        </div>
      </DialogContent>
      
      {/* نافذة نجاح الطلب */}
      <OrderSuccessDialog 
        open={showSuccessDialog}
        setOpen={setShowSuccessDialog}
        orderDetails={orderResult}
      />
    </Dialog>
  );
}

export default QuickCheckoutDialog;