import { db } from '@/app/_lib/prisma';
import BarbershopInfo from './_components/barbershop-info';
import ServiceItem from './_components/service-item';
import { getServerSession } from 'next-auth';
import { authOption } from '@/app/api/auth/[...nextauth]/route';

interface BarberShopDetaisPageProps {
  params: {
    id?: string;
  };
}

const BarberShopDetailsPage = async ({ params }: BarberShopDetaisPageProps) => {
  const session = await getServerSession(authOption);
  if (!params.id) {
    // TODO: redirecionar para a home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    // TODO: redirecionar para a home page
    return null;
  }
  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className='px-5 flex flex-col gap-4 py-6'>
        {barbershop.services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>
    </div>
  );
};

export default BarberShopDetailsPage;
