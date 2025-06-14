import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Course, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRightCircle } from 'lucide-react';
import { RootContent } from './root-content';
import { Animatedcards } from './ui/animated-cards';
import { BlurFade } from './ui/blur-fade';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Marquee } from './ui/marquee';

const ourTeams = [
  {
    quote:
      'Jack of all trades, master of none. but oftentimes better than a master of one',
    name: 'Ahmad Mufid Risqi',
    designation: 'Fullstack Developer',
    src: '/mufid.webp',
  },
  {
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: 'Ahmad Syauqi Fuady',
    designation: 'Frontend Developer',
    src: '/fuad.jpg',
  },
  {
    quote:
      "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    name: 'Maulana Ardiansyah',
    designation: 'Backend Developer',
    src: '/maulana.jpg',
  },
];

export function RootStandartGlobal() {
  const { courses } = usePage<SharedData>().props;
  const isMobile = useIsMobile();

  const firstRow = courses.data.slice(0, courses.data.length / 2);
  const secondRow = courses.data.slice(3, courses.data.length);

  return (
    <RootContent>
      <section className="md:bg-muted mx-4 mb-10 grid grid-cols-1 overflow-hidden rounded-xl md:h-96 md:grid-cols-2">
        <div className="m-5 px-5 pt-7 md:px-10">
          <h2 className="mb-5 text-2xl font-bold md:text-3xl">
            <BlurFade direction="up" duration={0.7} inView>
              Belajar dengan kelas standar industri global
            </BlurFade>
          </h2>
          <p className="text-muted-foreground md:text-md mb-5 text-sm">
            <BlurFade
              direction="right"
              duration={0.7}
              delay={0.5}
              offset={20}
              inView
            >
              Kelas di NextLMS Academy tersedia bagi yang belum memiliki
              kemampuan programming (dasar) hingga yang sudah profesional.
            </BlurFade>
          </p>
          <Button variant="link" className="group text-md cursor-pointer">
            <BlurFade
              direction="right"
              duration={0.7}
              delay={0.8}
              offset={20}
              inView
              className="flex items-center gap-2"
            >
              <Link href="/learning-paths">Lihat semua kelas</Link>
              <ArrowRightCircle className="h-7 w-7 transition-all duration-150 group-hover:translate-x-1" />
            </BlurFade>
          </Button>
        </div>
        <div
          className={cn(
            'relative flex h-full w-full items-center justify-center md:overflow-hidden',
            isMobile ? 'flex-col' : 'flex-row',
          )}
        >
          <Marquee
            pauseOnHover
            vertical={isMobile ? false : true}
            className="[--duration:20s]"
          >
            {firstRow?.map((course) => (
              <ReviewCard key={course.id} course={course} />
            ))}
          </Marquee>
          <Marquee
            reverse
            pauseOnHover
            vertical={isMobile ? false : true}
            className="[--duration:20s]"
          >
            {secondRow?.map((course) => (
              <ReviewCard key={course.id} course={course} />
            ))}
          </Marquee>
        </div>
      </section>
      <div className="mt-10 px-5 text-center">
        <h2 className="mb-5 text-2xl font-bold">
          <BlurFade direction="up" duration={0.7} inView>
            Kenal lebih dekat dengan kami!
          </BlurFade>
        </h2>
        <p className="text-muted-foreground mb-10 text-sm md:text-base">
          <BlurFade direction="right" duration={0.7} delay={0.5} inView>
            Sebagai platform edukasi teknologi, pengembangan skill para
            developer adalah fokus Dicoding. Untuk mencapainya,
          </BlurFade>
          <BlurFade direction="left" duration={0.7} delay={0.7} inView>
            tersedia berbagai kelas online, program pelatihan, dan sertifikasi
            pemrograman dengan kualitas yang terjamin serta 2 layanan utama:
            Code Review & Forum Diskusi.
          </BlurFade>
        </p>
      </div>
      <Card className="bg-muted mx-10 mb-10 flex flex-col justify-between rounded-xl p-10">
        <Animatedcards cards={ourTeams} autoplay />
      </Card>
    </RootContent>
  );
}

const ReviewCard = ({ course }: { course: Course }) => {
  return (
    <figure
      className={cn(
        'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border sm:w-36 md:w-fit',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
      )}
    >
      <div className="objcet-cover relative h-40 w-full bg-cover bg-center">
        <img src={`/storage/${course.image}`} alt={course.title} className="" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <h3 className="text-md absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-3 text-center font-semibold">
          {course.title}
        </h3>
      </div>
    </figure>
  );
};
