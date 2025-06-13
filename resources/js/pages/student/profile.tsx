import { RootContent } from '@/components/root-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShineBorder } from '@/components/ui/shine-border';
import { useAverage } from '@/hooks/use-average';
import { useInitials } from '@/hooks/use-initials';
import RootLayout from '@/layouts/root-layout';
import { CourseProgress, SharedData, User } from '@/types'; // Asumsi tipe data Anda
import { Head, Link, usePage } from '@inertiajs/react';
import {
  Book,
  BookOpen,
  Briefcase,
  ChartColumnDecreasingIcon, // Mengganti ChartColumnDecreasing dengan ikon yang mungkin lebih relevan untuk 'difficulty' atau 'level'
  CheckCircle2Icon,
  Edit2Icon,
  ExternalLink,
  Mail, // Ikon untuk email
  StarIcon,
  TimerIcon,
  Users2,
  XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user } = usePage<SharedData & { user: { data: User } }>().props;
  const getInitials = useInitials();
  const getAverage = useAverage();
  const [filteredCourses, setFilteredCourses] = useState<CourseProgress[]>([]);

  const handleFilterChange = (selectValue: string) => {
    if (selectValue === 'all') {
      setFilteredCourses(user.data.student?.course_progresses || []);
    } else {
      const filtered = user.data.student?.course_progresses.filter(
        (progress) =>
          progress.is_completed == (selectValue == 'true' ? true : false),
      );
      setFilteredCourses(filtered || []);
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Tanggal tidak diketahui';
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options); // Menggunakan locale 'id-ID' untuk bahasa Indonesia
  };

  useEffect(() => {
    setFilteredCourses(user.data.student?.course_progresses || []);
  }, [user.data.student?.course_progresses]);

  return (
    <RootLayout>
      <Head title={user.data.name + ' - Profil'} />

      {/* Bagian Header Profil */}
      {/* Saran: Pertimbangkan untuk memberi background atau border pada section ini agar lebih menonjol */}
      <div className="relative w-full px-10 py-32">
        <BackgroundBeams /> {/* Penyesuaian padding dan background lembut */}
        <RootContent>
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">
            <div className="relative">
              <Avatar className="border-background h-36 w-36 border-4 shadow-lg md:h-44 md:w-44">
                {' '}
                {/* Ukuran avatar disesuaikan, ditambah border dan shadow */}
                <AvatarImage
                  src={`/storage/${user.data.avatar}`}
                  alt={user.data.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl">
                  {getInitials(user.data.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                className="border-background hover:bg-primary/90 absolute right-1 bottom-1 h-10 w-10 cursor-pointer rounded-full border-2 shadow-md md:h-12 md:w-12" // Ukuran tombol disesuaikan
                asChild
                aria-label="Edit Profil"
              >
                <Link href="/student/settings/profile">
                  <Edit2Icon size={20} /> {/* Ukuran ikon disesuaikan */}
                </Link>
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {' '}
              {/* Mengurangi gap agar lebih rapat */}
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {user.data.name}
              </h1>{' '}
              {/* Font lebih tebal dan tracking */}
              {/* Saran: Tampilkan email pengguna jika tersedia dan relevan */}
              {user.data.email && (
                <span className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:justify-start">
                  <Mail size={16} />
                  <p>{user.data.email}</p>
                </span>
              )}
              <span className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:justify-start">
                <TimerIcon size={16} />
                <p>Bergabung sejak {formatDate(user.data.created_at)}</p>
              </span>
            </div>
          </div>
        </RootContent>
      </div>

      {/* Bagian Konten Utama - Daftar Kursus */}
      <RootContent>
        <div className="my-10 px-10 md:my-16">
          {' '}
          {/* Konsistensi margin */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mb-6 text-2xl font-semibold md:mb-8">
              Kursus yang Diikuti
            </h2>
            <div className="w-1/3">
              <Select defaultValue="all" onValueChange={handleFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="true">Kursus diselesaikan</SelectItem>
                  <SelectItem value="false">Kursus berlangsung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {filteredCourses && filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {' '}
              {/* Menambah opsi grid untuk layar lebih besar */}
              {filteredCourses.map((progress) => (
                <Card
                  key={progress.id}
                  className="relative flex flex-col overflow-hidden transition-shadow hover:shadow-lg dark:border-slate-700"
                >
                  {' '}
                  {/* Menambah efek hover dan memastikan card flex column */}
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {' '}
                      {/* Mengubah ke items-start untuk alignment gambar dan teks */}
                      {/* Gambar Kursus */}
                      <div className="bg-muted relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          className="h-full w-full object-cover"
                          src={`/storage/${progress.course.image}`} // Pastikan path `/storage/` sudah benar
                          alt={progress.course.title}
                          onError={(e) =>
                            (e.currentTarget.style.display = 'none')
                          } // Sembunyikan jika gambar error, bg-muted akan terlihat
                        />
                      </div>
                      {/* Informasi Utama Kursus */}
                      <div className="flex flex-grow flex-col gap-1">
                        {' '}
                        {/* Mengurangi gap */}
                        <span
                          className={`mb-1 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                            progress.is_completed
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          {progress.is_completed ? (
                            <CheckCircle2Icon size={14} />
                          ) : (
                            <XIcon size={14} />
                          )}
                          {progress.is_completed ? 'Selesai' : 'Belum Selesai'}
                        </span>
                        <CardTitle className="line-clamp-2 text-lg font-semibold">
                          {progress.course.title}
                        </CardTitle>{' '}
                        {/* Ukuran font disesuaikan dan line-clamp untuk judul panjang */}
                      </div>
                    </div>
                    {/* Detail Tambahan Kursus */}
                    <CardDescription className="mt-3">
                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        {' '}
                        {/* Flex-wrap untuk responsivitas */}
                        <span className="flex items-center gap-1.5">
                          <TimerIcon size={14} className="text-blue-500" />
                          {progress.course.duration} Jam
                        </span>
                        <span className="flex items-center gap-1.5">
                          <StarIcon
                            size={14}
                            className="text-amber-500"
                            fill="currentColor"
                          />
                          {progress.course.ratings.length > 0
                            ? getAverage(
                                progress.course.ratings.map(
                                  (rating) => rating.rating,
                                ),
                              ).toFixed(1)
                            : 0}{' '}
                          {/* Format rating menjadi 1 angka desimal */}
                        </span>
                        <span className="flex items-center gap-1.5 capitalize">
                          <ChartColumnDecreasingIcon
                            size={14}
                            className="text-purple-500"
                          />{' '}
                          {/* Mengganti ikon */}
                          {progress.course.difficulty}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {' '}
                    {/* flex-grow agar konten mengisi ruang */}
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {' '}
                      {/* Batasi informasi kursus agar tinggi card konsisten */}
                      {progress.course.information ||
                        'Informasi kursus tidak tersedia.'}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 dark:border-slate-700">
                    {' '}
                    {/* Menambah border atas pada footer */}
                    <div className="text-muted-foreground flex w-full flex-col gap-3 text-xs">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Book size={14} className="text-cyan-500" />
                          {progress.course.modules.length} Modul
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookOpen size={14} className="text-purple-500" />
                          {progress.course.modules.reduce(
                            (acc, module) => acc + module.lessons.length,
                            0,
                          )}{' '}
                          Lessons
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users2 size={14} className="text-orange-500" />
                          {progress.course.students.length} Siswa
                        </span>
                      </div>
                      {/* Saran: Tombol untuk melihat detail kursus */}
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mt-2 w-full"
                      >
                        <Link href={`/academies/${progress.course.id}`}>
                          {' '}
                          {/* Asumsi Anda punya halaman detail kursus dengan slug */}
                          Lihat Kursus
                          <ExternalLink size={14} className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                  <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
                </Card>
              ))}
            </div>
          ) : (
            // Tampilan jika tidak ada kursus yang diikuti
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-10 text-center">
              <Briefcase size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">
                Anda Belum Mengikuti/Menyelesaikan Kursus Apapun
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Jelajahi katalog kursus kami dan mulai perjalanan belajar Anda!
              </p>
              <Button asChild className="mt-6">
                <Link href="/courses">
                  {' '}
                  {/* Arahkan ke halaman daftar kursus */}
                  Jelajahi Kursus
                </Link>
              </Button>
            </div>
          )}
        </div>
      </RootContent>
    </RootLayout>
  );
}
