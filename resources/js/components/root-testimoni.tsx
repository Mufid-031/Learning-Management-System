import { useInitials } from '@/hooks/use-initials';
import { Rating, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRightFromSquare, StarIcon } from 'lucide-react';
import { RootContent } from './root-content';
import { Carousel } from './ui/apple-cards-carousel';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

export function RootTestimoni() {
  const { ratings } = usePage<SharedData & { ratings: { data: Rating[] } }>()
    .props;

  const cards = ratings.data.map((rating, index) => (
    <TestimoniCard key={index} rating={rating} />
  ));

  return (
    <RootContent>
      <section className="relative my-10 p-5 lg:mx-10">
        <h3 className="absolute top-7 left-10 text-xl font-semibold">
          Testimoni Siswa
        </h3>
        <Carousel
          items={cards}
          scrollLeftValue={-1050}
          scrollRightValue={1050}
        />
        <div className="flex w-full items-center justify-end">
          <Link href="/ratings">
            <Button variant="link" className="group cursor-pointer">
              Lihat semua
              <ArrowUpRightFromSquare />
            </Button>
          </Link>
        </div>
      </section>
    </RootContent>
  );
}

function TestimoniCard({ rating }: { rating: Rating }) {
  const getInitials = useInitials();

  return (
    <Card className="h-full w-md lg:w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-between p-10 lg:order-1">
          <p className="text-md text-muted-foreground mb-7">{rating.comment}</p>
          <Separator className="text-muted-foreground mb-5 w-full" />
          <div className="mb-5 flex flex-col gap-3">
            <p className="text-muted-foreground text-sm">
              {rating.student.user.name}
            </p>
            <p className="text-muted-foreground text-sm">
              {rating.course.title}
            </p>
            <div className="flex items-center gap-4">
              {Array.from({ length: 5 }, (_, k) => (
                <StarIcon
                  key={k}
                  className="h-4 w-4 text-amber-400"
                  fill={k < rating.rating ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-muted mx-5 h-96">
          {rating.student.user.avatar ? (
            <img
              className="h-full w-full object-cover"
              src={`/storage/${rating.student.user.image}`}
              alt={rating.student.user.name}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground text-3xl">
                {getInitials(rating.student.user.name)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
