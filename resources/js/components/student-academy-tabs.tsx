import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SharedData, Student } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion'; // Import AnimatePresence
import {
  BookMarked,
  CheckCircle,
  GraduationCap,
  LoaderCircle,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InputError from './input-error';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { ShineBorder } from './ui/shine-border';
import { Textarea } from './ui/textarea';

export function StudentAcademyTabs() {
  const { student, success, error } = usePage<
    SharedData & { student: { data: Student } }
  >().props;

  const { data, setData, post, processing, errors } = useForm({
    rating: 0, // Default 0 atau rating yang sudah ada
    comment: '',
  });
  const [courseActive, setCourseActive] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('learning'); // State to control active tab for AnimatePresence

  const allCourseProgresses = student.data.course_progresses || [];

  const courseProgressesOngoing = allCourseProgresses.filter(
    (progress) => progress.is_completed === false,
  );

  const courseProgressesCompleted = allCourseProgresses.filter(
    (progress) => progress.is_completed === true,
  );

  const handleAddReview: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    try {
      post(route('courses.rate.store', courseActive), {
        onError: (e) => console.log(e),
        onSuccess: () => setOpenModal(false),
      });
    } catch (error) {
      toast.error('Error to add Review');
      console.log(error);
    }
  };

  useEffect(() => {
    const currentCourseProgress = allCourseProgresses.find(
      (progress) => progress.course.id === courseActive,
    );

    const currentRating = currentCourseProgress?.course.ratings.find(
      (r) => r.student.id === student.data.id,
    );

    setData('rating', currentRating?.rating || 0);
    setData('comment', currentRating?.comment || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseActive]);

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  // --- Framer Motion Variants ---

  // Variants for the TabsContent wrapper
  const tabContentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  // Variants for staggering items within the grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Small delay between each child card
        delayChildren: 0.1, // Initial delay before children start
      },
    },
  };

  // Variants for individual course cards
  const courseCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  // Variants for empty state messages
  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <Tabs
      defaultValue="learning"
      className="w-full"
      onValueChange={setActiveTab}
    >
      {' '}
      {/* Add onValueChange */}
      <TabsList className="grid w-full grid-cols-2 gap-4 bg-transparent">
        <TabsTrigger
          value="learning"
          className={`data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=inactive]:bg-muted data-[state=inactive]:hover:bg-muted/80 relative flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all`}
        >
          Kelas yang Sedang di Belajar
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className={`data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=inactive]:bg-muted data-[state=inactive]:hover:bg-muted/80 relative flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all`}
        >
          Kelas yang Sudah Selesai
        </TabsTrigger>
      </TabsList>
      <AnimatePresence mode="wait">
        {' '}
        {/* Use AnimatePresence for exit animations */}
        {activeTab === 'learning' && (
          <motion.div
            key="learning-tab-content" // Unique key for AnimatePresence
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-6 space-y-4"
          >
            <div className="bg-card relative rounded-xl border p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <GraduationCap className="text-primary h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium">
                  Kelas yang Sedang Dipelajari
                </h3>
              </div>

              <Separator className="mb-4" />

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={courseProgressesOngoing.map((c) => c.id).join('-learning')} // Key to force re-animation on filter/data change
                className="grid gap-4 md:grid-cols-2"
              >
                {courseProgressesOngoing.length > 0 ? (
                  courseProgressesOngoing.map((courseProgress) => (
                    <motion.div
                      key={courseProgress.id}
                      variants={courseCardVariants}
                    >
                      <div className="bg-background rounded-lg border p-4 transition-shadow hover:shadow-md">
                        <div className="bg-muted mb-3 h-48 w-full rounded-md">
                          <img
                            src={`/storage/${courseProgress.course.image}`}
                            alt={courseProgress.course.title}
                            className="h-full w-full object-cover"
                            onError={(e) =>
                              (e.currentTarget.style.display = 'none')
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            {courseProgress.course?.title || 'Unknown Course'}
                          </h4>
                          <div className="text-muted-foreground flex justify-between text-sm">
                            <span>
                              {Math.round(
                                Number(courseProgress.progress_percentage),
                              )}
                              %
                            </span>
                            <span>
                              {courseProgress.lessons_completed}/
                              {courseProgress.total_lessons} Lesson
                            </span>
                          </div>
                          <div className="bg-muted h-2 w-full rounded-full">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${courseProgress.progress_percentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    variants={emptyStateVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-muted-foreground col-span-full text-center"
                  >
                    Tidak ada kelas yang sedang dipelajari.
                  </motion.p>
                )}
              </motion.div>
              <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
            </div>
          </motion.div>
        )}
        {activeTab === 'completed' && (
          <motion.div
            key="completed-tab-content" // Unique key for AnimatePresence
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-6 space-y-4"
          >
            <div className="bg-card relative rounded-xl border p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <BookMarked className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">
                  Kelas yang Sudah Selesai
                </h3>
              </div>

              <Separator className="mb-4" />

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={courseProgressesCompleted
                  .map((c) => c.id)
                  .join('-completed')} // Key to force re-animation
                className="grid gap-4 md:grid-cols-2"
              >
                {courseProgressesCompleted.length > 0 ? (
                  courseProgressesCompleted.map((courseProgress) => (
                    <motion.div
                      key={courseProgress.id}
                      variants={courseCardVariants}
                    >
                      <div className="bg-background rounded-lg border p-4 transition-shadow hover:shadow-md">
                        <div className="bg-muted mb-3 h-48 w-full rounded-md">
                          <img
                            className="h-full w-full object-cover"
                            src={`/storage/${courseProgress.course.image}`}
                            alt={courseProgress.course.title}
                            onError={(e) =>
                              (e.currentTarget.style.display = 'none')
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            {courseProgress.course?.title || 'Unknown Course'}
                          </h4>
                          <span className="flex items-center gap-2">
                            Rating Anda
                            <Star
                              className="h-4 w-4 text-yellow-500"
                              fill="currentColor"
                            />
                            {courseProgress.course.ratings.find(
                              (rating) => rating.student.id === student.data.id,
                            )?.rating || 'Belum ada rating'}
                          </span>
                          <div className="text-muted-foreground flex justify-between text-sm">
                            <span>
                              {courseProgress.completed_at
                                ? format(
                                    new Date(courseProgress.completed_at),
                                    'yyyy-MM-dd',
                                  )
                                : 'N/A'}
                            </span>
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Completed</span>
                            </div>
                          </div>
                          <div className="bg-muted h-2 w-full rounded-full">
                            <div className="h-2 w-full rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-end">
                            <Dialog
                              open={openModal}
                              onOpenChange={(isOpen) => {
                                setOpenModal(isOpen);
                                if (isOpen) {
                                  setCourseActive(courseProgress.course.id);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  className="ml-4 cursor-pointer"
                                  variant="ghost"
                                >
                                  {courseProgress.course.ratings.find(
                                    (rating) =>
                                      rating.student.id === student.data.id,
                                  )
                                    ? 'Edit Ulasan'
                                    : 'Beri Ulasan'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Beri Ulasan untuk{' '}
                                    {courseProgress.course.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    <form onSubmit={handleAddReview}>
                                      <div className="mb-3 space-y-2">
                                        <Label htmlFor="rating">
                                          Rating Anda (1-5 Bintang)
                                        </Label>
                                        <RadioGroup
                                          value={String(data.rating)}
                                          onValueChange={(value) =>
                                            setData('rating', Number(value))
                                          }
                                          className="flex items-center gap-2"
                                        >
                                          {[1, 2, 3, 4, 5].map((starValue) => (
                                            <Label
                                              key={starValue}
                                              htmlFor={`star-${starValue}`}
                                              className={`cursor-pointer text-gray-400 transition-colors hover:text-yellow-500 ${
                                                data.rating >= starValue
                                                  ? 'text-yellow-500'
                                                  : ''
                                              }`}
                                            >
                                              <RadioGroupItem
                                                value={String(starValue)}
                                                id={`star-${starValue}`}
                                                className="sr-only"
                                              />
                                              <Star
                                                fill="currentColor"
                                                className="h-8 w-8"
                                              />
                                            </Label>
                                          ))}
                                        </RadioGroup>
                                        {errors.rating && (
                                          <InputError
                                            message={errors.rating}
                                            className="mt-1"
                                          />
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="comment">
                                          Komentar (Opsional)
                                        </Label>
                                        <Textarea
                                          id="comment"
                                          placeholder="Bagikan pengalaman Anda tentang kursus ini..."
                                          value={data.comment}
                                          onChange={(e) =>
                                            setData('comment', e.target.value)
                                          }
                                          rows={4}
                                          maxLength={1000}
                                        />
                                        {errors.comment && (
                                          <InputError
                                            message={errors.comment}
                                            className="mt-1"
                                          />
                                        )}
                                        <p className="text-muted-foreground text-right text-sm">
                                          {data.comment.length} / 1000 karakter
                                        </p>
                                      </div>

                                      <div className="mt-3 flex items-center justify-end gap-4">
                                        <Button
                                          type="button"
                                          className="cursor-pointer"
                                          variant="secondary"
                                          onClick={() => setOpenModal(false)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          type="submit"
                                          disabled={
                                            processing || data.rating === 0
                                          }
                                          className="cursor-pointer"
                                        >
                                          {processing && (
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                          )}
                                          Beri ulasan
                                        </Button>
                                      </div>
                                    </form>
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                            <Button asChild>
                              <Link
                                className="mt-4"
                                href={`/student/certificate/${courseProgress.course.id}`}
                                target="_blank"
                              >
                                Cetak Sertifikat
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    variants={emptyStateVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-muted-foreground col-span-full text-center"
                  >
                    Belum ada kelas yang diselesaikan.
                  </motion.p>
                )}
              </motion.div>
              <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Tabs>
  );
}
