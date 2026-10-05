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
  { title: "Misión compartida", description: "Tu apoyo nos ayuda a servir a las familias, apoyar a los jóvenes y fortalecer nuestra comunidad." },
  { title: "Transparencia", description: "Usamos cada ofrenda de forma responsable y con integridad al servicio de nuestra iglesia." },
  { title: "Crecimiento espiritual", description: "Tu generosidad contribuye al crecimiento espiritual y la vida de nuestra comunidad de fe." },
];

export default function OfrendasPage() {
  return (
    <div className="section-shell flex flex-col gap-10 py-8 sm:gap-14 sm:py-12 lg:py-16">
      <DonationHero
        title="Donaciones y Ofrendas"
        subtitle="Tu generosidad ayuda a apoyar la misión, la comunidad y las actividades de la iglesia."
        imageUrl="/conocenos.jpeg"
      />

      <section id="donacion" className="scroll-mt-24 grid gap-6 lg:grid-cols-[1.08fr_.92fr] lg:items-stretch">
        <section className="flex flex-col justify-center rounded-3xl border border-primary/20 bg-base-100/80 px-5 py-8 shadow-xl shadow-base-content/5 backdrop-blur-xl sm:px-8 sm:py-10">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Tu aporte</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-base-content sm:text-4xl">Haz tu donación</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/70">Elige el importe que deseas aportar. El pago se realiza de forma segura con tarjeta.</p>
          </div>
          <DonationForm />
        </section>

        <ScriptureCard
          title="Dar con alegría"
          verse="Cada uno dé como propuso en su corazón, no con tristeza ni por obligación, porque Dios ama al dador alegre."
          reference="2 Corintios 9:7"
        />
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Opciones de pago</p>
          <h2 className="mt-2 text-balance font-serif text-3xl font-semibold text-base-content sm:text-4xl">Elige cómo colaborar</h2>
          <p className="mt-3 text-base leading-7 text-base-content/70">La tarjeta está disponible ahora. Añadiremos otras opciones cuando estén listas.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <PaymentMethodCard title="Tarjeta bancaria" description="Realiza tu aportación desde este sitio mediante la pasarela de pago Redsys." icon="card" status="available" />
          <PaymentMethodCard title="Bizum" description="La opción de Bizum todavía no está habilitada." icon="smartphone" status="soon" />
          <PaymentMethodCard title="Transferencia bancaria" description="Estamos preparando esta opción; los datos bancarios se publicarán cuando estén confirmados." icon="landmark" status="soon" />
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Nuestra misión</p>
          <h2 className="mt-2 text-balance font-serif text-3xl font-semibold text-base-content sm:text-4xl">Cómo tu apoyo marca la diferencia</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {infoCards.map((card) => <InfoCard key={card.title} title={card.title} description={card.description} />)}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-base-100/70 to-secondary/10 shadow-lg backdrop-blur-xl">
        <div className="space-y-4 px-6 py-10 text-center sm:px-8 sm:py-14">
          <h2 className="font-serif text-3xl font-semibold text-base-content sm:text-4xl">Gracias por tu generosidad</h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-base-content/75 sm:text-lg">
            Cada donación, sin importar la cantidad, nos ayuda a cumplir nuestra misión de servir a la comunidad y fortalecer la fe. Tu apoyo es valorado y es parte importante de nuestro ministerio.
          </p>
          <p className="pt-2 text-sm text-base-content/65">Si tienes preguntas, escríbenos a <a className="link link-hover font-medium" href="mailto:sabadellcci@gmail.com">sabadellcci@gmail.com</a>.</p>
        </div>
      </section>
    </div>
  );
}
