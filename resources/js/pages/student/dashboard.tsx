import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShineBorder } from '@/components/ui/shine-border';
import StudentLayout from '@/layouts/student-layout';
import { cn } from '@/lib/utils';
import { SharedData, Student } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns'; // Untuk format tanggal
import { BookMarked, BookOpen, CheckCircle, GraduationCap } from 'lucide-react'; // Tambahkan CheckCircle jika belum

export default function StudentDashboard() {
  const { auth, student } = usePage<
    SharedData & { student: { data: Student } }
  >().props;

//   console.log(student);

  const allCourseProgresses = student?.data?.course_progresses || [];

  const coursesOngoingCount = allCourseProgresses.filter(
    (progress) => progress.is_completed === false, // Sesuaikan dengan nilai actual: true/false, 0/1/2
  ).length;

  const coursesCompletedCount = allCourseProgresses.filter(
    (progress) => progress.is_completed === true, // Sesuaikan dengan nilai actual: true/false, 0/1/2
  ).length;

  const totalEnrolledCourses = allCourseProgresses.length;

  const averageProgress =
    totalEnrolledCourses > 0
      ? allCourseProgresses.reduce(
          (sum, progress) => sum + Number(progress.progress_percentage),
          0,
        ) / totalEnrolledCourses
      : 0;

  return (
    <StudentLayout>
      <Head title="Dashboard" />
      <div className="px-10 py-14 xl:px-0">
        <section className="flex h-fit flex-col gap-3">
          <h2 className="text-2xl font-semibold">
            Selamat datang {auth.user.name}!
          </h2>
          <p className="text-base">Semoga aktivitas belajarmu menyenangkan.</p>
          <Card className="relative flex w-full flex-col gap-3 rounded-xl p-6">
            <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
            <p className="mb-2 text-lg font-semibold">Ringkasan Kursus Anda</p>

            <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
              <div className="bg-background flex flex-col items-center rounded-lg border p-3">
                <GraduationCap className="text-primary mb-2 h-8 w-8" />
                <span className="text-2xl font-bold">
                  {totalEnrolledCourses}
                </span>
                <span className="text-muted-foreground text-sm">
                  Total Kursus
                </span>
              </div>
              <div className="bg-background flex flex-col items-center rounded-lg border p-3">
                <BookOpen className="mb-2 h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold">
                  {coursesOngoingCount}
                </span>
                <span className="text-muted-foreground text-sm">
                  Sedang Berlangsung
                </span>
              </div>
              <div className="bg-background flex flex-col items-center rounded-lg border p-3">
                <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
                <span className="text-2xl font-bold">
                  {coursesCompletedCount}
                </span>
                <span className="text-muted-foreground text-sm">Selesai</span>
              </div>
            </div>

            {totalEnrolledCourses === 0 ? (
              <div className="bg-muted mt-5 flex flex-col items-center justify-center rounded-lg p-4">
                <p className="text-muted-foreground mb-4 text-center">
                  Kamu belum mempunyai course. Silahkan ambil course sekarang
                  untuk belajar dan mulailah perjalanan Anda menjadi developer
                  profesional.
                </p>
                <Button className="cursor-pointer">
                  <Link href="/learning-paths">Ambil Course Sekarang</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-5 text-center">
                <p className="text-muted-foreground mb-4">
                  Rata-rata kemajuan Anda di kursus yang sedang berjalan adalah:
                  <span className="text-primary ml-2 font-semibold">
                    {Math.round(averageProgress)}%
                  </span>
                </p>
                {coursesOngoingCount > 0 && (
                  <Button className="cursor-pointer">
                    <Link href="/student/academic">Lanjutkan Belajar</Link>{' '}
                    {/* Arahkan ke halaman akademik atau kursus terakhir */}
                  </Button>
                )}
                {coursesOngoingCount === 0 && coursesCompletedCount > 0 && (
                  <Button className="cursor-pointer" variant="outline">
                    <Link href="/learning-paths">Jelajahi Kursus Baru</Link>
                  </Button>
                )}
              </div>
            )}
          </Card>
        </section>

        {/* Contoh bagian Aktivitas Belajar Terbaru (jika data tersedia) */}
        <section className="my-10 grid h-auto grid-cols-1 gap-5">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-1 p-5">
                <BookMarked className="h-6 w-6" />
                <h3>Aktivitas Belajar Terbaru</h3>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-3 p-5">
              {/* Placeholder atau tampilkan 2-3 kursus terbaru yang sedang berjalan/diselesaikan */}
              {allCourseProgresses.length > 0 ? (
                allCourseProgresses
                  .sort((a, b) => {
                    // Contoh pengurutan berdasarkan tanggal terakhir diupdate (jika ada)
                    // Atau berdasarkan completed_at untuk yang selesai
                    // Untuk demo, kita urutkan yang sedang berjalan di atas
                    if (a.is_completed === false && b.is_completed === true)
                      return -1;
                    if (a.is_completed === true && b.is_completed === false)
                      return 1;
                    return 0;
                  })
                  .slice(0, 3) // Tampilkan 3 aktivitas terbaru
                  .map((progress) => (
                    <Card
                      key={progress.id}
                      className="relative flex justify-between py-8"
                    >
                      <CardContent className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium">
                              {progress.course?.title || 'Kursus Tidak Dikenal'}
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              {progress.is_completed === true ? (
                                <span>
                                  Selesai pada{' '}
                                  {progress.completed_at
                                    ? format(
                                        new Date(progress.completed_at),
                                        'MMM dd, yyyy',
                                      )
                                    : 'N/A'}
                                </span>
                              ) : (
                                <span>
                                  Progress:{' '}
                                  {Math.round(progress.progress_percentage)}%
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button>
                          <Link
                            href={
                              progress.is_completed
                                ? `/student/certificate/${progress.course.id}`
                                : `/academies/${progress.course?.id}`
                            }
                            className="text-sm hover:underline"
                          >
                            {progress.is_completed === true
                              ? 'Lihat Sertifikat'
                              : 'Lanjutkan'}
                          </Link>
                        </Button>
                      </CardContent>
                      <CardFooter>
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            progress.is_completed
                              ? 'bg-green-500'
                              : 'bg-primary',
                          )}
                          style={{
                            width: `${progress.progress_percentage}%`,
                          }}
                        />
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <p className="text-muted-foreground text-center">
                  Belum ada aktivitas belajar.
                </p>
              )}
            </CardContent>
            <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
          </Card>
        </section>

        {/* Anda bisa menambahkan bagian lain seperti "Rekomendasi Kursus" atau "Pengumuman" di sini */}
      </div>
    </StudentLayout>
  );
}
