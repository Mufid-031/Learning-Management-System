"use client"

import { useInitials } from "@/hooks/use-initials"
import type { Academic, SharedData } from "@/types"
import { useForm, usePage } from "@inertiajs/react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowRight, StarIcon, Trash2 } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { ShineBorder } from "./ui/shine-border"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, x: -50, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
}

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    rotateX: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
}

const imageCardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotateY: -15,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 1,
    },
  },
}

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    rotateY: 2,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
}

const avatarVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
}

const starVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  }),
}

const buttonVariants = {
  idle: { scale: 1, x: 0 },
  hover: {
    scale: 1.05,
    x: 2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
}

const arrowVariants = {
  idle: { x: 0 },
  hover: {
    x: 4,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
}

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
}

const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.5,
    },
  },
}

export function RatingsSection({ academic }: { academic: Academic }) {
  const { auth } = usePage<SharedData>().props
  const getInitials = useInitials()
  const { delete: destroy } = useForm({})
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const ratingsSliced = academic.courses
    .flatMap((course) => course.ratings)
    .filter((rating) => rating.rating >= 4)
    .slice(0, 6) // tampilkan max 6 testimoni

  const handleDeleteRating = (id: number) => {
    destroy(route("ratings.destroy", id), {
      onSuccess: () => {
        toast.success("Testimoni berhasil dihapus")
      },
      onError: (e) => {
        toast.error("Gagal menghapus testimoni")
        console.log(e)
      },
      preserveScroll: true,
    })
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      id={academic.title}
      className="grid gap-10 px-4 pt-32"
    >
      <motion.h2 variants={titleVariants} className="text-primary w-xl text-5xl font-bold">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {academic.title}{" "}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Testimoni
        </motion.span>
      </motion.h2>

      <motion.div variants={gridVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Academic Image Card */}
        <motion.div variants={imageCardVariants} whileHover={{ scale: 1.05, rotateY: 5 }}>
          <Card className="overflow-hidden p-0 relative">
            <motion.img
              src={`/storage/${academic.image}`}
              alt={academic.title}
              className="h-full w-full object-cover transition-transform duration-500"
              whileHover={{ scale: 1.1 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </Card>
        </motion.div>

        {/* Rating Cards */}
        <AnimatePresence>
          {ratingsSliced.map((rating, index) => (
            <motion.div key={rating.id} variants={cardVariants} transition={{ delay: index * 0.1 }} whileHover="hover">
              <motion.div variants={cardHoverVariants}>
                <Card className="group relative border-none transition duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                  </motion.div>

                  <CardHeader className="flex flex-row items-center gap-4">
                    <motion.div variants={avatarVariants}>
                      <Avatar className="ring-primary h-14 w-14 ring-2">
                        <AvatarImage
                          src={`/storage/${rating.student.user.avatar}`}
                          alt={rating?.student.user.name}
                          className="object-cover"
                        />
                        <AvatarFallback>{getInitials(rating.student.user.name)}</AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <CardTitle>{rating.student.user.name}</CardTitle>
                      </motion.div>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        {Array.from({ length: 5 }, (_, k) => (
                          <motion.div
                            key={k}
                            variants={starVariants}
                            initial="hidden"
                            animate="visible"
                            custom={k}
                            whileHover={{
                              scale: 1.3,
                              rotate: 360,
                              transition: { duration: 0.3 },
                            }}
                          >
                            <StarIcon
                              className="h-4 w-4 text-amber-400"
                              fill={k < rating.rating ? "currentColor" : "none"}
                            />
                          </motion.div>
                        ))}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <CardContent className="text-muted-foreground line-clamp-5 min-h-[120px] text-sm">
                      {rating.comment}
                    </CardContent>
                  </motion.div>

                  <CardFooter className="flex items-center justify-between">
                    <motion.div
                      className="text-primary text-xs font-medium"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {rating.course.title}
                    </motion.div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
                          <Button variant="link" size="sm" className="group">
                            Lihat
                            <motion.div variants={arrowVariants}>
                              <ArrowRight className="ml-1 transition group-hover:translate-x-1" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent>
                        <motion.div variants={dialogVariants} initial="hidden" animate="visible" exit="exit">
                          <DialogHeader>
                            <DialogTitle>
                              <div className="flex items-center gap-3">
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 200 }}
                                >
                                  <Avatar className="ring-primary h-16 w-16 ring-2">
                                    <AvatarImage
                                      src={`/storage/${rating.student.user.avatar}`}
                                      alt={rating.student.user.name}
                                    />
                                    <AvatarFallback>{getInitials(rating.student.user.name)}</AvatarFallback>
                                  </Avatar>
                                </motion.div>
                                <div>
                                  <motion.h3
                                    className="text-lg font-semibold"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    {rating.student.user.name}
                                  </motion.h3>
                                  <motion.p
                                    className="text-muted-foreground text-sm"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    {rating.course.title}
                                  </motion.p>
                                </div>
                              </div>
                            </DialogTitle>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <DialogDescription className="mt-4 text-base">{rating.comment}</DialogDescription>
                            </motion.div>
                          </DialogHeader>
                          {auth.user && auth.user.role === "admin" && (
                            <DialogFooter>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button variant="destructive" onClick={() => handleDeleteRating(rating.id)}>
                                  <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                  </motion.div>
                                  Hapus
                                </Button>
                              </motion.div>
                            </DialogFooter>
                          )}
                        </motion.div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>

                  {/* Floating particles */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.3,
                    }}
                  />
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {ratingsSliced.length === 0 && (
          <motion.div
            variants={emptyStateVariants}
            className="text-muted-foreground flex items-center justify-center text-center text-lg col-span-full"
          >
            <motion.p animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              Belum ada testimoni untuk {academic.title}
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
