import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FaqItem {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: "How long does domain registration take?",
    answer: "Domain registration on Miden.ID is processed instantly once your transaction is confirmed on the blockchain. After payment confirmation, your .miden domain will be immediately available in your wallet and ready to use."
  },
  {
    question: "What happens if I don't renew my domain?",
    answer: "If your domain expires and is not renewed within the grace period, it will become available for others to register."
  },
  {
    question: "Can I transfer my domain to another wallet?",
    answer: "Yes, .miden domains are fully transferable. As the domain owner, you can transfer your domain to any other Miden wallet address at any time. The transfer is processed on-chain and ownership is updated immediately."
  },
  {
    question: "What are the benefits of multi-year registration?",
    answer: "Multi-year registration locks in your domain at the current price and protects you from potential price increases. You'll also save on transaction fees by registering for multiple years at once instead of renewing annually."
  },
  {
    question: "Is my payment secure?",
    answer: "All payments are processed directly through your Miden wallet using blockchain technology. We never have access to your private keys or funds. Transactions are secure, transparent, and verifiable on the Miden blockchain."
  }
]

export function Faq() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
