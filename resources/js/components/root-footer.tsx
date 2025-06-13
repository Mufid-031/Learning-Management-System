import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { RootContent } from './root-content';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function RootFooter() {
  return (
    <RootContent>
      <footer className="my-10 p-5 lg:mx-10">
        <Separator className="bg-accent mb-20" />
        <div className="flex flex-wrap gap-20 px-5 md:px-0">
          <div>
            <h3 className="mb-4 text-3xl font-semibold">NextLMS</h3>
            <ul className="flex flex-col gap-1">
              <li className="text-muted-foreground mb-1 text-sm">
                NextLMS Space
              </li>
              <li className="text-muted-foreground mb-1 text-sm">
                Jl. Kwanyar Barat
              </li>
              <li className="text-muted-foreground mb-1 text-sm">
                Kec. Kwanyar, Kota Bagungan
              </li>
              <li className="text-muted-foreground mb-7 text-sm">Jawa Timur</li>
            </ul>
            <div className="flex items-center gap-7">
              <Instagram />
              <Youtube />
              <Twitter />
              <Facebook />
            </div>
          </div>
          <div className="w-sm">
            <h3 className="mb-5 text-3xl font-semibold">
              Decode Ideas Discover Potential
            </h3>
            <Button
              variant="link"
              className="text-muted-foreground cursor-pointer"
            >
              Tentang Kami
            </Button>
          </div>
          <div>
            <h3 className="mb-5 text-3xl font-semibold">Teams</h3>
            <ul className="flex flex-col">
              <li>
                <Button
                  variant="link"
                  className="text-muted-foreground cursor-pointer"
                >
                  Ahmad Mufid Risqi
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="text-muted-foreground cursor-pointer"
                >
                  Maulana Ardiansyah
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="text-muted-foreground cursor-pointer"
                >
                  Syauqi Fuadi
                </Button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-5 text-3xl font-semibold">Contact Us</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Button
                  variant="link"
                  className="text-muted-foreground cursor-pointer"
                >
                  Hubungi Kami
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="text-muted-foreground cursor-pointer"
                >
                  FAQ
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <Separator />
          <h1 className="mt-10 text-center text-[5rem] font-bold md:text-[9rem] lg:text-[13rem]">
            NEXTLMS
          </h1>
        </div>
      </footer>
    </RootContent>
  );
}
