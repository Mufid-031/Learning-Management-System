import { useInitials } from '@/hooks/use-initials';
import { Academic, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowRight, StarIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ShineBorder } from './ui/shine-border';

export function RatingsSection({ academic }: { academic: Academic }) {
  const { auth } = usePage<SharedData>().props;
  const getInitials = useInitials();
  const { delete: destroy } = useForm({});

  const ratingsSliced = academic.courses
    .flatMap((course) => course.ratings)
    .filter((rating) => rating.rating >= 4)
    .slice(0, 6); // tampilkan max 6 testimoni

  const handleDeleteRating = (id: number) => {
    destroy(route('ratings.destroy', id), {
      onSuccess: () => {
        toast.success('Testimoni berhasil dihapus');
      },
      onError: (e) => {
        toast.error('Gagal menghapus testimoni');
        console.log(e);
      },
      preserveScroll: true,
    });
  };

  return (
    <div id={academic.title} className="grid gap-10 px-4 pt-32">
      <h2 className="text-primary w-xl text-5xl font-bold">
        {academic.title} Testimoni
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden p-0">
          <img
            src={`/storage/${academic.image}`}
            alt={academic.title}
            className="h-full w-full object-cover"
          />
        </Card>
        {ratingsSliced.map((rating) => (
          <Card
            key={rating.id}
            className="group relative border-none transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="ring-primary h-14 w-14 ring-2">
                <AvatarImage
                  src={`/storage/${rating.student.user.avatar}`}
                  alt={rating?.student.user.name}
                  className="object-cover"
                />
                <AvatarFallback>
                  {getInitials(rating.student.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{rating.student.user.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  {Array.from({ length: 5 }, (_, k) => (
                    <StarIcon
                      key={k}
                      className="h-4 w-4 text-amber-400"
                      fill={k < rating.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="text-muted-foreground line-clamp-5 min-h-[120px] text-sm">
              {rating.comment}
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div className="text-primary text-xs font-medium">
                {rating.course.title}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="group">
                    Lihat
                    <ArrowRight className="ml-1 transition group-hover:translate-x-1" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <div className="flex items-center gap-3">
                        <Avatar className="ring-primary h-16 w-16 ring-2">
                          <AvatarImage
                            src={`/storage/${rating.student.user.avatar}`}
                            alt={rating.student.user.name}
                          />
                          <AvatarFallback>
                            {getInitials(rating.student.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {rating.student.user.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {rating.course.title}
                          </p>
                        </div>
                      </div>
                    </DialogTitle>
                    <DialogDescription className="mt-4 text-base">
                      {rating.comment}
                    </DialogDescription>
                  </DialogHeader>
                  {auth.user && auth.user.role === 'admin' && (
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteRating(rating.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                      </Button>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}

        {/* Jika belum ada testimoni */}
        {ratingsSliced.length === 0 && (
          <div className="text-muted-foreground flex items-center justify-center text-center text-lg">
            Belum ada testimoni untuk {academic.title}
          </div>
        )}
      </div>
    </div>
  );
}
