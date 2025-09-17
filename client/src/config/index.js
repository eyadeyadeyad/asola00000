export const registerFormControls = [
  {
    name: "userName",
    label: "اسم المستخدم",
    placeholder: "أدخل اسم المستخدم",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "البريد الإلكتروني",
    placeholder: "أدخل بريدك الإلكتروني",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "كلمة المرور",
    placeholder: "أدخل كلمة المرور",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "البريد الإلكتروني",
    placeholder: "أدخل بريدك الإلكتروني",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "كلمة المرور",
    placeholder: "أدخل كلمة المرور",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "اسم المنتج",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "أدخل اسم المنتج",
  },
  {
    label: "وصف المنتج",
    name: "description",
    componentType: "textarea",
    placeholder: "أدخل وصف المنتج",
  },
  {
    label: "الفئة",
    name: "category",
    componentType: "select",
    options: [
      { id: "women", label: "نسائي" },
    ],
  },
  {
    label: "الماركة",
    name: "brand",
    componentType: "select",
    options: [
      { id: "asola", label: "أسولة العسولة" },
    ],
  },
  {
    label: "السعر",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "أدخل سعر المنتج",
  },
  {
    label: "سعر التخفيض",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "أدخل سعر التخفيض (اختياري)",
  },
  {
    label: "الكمية المتوفرة",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "أدخل الكمية المتوفرة",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "الرئيسية",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "المنتجات",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "نسائي",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "بحث",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  women: "نسائي",
};

export const brandOptionsMap = {
  asola: "أسولة العسولة",
};

export const filterOptions = {
  category: [
    { id: "women", label: "نسائي" },
  ],
  brand: [
    { id: "asola", label: "أسولة العسولة" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "السعر: من الأقل للأعلى" },
  { id: "price-hightolow", label: "السعر: من الأعلى للأقل" },
  { id: "title-atoz", label: "الاسم: أ إلى ي" },
  { id: "title-ztoa", label: "الاسم: ي إلى أ" },
];

export const addressFormControls = [
  {
    label: "الاسم الكامل",
    name: "fullName",
    componentType: "input",
    type: "text",
    placeholder: "أدخل اسمك الكامل",
  },
  {
    label: "العنوان",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "أدخل عنوانك",
  },
  {
    label: "المنطقة في ليبيا",
    name: "city",
    componentType: "select",
    options: [
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
    ],
  },
  {
    label: "رقم الهاتف",
    name: "phone",
    componentType: "input",
    type: "tel",
    placeholder: "أدخل رقم هاتفك",
  },
];
