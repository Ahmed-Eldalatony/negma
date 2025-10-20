import SpecificationAccordion from '../SpecificationAccordion';

export default function SpecificationAccordionExample() {
  const specifications = [
    { label: 'سياسة الدفع عند الاستلام', value: 'الدفع عند وصول المنتج' },
    { label: 'ضمان 30 يوماً', value: 'ضمان استرداد في حالة عدم الرضا' },
    { label: 'شحن مجاني', value: 'عند الشراء بأكثر من 99 دولار' },
    { label: 'دعم العملاء', value: 'من الإثنين إلى السبت' },
  ];

  return (
    <div className="p-4 max-w-mobile mx-auto">
      <SpecificationAccordion specifications={specifications} />
    </div>
  );
}
