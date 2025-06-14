import { itemZoomVariant } from '@/lib/animation';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { RootContent } from './root-content';
import { BlurFade } from './ui/blur-fade';
import { Button } from './ui/button';
import RotatingText from './ui/rotating-text';

export function RootJumbotron() {
  return (
    <RootContent>
      <section className="mb-20 flex flex-col gap-0 pt-32 md:flex-row md:items-center md:justify-center md:gap-4">
        <div className="order-2 p-10 py-0 md:order-1 md:w-1/2 md:py-20">
          <div className="mb-5">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              <BlurFade direction="up" offset={20} duration={0.7} inView>
                Bangun Karirmu Sebagai
              </BlurFade>
            </h2>
            <h2 className="text-4xl font-semibold md:text-5xl">
              <BlurFade
                className="flex items-center gap-3 text-wrap"
                direction="right"
                offset={20}
                duration={0.7}
                delay={0.5}
                inView
              >
                <RotatingText
                  texts={['Developer', 'Designer', 'Engineer']}
                  mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg w-fit"
                  staggerFrom={'last'}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-120%' }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  rotationInterval={4000}
                />
                Profesional
              </BlurFade>
            </h2>
          </div>
          <p className="text-muted-foreground mb-9">
            <BlurFade
              direction="up"
              offset={20}
              duration={0.7}
              delay={1}
              inView
            >
              Mulai belajar terarah dengan learning path
            </BlurFade>
          </p>
          <Button
            variant="secondary"
            className="cursor-pointer p-6"
            size="lg"
            asChild
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={itemZoomVariant}
            >
              <Link href='/learning-paths'>Belajar Sekarang</Link>
            </motion.div>
          </Button>
        </div>
        <div className="order-1 mb-10 p-10 py-0 md:order-2 md:mb-0 md:w-1/2 md:py-20">
          <motion.img
            initial="hidden"
            animate="show"
            variants={itemZoomVariant}
            src="/jumbotron.png"
            alt=""
          />
        </div>
      </section>
    </RootContent>
  );
}
