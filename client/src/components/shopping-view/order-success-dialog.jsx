import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

function OrderSuccessDialog({ open, setOpen, orderDetails }) {
  const handleClose = () => {
    setOpen(false);
    // إعادة توجيه للصفحة الرئيسية أو صفحة الطلبات
    window.location.href = "/shop/account";
  };

  const handleContinueShopping = () => {
    setOpen(false);
    window.location.href = "/shop/listing";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            تم إتمام الطلب بنجاح!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">
              شكراً لك! تم استلام طلبك بنجاح
            </p>
            <p className="text-green-600 text-sm mt-2">
              رقم الطلب: #{orderDetails?.orderId?.slice(-8)}
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>✅ سيتم التواصل معك قريباً لتأكيد الطلب</p>
            <p>✅ التوصيل خلال 2-3 أيام عمل</p>
            <p>✅ الدفع عند الاستلام</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleContinueShopping}
              className="flex-1"
            >
              متابعة التسوق
            </Button>
            <Button 
              onClick={handleClose}
              className="flex-1"
            >
              عرض طلباتي
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            يمكنك متابعة حالة طلبك من صفحة "طلباتي" في حسابك
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderSuccessDialog;