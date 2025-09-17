import { Button } from "@/components/ui/button";
// استخدام صور من الإنترنت للأزياء النسائية
const fashionImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop", // أزياء نسائية
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop", // فساتين
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop", // موضة
];
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPin,
  Phone,
  Facebook,
  Heart,
  Star,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

// تم حذف الأقسام والماركات
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    const userId = user?.id || "guest";
    
    dispatch(
      addToCart({
        userId: userId,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        // إعادة تحميل السلة لضمان ظهور البيانات
        dispatch(fetchCartItems(userId));
        // إطلاق حدث لتحديث الهيدر
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        toast({
          title: "تم إضافة المنتج لعربة التسوق",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % fashionImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
        {fashionImages.map((image, index) => (
          <div key={index} className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}>
            <img
              src={image}
              className="w-full h-full object-cover"
              alt={`أزياء نسائية ${index + 1}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        ))}
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-pink-500/20 backdrop-blur-sm rounded-full text-pink-200 text-sm font-medium mb-4">
                  ✨ مجموعة جديدة 2026
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  أسولة
                </span>
                <br />
                <span className="text-white">العسولة</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                اكتشفي عالم الأناقة والجمال مع أحدث صيحات الموضة النسائية
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/shop/listing')}
                >
                  تسوقي الآن 🛍️
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/shop/listing')}
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
                >
                  اكتشفي المزيد
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + fashionImages.length) % fashionImages.length
            )
          }
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 w-12 h-12 rounded-full transition-all duration-300"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % fashionImages.length
            )
          }
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 w-12 h-12 rounded-full transition-all duration-300"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {fashionImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-white scale-125" 
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Featured Collections */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              مجموعاتنا المميزة
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اكتشفي أحدث صيحات الموضة العالمية المصممة خصيصاً لإطلالتك المثالية
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop" 
                alt="مجموعة الأزياء الكلاسيكية"
                className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold mb-2">الأزياء الكلاسيكية</h3>
                <p className="text-lg mb-4 text-gray-200">أناقة لا تنتهي مع الزمن</p>
                <Button 
                  onClick={() => navigate('/shop/listing')}
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-6"
                >
                  اكتشفي المجموعة
                </Button>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop" 
                alt="مجموعة الأزياء العصرية"
                className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold mb-2">الأزياء العصرية</h3>
                <p className="text-lg mb-4 text-gray-200">إطلالات جريئة للمرأة المعاصرة</p>
                <Button 
                  onClick={() => navigate('/shop/listing')}
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-6"
                >
                  اكتشفي المجموعة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Special Offers */}
      <section className="py-20 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              عروض حصرية 🎉
            </h2>
            <p className="text-2xl text-pink-100 max-w-3xl mx-auto">
              خصومات تصل إلى 70% على مجموعة مختارة من أجمل الأزياء
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/20 transition-all duration-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">50%</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">فساتين سهرة</h3>
                <p className="text-pink-100 mb-6">مجموعة راقية من فساتين السهرة الأنيقة</p>
                <Button 
                  onClick={() => navigate('/shop/listing')}
                  className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-6 font-semibold"
                >
                  تسوقي الآن
                </Button>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/20 transition-all duration-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">40%</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">أزياء كاجوال</h3>
                <p className="text-pink-100 mb-6">إطلالات يومية مريحة وأنيقة</p>
                <Button 
                  onClick={() => navigate('/shop/listing')}
                  className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-6 font-semibold"
                >
                  تسوقي الآن
                </Button>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/20 transition-all duration-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">60%</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">إكسسوارات</h3>
                <p className="text-pink-100 mb-6">حقائب وأحذية ومجوهرات عصرية</p>
                <Button 
                  onClick={() => navigate('/shop/listing')}
                  className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-6 font-semibold"
                >
                  تسوقي الآن
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      
      {/* Products Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              منتجاتنا المميزة
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اكتشفي مجموعة منتقاة بعناية من أجمل الأزياء النسائية
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : [
                  // Placeholder products when no products available
                  ...Array(8).fill(null).map((_, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[3/4] hover:shadow-2xl transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-bold text-lg mb-2">منتج مميز {index + 1}</h3>
                        <p className="text-sm text-gray-200">قريباً في المتجر</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <Sparkles className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">قريباً</p>
                        </div>
                      </div>
                    </div>
                  ))
                ]
            }
          </div>
          
          {productList && productList.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/shop/listing')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                عرض جميع المنتجات
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-40 h-40 bg-pink-300/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              عن أسولة العسولة
            </h2>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              رحلة في عالم الأناقة والجمال، حيث تلتقي الموضة العالمية بالذوق الرفيع
              <br />
              <span className="text-lg text-gray-600 mt-4 block">
                نحن هنا لنجعل كل امرأة تشعر بالثقة والجمال في كل لحظة
              </span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">جودة استثنائية</h3>
              <p className="text-gray-600 leading-relaxed">نختار لك أفضل الخامات والتصاميم العصرية من أرقى دور الأزياء العالمية</p>
            </div>
            
            <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">خدمة راقية</h3>
              <p className="text-gray-600 leading-relaxed">فريق عمل متخصص ومحترف لتقديم أفضل تجربة تسوق ممكنة</p>
            </div>
            
            <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">أحدث الصيحات</h3>
              <p className="text-gray-600 leading-relaxed">نواكب أحدث صيحات الموضة العالمية ونقدمها لك بلمسة عربية أصيلة</p>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
            <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              تواصلي معنا
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group flex flex-col items-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">موقعنا</h4>
                <p className="text-gray-600 text-lg">صبراتة، ليبيا</p>
              </div>
              
              <div className="group flex flex-col items-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">اتصلي بنا</h4>
                <p className="text-gray-600 text-lg dir-ltr font-mono">+218 91-3365952</p>
              </div>
              
              <div className="group flex flex-col items-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Facebook className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">تابعينا</h4>
                <a 
                  href="https://www.facebook.com/aswlh.al.swlh.880474?locale=ar_AR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-purple-600 transition-colors cursor-pointer text-lg font-semibold hover:underline"
                >
                  أسولة العسولة
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;