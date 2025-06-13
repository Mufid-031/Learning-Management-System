import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  FaApple,
  FaAws,
  FaFacebook,
  FaGoogle,
  FaMicrosoft,
  FaTwitter,
} from 'react-icons/fa';
import { SiHuawei, SiLenovo, SiSamsung } from 'react-icons/si';
import { BlurFade } from './ui/blur-fade';
import { Marquee } from './ui/marquee';

// Partner utama
const partnerList = [
  { id: 'google', icon: FaGoogle },
  { id: 'microsoft', icon: FaMicrosoft },
  { id: 'aws', icon: FaAws },
  { id: 'lenovo', icon: SiLenovo },
];

// Partner tambahan
const additionalPartnerList = [
  { id: 'apple', icon: FaApple },
  { id: 'facebook', icon: FaFacebook },
  { id: 'twitter', icon: FaTwitter },
  { id: 'samsung', icon: SiSamsung },
  { id: 'huawei', icon: SiHuawei },
];

export function RootPartner() {
  const isMobile = useIsMobile();

  // Responsive config
  const iconSize = isMobile ? 30 : 50;
  const gapSize = isMobile ? 'gap-10' : 'gap-20';
  const repeatCount = isMobile ? 3 : 5;

  return (
    <section className="mb-20 flex flex-col gap-5">
      <h3 className="text-center text-xl font-semibold">
        <BlurFade direction="up" duration={0.7} inView>
          Telah dipercaya oleh
        </BlurFade>
      </h3>

      {!isMobile && (
        <>
          <Marquee
            vertical={isMobile}
            repeat={repeatCount}
            className={gapSize}
            pauseOnHover
          >
            <div className={`flex ${gapSize}`}>
              {partnerList.map(({ id, icon: Icon }) => (
                <div
                  key={id}
                  className={cn('flex items-center justify-center')}
                >
                  <Icon size={iconSize} />
                </div>
              ))}
            </div>
          </Marquee>

          <Marquee
            vertical={isMobile}
            repeat={repeatCount}
            className={gapSize}
            pauseOnHover
            reverse
          >
            <div className={`flex ${gapSize}`}>
              {additionalPartnerList.map(({ id, icon: Icon }) => (
                <div
                  key={id}
                  className={cn('flex items-center justify-center')}
                >
                  <Icon size={iconSize} />
                </div>
              ))}
            </div>
          </Marquee>
        </>
      )}

      {isMobile && (
        <div className="flex flex-wrap items-center justify-center gap-8 px-3">
          {[...partnerList, ...additionalPartnerList].map(
            ({ id, icon: Icon }) => (
              <div key={id} className="flex items-center justify-center">
                <Icon size={iconSize} />
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
