import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/shared/mock-data';

const FAQ = () => {
	return (
		<section className="py-16 md:py-24 bg-gradient-to-b from-muted/20 to-background">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12 animate-fade-in">
					<h2 className="text-3xl md:text-5xl font-bold mb-4">الأسئلة الشائعة ❓</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						إجابات على جميع استفساراتك قبل الطلب
					</p>
				</div>

				<div className="max-w-3xl mx-auto">
					<Accordion type="single" collapsible className="space-y-4">
						{faqs.map((faq, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className="bg-card border-2 rounded-xl px-6 hover:border-primary/50 transition-colors animate-fade-in"
								style={{
									animationDelay: `${index * 0.05}s`,
								}}
							>
								<AccordionTrigger className="text-right hover:no-underline py-5">
									<span className="text-lg font-semibold">{faq.question}</span>
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>

					{/* Still have questions */}
				</div>
			</div>
		</section>
	);
};

export default FAQ;
