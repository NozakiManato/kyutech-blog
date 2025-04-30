import { ContactForm } from "@/components/dashboard/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">お問い合わせ</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            ご質問やお問い合わせがございましたら、以下のフォームからお気軽にご連絡ください。
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
