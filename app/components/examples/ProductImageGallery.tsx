import ProductImageGallery from '../ProductImageGallery';

export default function ProductImageGalleryExample() {
  const images = [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
    'https://images.unsplash.com/photo-1622560481726-9f7a1c0e3b5f?w=800',
  ];

  return (
    <div className="p-4 max-w-mobile mx-auto">
      <ProductImageGallery images={images} productName="حقيبة الظهر" />
    </div>
  );
}
