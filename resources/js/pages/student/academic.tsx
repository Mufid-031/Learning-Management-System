import { StudentAcademyTabs } from '@/components/student-academy-tabs';
import StudentLayout from '@/layouts/student-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion'; // Import motion

export default function StudentAcademic() {
  // Variants for the heading
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Variants for the tabs component
  const tabsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut', delay: 0.3 },
    },
  };

  return (
    <StudentLayout>
      <Head title="Dashboard" />
      <div className="w-full px-4 py-14">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 text-2xl font-bold"
        >
          Progres Pembelajaran Anda
        </motion.h2>
        <motion.div variants={tabsVariants} initial="hidden" animate="visible">
          <StudentAcademyTabs />
        </motion.div>
      </div>
    </StudentLayout>
  );
}
