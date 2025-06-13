import { FaAws, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiLine } from 'react-icons/si';
import { CardsCarousel } from './cards-carousel';
import { RootContent } from './root-content';
import { BlurFade } from './ui/blur-fade';

const learningPaths = [
  { id: 'google', icon: FaGoogle },
  { id: 'microsoft', icon: FaMicrosoft },
  { id: 'aws', icon: FaAws },
  { id: 'line', icon: SiLine },
];

export function RootLearningPath() {
  return (
    <RootContent>
      <section className="mb-10 flex flex-col items-center">
        <div className="mb-10 text-center">
          <h2 className="mb-5 text-2xl font-semibold">
            <BlurFade direction="up" duration={0.7} inView>
              Learning Path
            </BlurFade>
          </h2>
          <p className="text-muted-foreground px-2">
            <BlurFade
              direction="right"
              duration={0.7}
              offset={20}
              delay={0.5}
              inView
            >
              Learning path akan membantu Anda dalam belajar di Academy
            </BlurFade>
          </p>
          <p className="text-muted-foreground px-2">
            <BlurFade
              direction="left"
              duration={0.7}
              offset={20}
              delay={0.5}
              inView
            >
              dengan kurikulum yang dibangun bersama pelaku industri ternama.
            </BlurFade>
          </p>
        </div>

        <div className="mb-20 flex flex-wrap items-center justify-center gap-10">
          {learningPaths.map(({ id, icon: Icon }, index) => (
            <BlurFade
              key={id}
              direction="up"
              duration={0.7}
              delay={index * 0.1}
              inView
              className="flex items-center justify-center"
            >
              <Icon size={30} className="text-primary" />
            </BlurFade>
          ))}
        </div>

        <CardsCarousel />
      </section>
    </RootContent>
  );
}
