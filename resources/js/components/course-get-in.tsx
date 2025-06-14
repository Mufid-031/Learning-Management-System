import { motion, useInView } from 'framer-motion';
import {
  BookCopy,
  BarChartIcon as ChartBarStackedIcon,
  FileBadge,
  FileCode2,
  FilePen,
  MessagesSquare,
  NotepadText,
} from 'lucide-react';
import { useRef } from 'react';
import { RootContent } from './root-content';
import { Carousel } from './ui/apple-cards-carousel';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';
import { ShineBorder } from './ui/shine-border';

const cardsGetInData = [
  {
    icon: FileBadge,
    title: 'Sertifikat',
    description:
      'Dapatkan sertifikat standar industri setelah menyelesaikan kelas ini.',
    color: 'text-yellow-500',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: FileCode2,
    title: 'Code Review',
    description:
      'Kode yang Anda kerjakan akan di-review secara komprehensif oleh Reviewer.',
    color: 'text-blue-500',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    icon: MessagesSquare,
    title: 'Forum Diskusi',
    description: 'Diskusikan materi belajar dengan siswa lainnya',
    color: 'text-green-500',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    icon: BookCopy,
    title: 'Modul Tutorial',
    description:
      'Materi bacaan elektronik disajikan dengan bahasa yang mudah dipahami.',
    color: 'text-purple-500',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    icon: ChartBarStackedIcon,
    title: 'Submission',
    description:
      'Uji kemampuan teknis Anda dengan mengerjakan tugas submission.',
    color: 'text-red-500',
    gradient: 'from-red-400 to-rose-500',
  },
  {
    icon: FilePen,
    title: 'Kuis',
    description:
      'Kuis pilihan ganda membantu Anda memahami materi yang dipelajari.',
    color: 'text-indigo-500',
    gradient: 'from-indigo-400 to-blue-500',
  },
  {
    icon: NotepadText,
    title: 'Ujian',
    description:
      'Validasi pengetahuan Anda dengan mengerjakan soal-soal ujian.',
    color: 'text-teal-500',
    gradient: 'from-teal-400 to-cyan-500',
  },
];

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

const titleVariants = {
  hidden: {
    opacity: 0,
    y: -30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

const iconVariants = {
  idle: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.2,
    rotate: 360,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10,
    },
  },
};

const cardHoverVariants = {
  idle: {
    scale: 1,
    y: 0,
    rotateY: 0,
  },
  hover: {
    scale: 1.05,
    y: -10,
    rotateY: 5,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const separatorVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: 'easeInOut',
      delay: 0.8,
    },
  },
};

export function CourseGetIn() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cardsGetIn = cardsGetInData.map((card, index) => (
    <motion.div
      key={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.1 }}
      whileHover="hover"
    >
      <motion.div
        variants={cardHoverVariants}
        initial="idle"
        whileHover="hover"
        className="relative h-40 w-80"
      >
        <Card className="relative h-full w-full overflow-hidden border-0 shadow-lg dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <motion.div
                variants={iconVariants}
                initial="idle"
                whileHover="hover"
                className={`rounded-full bg-gradient-to-r p-2 ${card.gradient} shadow-lg`}
              >
                <card.icon className="h-5 w-5 text-white" />
              </motion.div>
              <motion.h3
                className="text-md bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text font-semibold text-transparent dark:from-white dark:to-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {card.title}
              </motion.h3>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground pl-16 text-xs">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="leading-relaxed"
            >
              {card.description}
            </motion.p>
          </CardContent>

          {/* Animated background gradient */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${card.gradient} -z-10 opacity-0`}
            whileHover={{ opacity: 0.05 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shine border with enhanced animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <ShineBorder
              shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
              className="absolute inset-0"
            />
          </motion.div>

          {/* Floating particles effect */}
          <motion.div
            className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.2,
            }}
          />
          <motion.div
            className="absolute right-4 bottom-4 h-1 w-1 rounded-full bg-gradient-to-r from-pink-400 to-red-500"
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.5 + index * 0.2,
            }}
          />
        </Card>
      </motion.div>
    </motion.div>
  ));

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <RootContent>
        <div className="relative mt-5">
          <motion.h2
            variants={titleVariants}
            className="absolute left-5 text-lg font-semibold md:text-2xl lg:left-0"
          >
            Apa yang Anda dapatkan
          </motion.h2>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Carousel items={cardsGetIn} />
          </motion.div>
        </div>

        <motion.div
          variants={separatorVariants}
          style={{ originX: 0 }}
          className="mt-8"
        >
          <Separator />
        </motion.div>
      </RootContent>
    </motion.div>
  );
}
