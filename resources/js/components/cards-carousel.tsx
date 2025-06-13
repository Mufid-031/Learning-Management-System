import { Card, Carousel } from '@/components/ui/apple-cards-carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Academic, Course, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  Book,
  ChartNoAxesColumnIncreasing,
  Users,
  Users2,
} from 'lucide-react';
import { useState } from 'react';
import { RootContent } from './root-content';
import { CardContent, Card as CardUi } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function CardsCarousel() {
  const { academics } = usePage<
    SharedData & { academics: { data: Academic[] } }
  >().props;
  const isMobile = useIsMobile();
  const [isActive, setIsActive] = useState<string>(academics.data[0].title);

  const academicCards = academics.data.map((academic, index) => (
    <TabsTrigger
      key={index}
      value={academic.title}
      className="bg-background"
      asChild
    >
      <Card
        academic={academic}
        index={index}
        layout={isMobile}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    </TabsTrigger>
  ));

  const courseCards = academics.data
    .find((academic) => isActive === academic.title)
    ?.courses.map((course, index) => (
      <CardCourse key={index} course={course} />
    ));

  return (
    <RootContent>
      <Tabs
        defaultValue={isActive}
        value={isActive}
        onValueChange={(value) => setIsActive(value)}
      >
        <section className="mx-10 flex h-24 items-center overflow-auto lg:mt-32 lg:overflow-visible">
          <TabsList className="bg-background">
            {isMobile ? (
              <div className="flex w-full gap-4">
                {academics.data.map((academic, index) => (
                  <TabsTrigger
                    key={index}
                    value={academic.title}
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=inactive]:bg-muted data-[state=inactive]:hover:bg-muted/80 relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium capitalize"
                  >
                    {academic.title}
                    {isActive == academic.title && (
                      <motion.div
                        className="bg-primary absolute -bottom-1 left-0 h-0.5"
                        layoutId="activeTabIndicator"
                        layout
                      />
                    )}
                  </TabsTrigger>
                ))}
              </div>
            ) : (
              <Carousel items={academicCards} />
            )}
          </TabsList>
        </section>
        <CardUi className="bg-muted mx-10 mt-10 mb-10 flex flex-col justify-between rounded-xl py-10 lg:mt-40 lg:flex-row">
          <CardContent>
            <AnimatePresence>
              {academics.data.map((academic, index) => (
                <TabsContent
                  key={index}
                  value={academic.title}
                  className="w-full pt-28 lg:w-[30rem]"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mb-3 text-3xl font-semibold"
                  >
                    {academic.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="text-muted-foreground mb-3 flex gap-2 text-sm"
                  >
                    <Book className="h-4 w-4" />
                    {academic.courses.length} Kelas
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="text-muted-foreground mb-3 flex gap-2 text-sm"
                  >
                    <Users className="h-4 w-4" />
                    {academic.courses.reduce(
                      (acc, course) => acc + course.students.length,
                      0,
                    )}{' '}
                    Siswa
                  </motion.p>
                  <Separator className="bg-muted-foreground mb-5" />
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {academic.description}
                  </motion.p>
                </TabsContent>
              ))}
            </AnimatePresence>
          </CardContent>
          <div className="h-[34rem] w-full overflow-hidden lg:w-2xl">
            <Carousel items={courseCards!} />
          </div>
        </CardUi>
      </Tabs>
    </RootContent>
  );
}

function CardCourse({ course }: { course: Course }) {
  // const updateCourses()

  return (
    <motion.div
      whileHover={{
        y: -130,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: 0.3,
          ease: 'easeInOut',
        },
      }}
      className="bg-accent-foreground w-74 overflow-hidden rounded-xl"
    >
      <Link href={`/academies/${course.id}`}>
        <div className="bg-muted-foreground h-56 w-full">
          <img
            className="h-full w-full object-cover"
            src={`/storage/${course.image}`}
            alt={course.title}
          />
        </div>
        <div className="p-4">
          <p className="text-muted mb-3 flex items-center gap-2 text-sm font-semibold">
            <ChartNoAxesColumnIncreasing className="h-4 w-4" />
            Langkah {course.order}
          </p>
          <h3 className="text-md text-muted mb-7 font-semibold">
            {course.title}
          </h3>
          {/* <p className="text-muted mb-3 flex items-center gap-2 text-sm">
          <Star className="h-4 w-4" fill="yellow" />
          {course.ratings}
        </p> */}
          <p className="text-muted mb-7 flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-blue-500" />
            Level {course.difficulty}
          </p>
          <p className="text-muted mb-7 flex items-center gap-2 text-sm">
            <Book className="h-4 w-4" />
            {course.information}
          </p>
          <div className="mb-2 flex items-center gap-5">
            <p className="text-muted flex items-center gap-2 text-sm">
              <Book className="h-4 w-4" />
              {course.duration}
            </p>
            <p className="text-muted flex items-center gap-2 text-sm">
              <Users2 className="h-4 w-4" />
              {course.students.length}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
