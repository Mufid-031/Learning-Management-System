import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShineBorder } from '@/components/ui/shine-border';
import StudentLayout from '@/layouts/student-layout';
import { cn } from '@/lib/utils';
import { SharedData, Student } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion'; // Import motion
import { BookMarked, BookOpen, CheckCircle, GraduationCap } from 'lucide-react';

export default function StudentDashboard() {
  const { auth, student } = usePage<
    SharedData & { student: { data: Student } }
  >().props;

  const allCourseProgresses = student?.data?.course_progresses || [];

  const coursesOngoingCount = allCourseProgresses.filter(
    (progress) => progress.is_completed === false,
  ).length;

  const coursesCompletedCount = allCourseProgresses.filter(
    (progress) => progress.is_completed === true,
  ).length;

  const totalEnrolledCourses = allCourseProgresses.length;

  const averageProgress =
    totalEnrolledCourses > 0
      ? allCourseProgresses.reduce(
          (sum, progress) => sum + Number(progress.progress_percentage),
          0,
        ) / totalEnrolledCourses
      : 0;

  // --- Framer Motion Variants ---

  // For welcome text and section titles
  const textFadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // For the main summary card and "Aktivitas Belajar Terbaru" Card
  const cardEntryVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  // For the inner stats boxes within the summary card
  const statBoxVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  // For the buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // For individual recent activity cards
  const activityCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Stagger container for elements appearing one after another
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child
        delayChildren: 0.2, // Initial delay before children start animating
      },
    },
  };

  return (
    <StudentLayout>
      <Head title="Dashboard" />
      <div className="px-10 py-14 xl:px-0">
        <section className="flex h-fit flex-col gap-3">
          <motion.h2
            variants={textFadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl font-semibold"
          >
            Selamat datang {auth.user.name}!
          </motion.h2>
          <motion.p
            variants={textFadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{
              ...textFadeInVariants.visible.transition,
              delay: 0.2,
            }}
            className="text-base"
          >
            Semoga aktivitas belajarmu menyenangkan.
          </motion.p>

          <motion.div
            variants={cardEntryVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="relative flex w-full flex-col gap-3 rounded-xl p-6">
              <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
              <motion.p
                variants={textFadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  ...textFadeInVariants.visible.transition,
                  delay: 0.4,
                }}
                className="mb-2 text-lg font-semibold"
              >
                Ringkasan Kursus Anda
              </motion.p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-4 text-center md:grid-cols-3"
              >
                <motion.div
                  variants={statBoxVariants}
                  className="bg-background flex flex-col items-center rounded-lg border p-3"
                >
                  <GraduationCap className="text-primary mb-2 h-8 w-8" />
                  <span className="text-2xl font-bold">
                    {totalEnrolledCourses}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Total Kursus
                  </span>
                </motion.div>
                <motion.div
                  variants={statBoxVariants}
                  className="bg-background flex flex-col items-center rounded-lg border p-3"
                >
                  <BookOpen className="mb-2 h-8 w-8 text-blue-500" />
                  <span className="text-2xl font-bold">
                    {coursesOngoingCount}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Sedang Berlangsung
                  </span>
                </motion.div>
                <motion.div
                  variants={statBoxVariants}
                  className="bg-background flex flex-col items-center rounded-lg border p-3"
                >
                  <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
                  <span className="text-2xl font-bold">
                    {coursesCompletedCount}
                  </span>
                  <span className="text-muted-foreground text-sm">Selesai</span>
                </motion.div>
              </motion.div>

              {totalEnrolledCourses === 0 ? (
                <motion.div
                  variants={cardEntryVariants} // Re-using a variant for this section
                  initial="hidden"
                  animate="visible"
                  transition={{
                    ...cardEntryVariants.visible.transition,
                    delay: 0.8,
                  }}
                  className="bg-muted mt-5 flex flex-col items-center justify-center rounded-lg p-4"
                >
                  <p className="text-muted-foreground mb-4 text-center">
                    Kamu belum mempunyai course. Silahkan ambil course sekarang
                    untuk belajar dan mulailah perjalanan Anda menjadi developer
                    profesional.
                  </p>
                  <motion.div
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1 }}
                  >
                    <Button asChild className="cursor-pointer">
                      <Link href="/learning-paths">Ambil Course Sekarang</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="mt-5 text-center">
                  <motion.p
                    variants={textFadeInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      ...textFadeInVariants.visible.transition,
                      delay: 0.8,
                    }}
                    className="text-muted-foreground mb-4"
                  >
                    Rata-rata kemajuan Anda di kursus yang sedang berjalan
                    adalah:
                    <span className="text-primary ml-2 font-semibold">
                      {Math.round(averageProgress)}%
                    </span>
                  </motion.p>
                  {coursesOngoingCount > 0 && (
                    <motion.div
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 1 }}
                    >
                      <Button asChild className="cursor-pointer">
                        <Link href="/student/academic">Lanjutkan Belajar</Link>
                      </Button>
                    </motion.div>
                  )}
                  {coursesOngoingCount === 0 && coursesCompletedCount > 0 && (
                    <motion.div
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 1 }}
                    >
                      <Button
                        asChild
                        className="cursor-pointer"
                        variant="outline"
                      >
                        <Link href="/learning-paths">Jelajahi Kursus Baru</Link>
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </section>

        {/* --- */}
        <section className="my-10 grid h-auto grid-cols-1 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: 'easeOut' }}
          >
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-1 p-5">
                  <BookMarked className="h-6 w-6" />
                  <h3>Aktivitas Belajar Terbaru</h3>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="flex flex-col gap-3 p-5">
                {allCourseProgresses.length > 0 ? (
                  <motion.div
                    variants={staggerContainer} // Apply stagger to recent activities
                    initial="hidden"
                    animate="visible"
                  >
                    {allCourseProgresses
                      .sort((a, b) => {
                        // Prioritize ongoing courses, then by last updated or completed_at
                        if (a.is_completed === false && b.is_completed === true)
                          return -1;
                        if (a.is_completed === true && b.is_completed === false)
                          return 1;

                        // For same completion status, sort by latest update/completion date
                        const dateA = new Date(
                          a.updated_at || a.completed_at || 0,
                        );
                        const dateB = new Date(
                          b.updated_at || b.completed_at || 0,
                        );
                        return dateB.getTime() - dateA.getTime(); // Latest first
                      })
                      .slice(0, 3) // Tampilkan 3 aktivitas terbaru
                      .map((progress) => (
                        <motion.div
                          key={progress.id}
                          variants={activityCardVariants}
                        >
                          <Card className="relative flex justify-between py-8">
                            <CardContent className="flex w-full justify-between">
                              {' '}
                              {/* Added w-full */}
                              <div className="flex items-center gap-3">
                                <div>
                                  <h4 className="font-medium">
                                    {progress.course?.title ||
                                      'Kursus Tidak Dikenal'}
                                  </h4>
                                  <p className="text-muted-foreground text-sm">
                                    {progress.is_completed === true ? (
                                      <span>
                                        Selesai pada{' '}
                                        {progress.completed_at
                                          ? format(
                                              new Date(progress.completed_at),
                                              'MMM dd, yyyy',
                                            )
                                          : 'N/A'}
                                      </span>
                                    ) : (
                                      <span>
                                        Progress:{' '}
                                        {Math.round(
                                          progress.progress_percentage,
                                        )}
                                        %
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <Button>
                                <Link
                                  href={
                                    progress.is_completed
                                      ? `/student/certificate/${progress.course.id}`
                                      : `/academies/${progress.course?.id}`
                                  }
                                  className="text-sm hover:underline"
                                >
                                  {progress.is_completed === true
                                    ? 'Lihat Sertifikat'
                                    : 'Lanjutkan'}
                                </Link>
                              </Button>
                            </CardContent>
                            <CardFooter className="absolute right-0 bottom-0 left-0 p-0">
                              {' '}
                              {/* Adjusted Footer */}
                              <div
                                className={cn(
                                  'h-2 rounded-full',
                                  progress.is_completed
                                    ? 'bg-green-500'
                                    : 'bg-primary',
                                )}
                                style={{
                                  width: `${progress.progress_percentage}%`,
                                }}
                              />
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                  </motion.div>
                ) : (
                  <motion.p
                    variants={textFadeInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      ...textFadeInVariants.visible.transition,
                      delay: 0.5,
                    }}
                    className="text-muted-foreground text-center"
                  >
                    Belum ada aktivitas belajar.
                  </motion.p>
                )}
              </CardContent>
              <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
            </Card>
          </motion.div>
        </section>
      </div>
    </StudentLayout>
  );
}
