import type React from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAverage } from '@/hooks/use-average';
import { currency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import type { Course, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import {
  Book,
  BarChartIcon as ChartColumn,
  CircleCheckBig,
  CircleDollarSign,
  GitCommitHorizontal,
  StarIcon,
  TimerIcon,
  Users2,
} from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { CourseOptionCard } from './course-option-card';
import { RootContent } from './root-content';
import { Badge } from './ui/badge';
import { BorderBeam } from './ui/border-beam';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Separator } from './ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const difficultyText: Record<string, string> = {
  beginner:
    'Level ini cocok untuk pemula yang belum memiliki pengetahuan sebelumnya. Materi disusun dari dasar dengan penjelasan sederhana dan langkah-langkah yang mudah diikuti.',
  intermediate:
    'Ditujukan bagi peserta yang sudah memahami konsep dasar. Materi mencakup pembahasan yang lebih mendalam dan latihan dengan tingkat kesulitan sedang.',
  advanced:
    'Diperuntukkan bagi peserta berpengalaman yang ingin memperdalam pemahaman. Fokus pada studi kasus, penerapan nyata, dan tantangan tingkat lanjut.',
};

declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks?: object) => void;
    };
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      delay: 0.3,
    },
  },
};

export function CourseJumbotron({
  informationRef,
  syllabusRef,
}: {
  informationRef: React.RefObject<HTMLDivElement | null>;
  syllabusRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { course } = usePage<SharedData & { course: { data: Course } }>().props;
  const getAverage = useAverage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleCheckPayment = async () => {
    if (course.data.price <= 0) {
      const response = await axios.post(
        `/academies/course/${course.data.id}/enroll`,
      );

      if (response.status === 200) {
        toast.success('Enrollment successful!');
        router.visit(
          `/academies/${course.data.id}/tutorials/${course.data.modules[0].lessons[0].id}`,
        );
      }
      return;
    }

    try {
      const response = await axios.post(
        `/academies/course/${course.data.id}/payments`,
      );

      console.log(response);

      if (response.data.snapToken) {
        if (window.snap) {
          window.snap.pay(response.data.snapToken, {
            onSuccess: async (result: any) => {
              toast.success('Payment successful!');
              console.log('Payment Success:', result);
              await axios.post(
                `/academies/course/${course.data.id}/confirm-payment`,
              );
              await axios.post(`/academies/course/${course.data.id}/enroll`);
              router.visit(
                `/academies/${course.data.id}/tutorials/${course.data.modules[0].lessons[0].id}`,
              );
            },
            onPending: (result: any) => {
              toast.success('Payment pending. Please complete your payment.');
              console.log('Payment Pending:', result);
            },
            onError: (result: any) => {
              toast.error('Payment failed. Please try again.');
              console.log('Payment Error:', result);
            },
            onClose: () => {
              toast.info('Payment popup closed. You can try again.');
              console.log('Payment Popup Closed.');
            },
          });
        } else {
          toast.error('Midtrans Snap script is not loaded.');
          console.error(
            "Midtrans Snap script is not loaded. Ensure it's included in your main layout.",
          );
        }
      } else if (response.data.redirectUrl) {
        router.visit(response.data.redirectUrl);
        if (response.data.message) {
          toast.success(response.data.message);
        }
      } else {
        toast.error('Unexpected response from payment server.');
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.error || 'An error occurred during payment.',
        );
        console.error('Payment API Error:', error.response.data);
      } else {
        toast.error('An unknown error occurred.');
        console.error('Unknown error:', error);
      }
    }
  };

  return (
    <section className="overflow-hidden p-5 pt-32" ref={ref}>
      <RootContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-5 lg:flex-row"
        >
          {/* Course Image */}
          <motion.div
            variants={imageVariants}
            whileHover={{
              scale: 1.02,
              rotateY: 2,
              transition: { duration: 0.3 },
            }}
            className="bg-muted h-52 w-full overflow-hidden rounded-lg shadow-lg lg:w-1/4"
          >
            <img
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              src={`/storage/${course.data.image}`}
              alt={course.data.title}
            />
          </motion.div>

          {/* Course Information */}
          <motion.div variants={itemVariants} className="w-full lg:w-2/4">
            <Card className="border-none shadow-none">
              <CardHeader>
                <motion.span
                  variants={itemVariants}
                  className="mb-4 flex items-center gap-1 text-sm font-semibold"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StarIcon
                      className="w-6 text-yellow-300"
                      fill="currentColor"
                    />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    {course.data.ratings.length > 0
                      ? getAverage(
                          course.data.ratings.map((rating) => rating.rating),
                        )
                      : 0}
                  </motion.span>
                  <GitCommitHorizontal />
                  <Dialog>
                    <DialogTrigger>
                      <motion.h1
                        className="cursor-pointer underline"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {course.data.academic.title.split(' ')[0]}
                      </motion.h1>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>
                          Learning Path {course.data.academic.title}
                        </DialogTitle>
                        <Separator className="mb-2" />
                        <DialogDescription>
                          <CourseOptionCard course={course} />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  Learning Path
                </motion.span>

                <motion.h1
                  variants={itemVariants}
                  className="text-2xl font-bold"
                >
                  {course.data.title}
                </motion.h1>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <motion.div
                  variants={containerVariants}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChartColumn className="w-4 text-violet-500" />
                    </motion.div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-muted-foreground cursor-pointer text-sm underline">
                          Level: {course.data.difficulty}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <h3 className="mb-2 text-xl font-semibold">
                            {course.data.difficulty}
                          </h3>
                          <p>{difficultyText[course.data.difficulty]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <TimerIcon className="w-4 text-blue-500" />
                    <span className="text-muted-foreground text-sm">
                      {course.data.duration} Jam Belajar
                    </span>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <motion.span
                      variants={badgeVariants}
                      className="flex items-center gap-2 capitalize"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        {course.data.price > 0 ? (
                          <CircleDollarSign className="h-4 w-4 text-green-400" />
                        ) : (
                          <CircleCheckBig className="h-4 w-4 text-cyan-400" />
                        )}
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant="secondary"
                          className={cn(
                            course.data.price > 0
                              ? 'text-green-400'
                              : 'text-cyan-400',
                          )}
                        >
                          {course.data.price > 0
                            ? currency(course.data.price)
                            : 'Gratis'}
                        </Badge>
                      </motion.div>
                    </motion.span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Book className="w-4 text-blue-400" />
                    </motion.div>
                    <span className="text-muted-foreground text-sm">
                      {course.data.modules.length} Modul
                    </span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <Users2 className="w-4 text-yellow-400" />
                    </motion.div>
                    <span className="text-muted-foreground text-sm">
                      {course.data.students.length} Siswa Terdaftar
                    </span>
                  </motion.div>
                </motion.div>
              </CardContent>

              <CardFooter>
                <motion.p
                  variants={itemVariants}
                  className="text-muted-foreground leading-relaxed"
                >
                  {course.data.information}
                </motion.p>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Action Card */}
          <motion.div variants={cardVariants} className="w-full lg:w-1/4">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      onClick={handleCheckPayment}
                      className="w-full cursor-pointer"
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        Belajar Sekarang
                      </motion.span>
                    </Button>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    variants={containerVariants}
                    className="flex flex-col gap-3"
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full cursor-pointer"
                        variant="secondary"
                        onClick={() =>
                          informationRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          })
                        }
                      >
                        Informasi kelas
                      </Button>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full cursor-pointer"
                        variant="secondary"
                        onClick={() =>
                          syllabusRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          })
                        }
                      >
                        Lihat silabus
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <BorderBeam size={70} />
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </RootContent>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{ originX: 0 }}
      >
        <Separator className="mt-20" />
      </motion.div>
    </section>
  );
}
