import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { Course, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { TabsList } from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { ArrowUpRight, StarIcon } from 'lucide-react';
import { useState } from 'react';
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
  {
    value: 'faq',
    label: 'FAQ',
  },
];

export function CourseDetail({
  informationRef,
}: {
  informationRef: React.RefObject<HTMLDivElement | null>;
}) {
  const getInitials = useInitials();
  const { course } = usePage<SharedData & { course: { data: Course } }>().props;
  const [activeTab, setActiveTab] = useState<string>('description');
  const courseRatings = course.data.ratings;

  return (
    <nav className="mt-10 px-5">
      <RootContent ref={informationRef}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="description"
        >
          <TabsList className="bg-background">
            {tabTriggers.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative h-10 w-28 cursor-pointer"
              >
                {tab.label}
                {activeTab === tab.value && (
                  <motion.div
                    className="bg-primary absolute right-0 -bottom-1 left-0 h-0.5"
                    layoutId="activeTabIndicator"
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <Separator className="my-5" />
          <TabsContent value="description">
            <h2 className="text-2xl font-semibold">Deskripsi</h2>
            <MarkdownViewer content={course.data.description} />
          </TabsContent>
          <TabsContent value="testimoni">
            <div className="flex flex-col items-center px-3">
              <h2 className="text-2xl font-semibold">Testimoni Siswa</h2>
              <p className="text-muted-foreground mt-2 text-center text-sm">
                Ribuan siswa sukses belajar di NextLMS, Apa kata mereka? Berikut
                adalah testimoni asli mereka.
              </p>
            </div>
            <div
              className={cn(
                'mt-10 grid grid-cols-1 gap-2 px-3',
                courseRatings.length > 0 ? 'lg:grid-cols-2' : '',
              )}
            >
              {courseRatings.length > 0 ? (
                courseRatings.map((rating) => (
                  <Card key={rating.id} className="relative">
                    <CardHeader>
                      <div className="flex gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={'/storage/' + rating.student.user.avatar}
                            alt={rating.student.user.name}
                          />
                          <AvatarFallback>
                            {getInitials(rating.student.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="mt-2">
                            {rating.student.user.name}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            <span className="text-muted-foreground flex gap-2">
                              {Array.from({ length: 5 }, (_, k) => (
                                <StarIcon
                                  key={k}
                                  className="h-4 w-4 text-amber-400"
                                  fill={
                                    k < rating.rating ? 'currentColor' : 'none'
                                  }
                                />
                              ))}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>{rating.comment}</CardContent>
                    <ShineBorder
                      shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                    />
                  </Card>
                ))
              ) : (
                <div className="flex h-96 items-center justify-center">
                  <p className="text-muted-foreground mt-2 text-center text-lg">
                    Belum ada testimoni untuk course ini
                  </p>
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center justify-end">
              <Button variant="link" className="group cursor-pointer">
                <Link href={`/ratings`}>Lihat semua testimoni</Link>
                <ArrowUpRight className="transition-all duration-100 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </RootContent>
    </nav>
  );
}
