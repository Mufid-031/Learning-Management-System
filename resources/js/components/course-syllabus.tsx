import type React from 'react';

import type { Course, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { BookCheck, CheckCircle2, FileText } from 'lucide-react';
import { useRef } from 'react';
import { RootContent } from './root-content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const accordionItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const iconVariants = {
  idle: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
};

const lessonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  }),
};

const lessonHoverVariants = {
  hover: {
    x: 5,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
};

const separatorVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

export function CourseSyllabus({
  syllabusRef,
}: {
  syllabusRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { course } = usePage<SharedData & { course: { data: Course } }>().props;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <RootContent ref={syllabusRef} className="my-10">
        <motion.div
          variants={headerVariants}
          className="mb-8 flex flex-col items-center justify-center"
        >
          <motion.h3
            className="text-2xl font-semibold"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
          >
            Silabus
          </motion.h3>
          <motion.p
            className="text-muted-foreground mt-1 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Materi yang akan Anda pelajari pada kelas ini.
          </motion.p>
        </motion.div>

        <div className="flex justify-center px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Accordion type="multiple" className="w-full max-w-2xl space-y-4">
              {course.data.modules.map((module, moduleIndex) => (
                <motion.div
                  key={module.id}
                  variants={accordionItemVariants}
                  transition={{ delay: moduleIndex * 0.1 }}
                >
                  <AccordionItem value={module.title}>
                    <motion.div
                      whileHover="hover"
                      variants={cardHoverVariants}
                    >
                      <Card className="w-[35rem] overflow-hidden px-5">
                        <AccordionTrigger>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <motion.div
                                variants={iconVariants}
                                initial="idle"
                                whileHover="hover"
                              >
                                <FileText className="text-primary h-5 w-5" />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + moduleIndex * 0.1 }}
                              >
                                <CardTitle className="font-medium">
                                  {module.title}
                                </CardTitle>
                              </motion.div>
                            </CardTitle>
                          </CardHeader>
                        </AccordionTrigger>

                        <CardContent className="p-0">
                          <motion.div
                            className="flex items-center gap-3 px-4 py-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + moduleIndex * 0.1 }}
                          >
                            <motion.div variants={badgeVariants}>
                              <Badge className="flex items-center gap-1 border">
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: moduleIndex * 0.5,
                                  }}
                                >
                                  <BookCheck className="h-4 w-4" />
                                </motion.div>
                                {module.lessons.length} Materi
                              </Badge>
                            </motion.div>

                            <motion.div
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ delay: 0.4 + moduleIndex * 0.1 }}
                            >
                              <Separator
                                orientation="vertical"
                                className="h-4"
                              />
                            </motion.div>

                            <motion.div
                              variants={badgeVariants}
                              transition={{ delay: 0.1 }}
                            >
                              <Badge variant="secondary">1 Ujian</Badge>
                            </motion.div>
                          </motion.div>
                        </CardContent>

                        <AccordionContent className="pt-2">
                          <motion.div
                            variants={separatorVariants}
                            style={{ originX: 0 }}
                          >
                            <Separator className="mb-2" />
                          </motion.div>

                          <motion.div
                            className="flex flex-col space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <AnimatePresence>
                              {module.lessons.map((lesson, lessonIndex) => (
                                <motion.div
                                  key={lesson.id}
                                  variants={lessonVariants}
                                  initial="hidden"
                                  animate="visible"
                                  custom={lessonIndex}
                                  whileHover="hover"
                                >
                                  <motion.div variants={lessonHoverVariants}>
                                    <Button
                                      asChild
                                      className="hover:bg-secondary/50 w-full justify-start transition-colors"
                                      variant="link"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-2 text-sm">
                                          <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{
                                              delay: 0.1 + lessonIndex * 0.05,
                                              type: 'spring',
                                              stiffness: 200,
                                            }}
                                            whileHover={{
                                              scale: 1.2,
                                              rotate: 360,
                                              transition: { duration: 0.3 },
                                            }}
                                          >
                                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                                          </motion.div>
                                          <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                              delay: 0.2 + lessonIndex * 0.05,
                                            }}
                                          >
                                            {lesson.title}
                                          </motion.span>
                                        </span>
                                      </div>
                                    </Button>
                                  </motion.div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </motion.div>
                        </AccordionContent>
                      </Card>
                    </motion.div>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </RootContent>
    </motion.div>
  );
}
