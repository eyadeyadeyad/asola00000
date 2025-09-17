// التحقق من صحة بيانات الطلب
const validateOrderData = (req, res, next) => {
  const { userId, cartItems, addressInfo, totalAmount } = req.body;

  // التحقق من وجود معرف المستخدم
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "معرف المستخدم مطلوب",
    });
  }

  // التحقق من وجود منتجات في السلة
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "يجب أن تحتوي السلة على منتج واحد على الأقل",
    });
  }

  // التحقق من بيانات كل منتج في السلة
  for (let item of cartItems) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "بيانات المنتج غير صحيحة",
      });
    }
  }

  // التحقق من بيانات العنوان
  if (!addressInfo) {
    return res.status(400).json({
      success: false,
      message: "بيانات العنوان مطلوبة",
    });
  }

  const requiredAddressFields = ['fullName', 'address', 'city', 'phone'];
  for (let field of requiredAddressFields) {
    if (!addressInfo[field] || (typeof addressInfo[field] === 'string' && addressInfo[field].trim() === '')) {
      const fieldNames = {
        fullName: 'الاسم الكامل',
        address: 'العنوان',
        city: 'المنطقة',
        phone: 'رقم الهاتف'
      };
      return res.status(400).json({
        success: false,
        message: `${fieldNames[field]} مطلوب`,
      });
    }
  }

  // التحقق من صحة رقم الهاتف (يجب أن يحتوي على أرقام فقط)
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (!phoneRegex.test(addressInfo.phone)) {
    return res.status(400).json({
      success: false,
      message: "رقم الهاتف غير صحيح",
    });
  }

  // التحقق من المبلغ الإجمالي
  if (!totalAmount || totalAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "المبلغ الإجمالي غير صحيح",
    });
  }

  next();
};

// التحقق من صحة بيانات إضافة المنتج للسلة
const validateCartData = (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "معرف المنتج مطلوب",
    });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "الكمية يجب أن تكون أكبر من صفر",
    });
  }

  next();
};

module.exports = {
  validateOrderData,
  validateCartData,
};