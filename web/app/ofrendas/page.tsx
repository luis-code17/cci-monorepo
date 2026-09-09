import { DonationHero } from "@/components/donation/DonationHero";
import { DonationForm } from "@/components/donation/DonationForm";
import { PaymentMethodCard } from "@/components/donation/PaymentMethodCard";
import { ScriptureCard } from "@/components/donation/ScriptureCard";
import { InfoCard } from "@/components/InfoCard";

export const metadata = {
  title: "Donaciones y Ofrendas - CCI Sabadell",
  description: "Apoya la misión de CCI Sabadell con tu donación. Tu generosidad ayuda a fortalecer nuestra comunidad cristiana en Sabadell.",
};

const infoCards = [
  {
    title: "Misión Compartida",
    description: "Tu apoyo nos ayuda a servir a las familias, apoyar a los jóvenes y fortalecer nuestra comunidad.",
  },
  {
    title: "Transparencia",
    description: "Usamos cada ofrenda de forma responsable y con integridad al servicio de nuestra iglesia.",
  },
  {
    title: "Crecimiento Espiritual",
    description: "Tu generosidad contribuye al crecimiento espiritual y la vida de nuestra comunidad de fe.",
  },
];

export default function OfrendasPage() {
  return (
    <div className="section-shell flex flex-col gap-12 py-10 sm:py-12 lg:py-16">
      {/* Hero Section */}
      <DonationHero
        title="Donaciones y Ofrendas"
        subtitle="Tu generosidad ayuda a apoyar la misión, la comunidad y las actividades de la iglesia."
        imageUrl="/anuncio_miercoles.jpg"
      />

      {/* Donation Form and Scripture */}
      <section className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <section className="surface-card flex min-h-104 flex-col justify-center px-6 py-12 sm:px-8">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-base-content/55 font-medium">Tu aporte</p>
            <h2 className="mt-2 text-3xl font-semibold font-serif sm:text-4xl">Haz tu donación</h2>
          </div>
          <DonationForm />
        </section>

        <ScriptureCard
          title="Dar con Alegría"
          verse="Cada uno dé como propuso en su corazón, no con tristeza ni por obligación, porque Dios ama al dador alegre."
          reference="2 Corintios 9:7"
        />
      </section>

      {/* Payment Methods Section */}
      <section className="space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55 font-medium">Métodos de Pago</p>
          <h2 className="mt-2 text-balance text-3xl font-semibold sm:text-4xl font-serif">Formas de donar</h2>
          <p className="mt-3 max-w-2xl mx-auto text-base leading-7 text-base-content/70">
            Estamos preparando varias opciones seguras y cómodas para tu donación.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PaymentMethodCard
            title="Bizum"
            description="Envía tu donación de forma rápida y segura"
            icon="smartphone"
            status="soon"
          />
          <PaymentMethodCard
            title="Transferencia Bancaria"
            description="Realiza una transferencia directa a nuestra cuenta"
            icon="landmark"
            status="coming"
            bankDetails={{
              titular: "CCI SABADELL",
              iban: "ES00 0000 0000 0000 0000 0000",
              concepto: "Donativo",
            }}
          />
        </div>
      </section>

      {/* Information Cards */}
      <section className="space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55 font-medium">Información</p>
          <h2 className="mt-2 text-balance text-3xl font-semibold sm:text-4xl font-serif">Cómo tu apoyo marca la diferencia</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {infoCards.map((card) => (
            <InfoCard key={card.title} title={card.title} description={card.description} />
          ))}
        </div>
      </section>

      {/* Closing Section */}
      <section className="surface-card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
        <div className="px-6 sm:px-8 lg:px-12 py-12 sm:py-14 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-base-content">
            Gracias por tu generosidad
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg leading-8 text-base-content/75">
            Cada donación, sin importar la cantidad, nos ayuda a cumplir nuestra misión de servir a la comunidad y fortalecer la fe. 
            Tu apoyo es valorado y es parte importante de nuestro ministerio.
          </p>
          <p className="text-sm text-base-content/60 pt-4">
            Si tienes preguntas sobre donaciones, contáctanos en la iglesia o a través de nuestras redes sociales.
          </p>
        </div>
      </section>
    </div>
  );
}
