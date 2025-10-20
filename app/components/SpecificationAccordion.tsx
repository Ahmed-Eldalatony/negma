import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Package, Truck, CreditCard, Clock } from "lucide-react";

interface Specification {
  label: string;
  value: string;
}

interface SpecificationAccordionProps {
  specifications: Specification[];
}

const icons: Record<string, any> = {
  'سياسة الدفع عند الاستلام': CreditCard,
  'ضمان 30 يوماً': Package,
  'شحن مجاني': Truck,
  'دعم العملاء': Clock,
};

export default function SpecificationAccordion({ specifications }: SpecificationAccordionProps) {
  return (
    <div className="space-y-3" data-testid="specification-accordion">
      <Accordion type="single" collapsible className="space-y-2">
        {specifications.map((spec, index) => {
          const Icon = icons[spec.label] || Package;
          
          return (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="border rounded-md px-4"
              data-testid={`accordion-item-${index}`}
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3 text-right">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{spec.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 text-sm text-muted-foreground">
                {spec.value}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
