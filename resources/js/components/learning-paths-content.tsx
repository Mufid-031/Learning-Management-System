import { Separator } from '@/components/ui/separator';
import { Academic, Course, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { CourseCard } from './course-card';
import { SelectFilter } from './select-filter';
import { BackgroundBeams } from './ui/background-beams';

export function LearningPathsContent() {
  const { courses, academics } = usePage<
    SharedData & { academics: { data: Academic[] } }
  >().props;
  const [coursesFilter, setCoursesFilter] = useState<Course[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [academicFilter, setAcademicFilter] = useState<string[]>([]);
  const [classTypeFilter, setClassTypeFilter] = useState<string[]>([]);

  const filteredCourses = useCallback(() => {
    return courses.data.filter(
      (course) =>
        (!difficultyFilter.length ||
          difficultyFilter.includes(course.difficulty)) &&
        (!academicFilter.length ||
          academicFilter.includes(course.academic.title)) &&
        (!classTypeFilter.length ||
          classTypeFilter.includes(course.price > 0 ? 'Berbayar' : 'Gratis')), // Corrected logic: price > 0 is "Berbayar", price == 0 is "Gratis"
    );
  }, [academicFilter, difficultyFilter, classTypeFilter, courses.data]);

  useEffect(() => {
    setCoursesFilter(filteredCourses()); // Call filteredCourses as a function
  }, [difficultyFilter, academicFilter, classTypeFilter, filteredCourses]);

  // --- Framer Motion Variants ---

  // Variants for the filter bar container
  const filterBarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.15, // Stagger effect for individual filters
        delayChildren: 0.2, // Delay before individual filters start animating
      },
    },
  };

  // Variants for individual filter dropdowns
  const filterItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  // Variants for the grid container of course cards
  const courseGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Small delay between each course card
        delayChildren: 0.3, // Initial delay before first course card animates
      },
    },
  };

  // Variants for individual course cards
  const courseCardItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full font-sans md:px-10">
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
        <BackgroundBeams />
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.7,
              type: 'spring',
              damping: 20,
              stiffness: 400,
            },
          }}
          className="mb-4 text-center text-xl text-black md:px-60 md:text-3xl dark:text-white"
        >
          Kelas di{' '}
          <span className="text-background rounded bg-cyan-400 p-1 font-bold">
            NextLMS
          </span>{' '}
          tersedia dari level dasar hingga profesional sesuai kebutuhan industri
          terkini
        </motion.h2>
      </div>
      <Separator className="mt-10" />
      <main className="px-3 py-10 md:px-0 lg:px-36">
        <motion.div
          variants={filterBarVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-evenly gap-3"
        >
          <motion.div variants={filterItemVariants} className="w-full">
            <SelectFilter
              title="Tingkat"
              label="Tingkat Kesulitan"
              items={[
                {
                  label: 'Beginner',
                  value: 'beginner',
                },
                {
                  label: 'Intermediate',
                  value: 'intermediate',
                },
                {
                  label: 'Advanced',
                  value: 'advanced',
                },
              ]}
              stateFilter={difficultyFilter}
              setStateFilter={setDifficultyFilter}
            />
          </motion.div>
          <motion.div variants={filterItemVariants} className="w-full">
            <SelectFilter
              title="Topik"
              label="Topik"
              items={
                academics?.data.map((item) => ({
                  label: item.title,
                  value: item.title,
                })) || []
              }
              stateFilter={academicFilter}
              setStateFilter={setAcademicFilter}
            />
          </motion.div>
          <motion.div variants={filterItemVariants} className="w-full">
            <SelectFilter
              title="Tipe Kelas"
              label="Tipe Kelas"
              items={[
                {
                  label: 'Kelas Gratis',
                  value: 'Gratis',
                },
                {
                  label: 'Kelas Berbayar',
                  value: 'Berbayar',
                },
              ]}
              stateFilter={classTypeFilter}
              setStateFilter={setClassTypeFilter}
            />
          </motion.div>
        </motion.div>
        <motion.div
          variants={courseGridVariants}
          initial="hidden"
          animate="visible"
          // Add a key to force re-animation when filters change
          key={
            difficultyFilter.join('') +
            academicFilter.join('') +
            classTypeFilter.join('')
          }
          className="mt-5 grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2"
        >
          {coursesFilter.map((course) => (
            <motion.div key={course.id} variants={courseCardItemVariants}>
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
