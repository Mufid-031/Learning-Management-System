import { RootContent } from '@/components/root-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ShineBorder } from '@/components/ui/shine-border';
import { useAverage } from '@/hooks/use-average';
import { useInitials } from '@/hooks/use-initials';
import RootLayout from '@/layouts/root-layout';
import { CourseProgress, SharedData, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  Book,
  BookOpen,
  Briefcase,
  ChartColumnDecreasingIcon,
  CheckCircle2Icon,
  Edit2Icon,
  ExternalLink,
  Mail,
  StarIcon,
  TimerIcon,
  Users2,
  XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user } = usePage<SharedData & { user: { data: User } }>().props;
  const getInitials = useInitials();
  const getAverage = useAverage();
  const [filteredCourses, setFilteredCourses] = useState<CourseProgress[]>([]);

  const handleFilterChange = (selectValue: string) => {
    if (selectValue === 'all') {
      setFilteredCourses(user.data.student?.course_progresses || []);
    } else {
      const filtered = user.data.student?.course_progresses.filter(
        (progress) =>
          progress.is_completed == (selectValue == 'true' ? true : false),
      );
      setFilteredCourses(filtered || []);
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Tanggal tidak diketahui';
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  useEffect(() => {
    // Ensure this is truly getting data. If user.data.student is null/undefined,
    // this will correctly set filteredCourses to an empty array.
    setFilteredCourses(user.data.student?.course_progresses || []);
    console.log(
      'Course progresses received:',
      user.data.student?.course_progresses,
    );
    console.log('Filtered courses after useEffect:', filteredCourses); // This might lag by one render, but useful
  }, [user.data.student?.course_progresses]);

  // Framer Motion Variants for Staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child animation
      },
    },
  };

  // Ensure these variants always transition from a hidden state to a visible state
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <RootLayout>
      <Head title={user.data.name + ' - Profil'} />

      <div className="relative w-full px-10 py-32">
        <BackgroundBeams />
        <RootContent>
          <motion.div // Animate the entire header content
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left"
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: 'easeInOut',
                    type: 'spring',
                    damping: 10,
                    stiffness: 100,
                  },
                }}
              >
                <Avatar className="border-background ring-primary h-36 w-36 border-4 shadow-lg ring-2 md:h-44 md:w-44">
                  <AvatarImage
                    src={`/storage/${user.data.avatar}`}
                    alt={user.data.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl">
                    {getInitials(user.data.name)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.5,
                  type: 'spring',
                  damping: 10,
                  stiffness: 100,
                }}
              >
                <Button
                  className="hover:bg-primary/90 ring-primary absolute right-1 bottom-1 h-10 w-10 cursor-pointer rounded-full shadow-md md:h-12 md:w-12"
                  asChild
                  aria-label="Edit Profil"
                >
                  <Link href="/student/settings/profile">
                    <Edit2Icon size={20} />
                  </Link>
                </Button>
              </motion.div>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-2"
            >
              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold tracking-tight md:text-4xl"
              >
                {user.data.name}
              </motion.h1>
              {user.data.email && (
                <motion.span
                  variants={itemVariants}
                  className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:justify-start"
                >
                  <Mail size={16} />
                  <p>{user.data.email}</p>
                </motion.span>
              )}
              <motion.span
                variants={itemVariants}
                className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:justify-start"
              >
                <TimerIcon size={16} />
                <p>Bergabung sejak {formatDate(user.data.created_at)}</p>
              </motion.span>
            </motion.div>
          </motion.div>
        </RootContent>
      </div>

      <RootContent>
        <Separator />
        <div className="my-10 px-10 md:my-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
            className="mb-4 flex items-center justify-between"
          >
            <h2 className="mb-6 text-2xl font-semibold md:mb-8">
              Kursus yang Diikuti
            </h2>
            <Select defaultValue="all" onValueChange={handleFilterChange}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="true">Kursus diselesaikan</SelectItem>
                <SelectItem value="false">Kursus berlangsung</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          {filteredCourses && filteredCourses.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              // Adding `key` here to force re-animation if courses change (e.g., filter)
              key={filteredCourses.map((c) => c.id).join('-')}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredCourses.map((progress) => (
                <motion.div
                  key={progress.id}
                  variants={cardVariants}
                  // Optionally, add `whileInView="show"` and `viewport={{ once: true }}`
                  // if you want cards to animate only when they scroll into view.
                  // For initial load, `animate="show"` on parent is fine.
                >
                  <Card className="relative flex flex-col overflow-hidden transition-shadow hover:shadow-lg dark:border-slate-700">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="bg-muted relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            className="h-full w-full object-cover"
                            src={`/storage/${progress.course.image}`}
                            alt={progress.course.title}
                            onError={(e) => {
                              // Fallback for broken images, can set display to block to see placeholder
                              e.currentTarget.style.display = 'none';
                              // Or replace with a default image:
                              // e.currentTarget.src = '/path/to/default-image.png';
                            }}
                          />
                        </div>
                        <div className="flex flex-grow flex-col gap-1">
                          <span
                            className={`mb-1 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                              progress.is_completed
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}
                          >
                            {progress.is_completed ? (
                              <CheckCircle2Icon size={14} />
                            ) : (
                              <XIcon size={14} />
                            )}
                            {progress.is_completed
                              ? 'Selesai'
                              : 'Belum Selesai'}
                          </span>
                          <CardTitle className="line-clamp-2 text-lg font-semibold">
                            {progress.course.title}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription className="mt-3">
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <span className="flex items-center gap-1.5">
                            <TimerIcon size={14} className="text-blue-500" />
                            {progress.course.duration} Jam
                          </span>
                          <span className="flex items-center gap-1.5">
                            <StarIcon
                              size={14}
                              className="text-amber-500"
                              fill="currentColor"
                            />
                            {progress.course.ratings.length > 0
                              ? getAverage(
                                  progress.course.ratings.map(
                                    (rating) => rating.rating,
                                  ),
                                ).toFixed(1)
                              : 0}{' '}
                          </span>
                          <span className="flex items-center gap-1.5 capitalize">
                            <ChartColumnDecreasingIcon
                              size={14}
                              className="text-purple-500"
                            />{' '}
                            {progress.course.difficulty}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {progress.course.information ||
                          'Informasi kursus tidak tersedia.'}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 dark:border-slate-700">
                      <div className="text-muted-foreground flex w-full flex-col gap-3 text-xs">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <Book size={14} className="text-cyan-500" />
                            {progress.course.modules.length} Modul
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={14} className="text-purple-500" />
                            {progress.course.modules.reduce(
                              (acc, module) => acc + module.lessons.length,
                              0,
                            )}{' '}
                            Lessons
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users2 size={14} className="text-orange-500" />
                            {progress.course.students.length} Siswa
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="mt-2 w-full"
                        >
                          <Link href={`/academies/${progress.course.id}`}>
                            {' '}
                            Lihat Kursus
                            <ExternalLink size={14} className="ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                    <ShineBorder
                      shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                    />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center rounded-md border border-dashed p-10 text-center"
            >
              <Briefcase size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">
                Anda Belum Mengikuti/Menyelesaikan Kursus Apapun
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Jelajahi katalog kursus kami dan mulai perjalanan belajar Anda!
              </p>
              <Button asChild className="mt-6">
                <Link href="/learning-paths"> Jelajahi Kursus</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </RootContent>
    </RootLayout>
  );
}
