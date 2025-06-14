'use client';

import type React from 'react';

import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { Course, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { TabsList } from '@radix-ui/react-tabs';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowUpRight, StarIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import MarkdownViewer from './markdown-viewer';
import { RootContent } from './root-content';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Separator } from './ui/separator';
import { ShineBorder } from './ui/shine-border';
import { Tabs, TabsContent, TabsTrigger } from './ui/tabs';

const tabTriggers = [
  {
    value: 'description',
    label: 'Deskripsi',
  },
  {
    value: 'testimoni',
    label: 'Testimoni',
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const starVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  }),
};

const avatarVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 12,
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

export function CourseDetail({
  informationRef,
}: {
  informationRef: React.RefObject<HTMLDivElement | null>;
}) {
  const getInitials = useInitials();
  const { course } = usePage<SharedData & { course: { data: Course } }>().props;
  const [activeTab, setActiveTab] = useState<string>('description');
  const courseRatings = course.data.ratings;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.nav
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="mt-10 px-5"
    >
      <RootContent ref={informationRef}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="description"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TabsList className="bg-background flex">
              {tabTriggers.map((tab, index) => (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TabsTrigger
                    value={tab.value}
                    className="relative h-10 w-28 cursor-pointer"
                  >
                    {tab.label}
                    {activeTab === tab.value && (
                      <motion.div
                        className="bg-primary absolute right-0 -bottom-1 left-0 h-0.5"
                        layoutId="activeTabIndicator"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ originX: 0 }}
          >
            <Separator className="my-5" />
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="description" key="description">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.h2
                  className="text-2xl font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Deskripsi
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MarkdownViewer content={course.data.description} />
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="testimoni" key="testimoni">
              <motion.div
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="flex flex-col items-center px-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl font-semibold">Testimoni Siswa</h2>
                  <motion.p
                    className="text-muted-foreground mt-2 text-center text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Ribuan siswa sukses belajar di NextLMS, Apa kata mereka?
                    Berikut adalah testimoni asli mereka.
                  </motion.p>
                </motion.div>

                <motion.div
                  className={cn(
                    'mt-10 grid grid-cols-1 gap-2 px-3',
                    courseRatings.length > 0 ? 'lg:grid-cols-2' : '',
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {courseRatings.length > 0 ? (
                    courseRatings.map((rating, index) => (
                      <motion.div
                        key={rating.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 * index }}
                        whileHover="hover"
                      >
                        <motion.div variants={cardHoverVariants}>
                          <Card className="relative overflow-hidden">
                            <CardHeader>
                              <div className="flex gap-3">
                                <motion.div variants={avatarVariants}>
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage
                                      src={
                                        '/storage/' + rating.student.user.avatar
                                      }
                                      alt={rating.student.user.name}
                                    />
                                    <AvatarFallback>
                                      {getInitials(rating.student.user.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                </motion.div>
                                <div>
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + 0.1 * index }}
                                  >
                                    <CardTitle className="mt-2">
                                      {rating.student.user.name}
                                    </CardTitle>
                                  </motion.div>
                                  <CardDescription className="mt-2">
                                    <span className="text-muted-foreground flex gap-2">
                                      {Array.from({ length: 5 }, (_, k) => (
                                        <motion.div
                                          key={k}
                                          variants={starVariants}
                                          initial="hidden"
                                          animate="visible"
                                          custom={k}
                                          whileHover={{
                                            scale: 1.2,
                                            rotate: 360,
                                            transition: { duration: 0.3 },
                                          }}
                                        >
                                          <StarIcon
                                            className="h-4 w-4 text-amber-400"
                                            fill={
                                              k < rating.rating
                                                ? 'currentColor'
                                                : 'none'
                                            }
                                          />
                                        </motion.div>
                                      ))}
                                    </span>
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + 0.1 * index }}
                            >
                              <CardContent>{rating.comment}</CardContent>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + 0.1 * index }}
                            >
                              <ShineBorder
                                shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                              />
                            </motion.div>
                          </Card>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="flex h-96 items-center justify-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-muted-foreground mt-2 text-center text-lg">
                        Belum ada testimoni untuk course ini
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  className="mt-5 flex items-center justify-end"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button variant="link" className="group cursor-pointer">
                      <Link href={`/ratings`}>Lihat semua testimoni</Link>
                      <motion.div
                        animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <ArrowUpRight className="transition-all duration-100 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </RootContent>
    </motion.nav>
  );
}
