import MarkdownViewer from '@/components/markdown-viewer';
import MultipleQuizSection from '@/components/multi-quiz-section';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/video-player';
import RootSidebarLayout from '@/layouts/root-sidebar-layout';
import type { Lesson, SharedData, Student } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckCircle,
  CheckCircleIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Tutorials() {
  const { student, lesson } = usePage<
    SharedData & { student: { data: Student }; lesson: { data: Lesson } }
  >().props;
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [allQuizzesPassed, setAllQuizzesPassed] = useState(false);
  const { post: markCompletePost } = useForm({});
  const { post: markModuleCompletePost } = useForm({});

  //   console.log(student);

  const handleMarkComplete = () => {
    markCompletePost(route('lessons.complete', lesson.data.id), {
      onSuccess: () => {
        toast.success('Lesson completed successfully!');
        router.visit(
          `/academies/${lesson.data.module.course.id}/tutorials/${nextLesson!.id}`,
        );
      },
      onError: (errors) => {
        console.log(errors);
        toast.error('Failed to mark lesson as complete');
      },
    });
  };

  const handleNextModule = () => {
    markModuleCompletePost(`/module/complete/${lesson.data.module.id}`, {
      onSuccess: () => {
        toast.success('Module completed successfully!');
      },
      onError: (errors) => {
        console.log(errors);
        toast.error('Failed to mark module as complete');
      },
    });
  };

  const isLessonCompleted =
    student.data.lesson_completions.some(
      (completion) => completion.lesson.id === lesson.data.id,
    ) || false;

  useEffect(() => {
    if (lesson) {
      setActiveLesson(lesson.data);
      // Reset quiz state when lesson changes
      setAllQuizzesPassed(false);
    }
  }, [lesson]);

  const getPreviousLessonByOrder = useCallback(
    (lessons: Lesson[], order: number) => {
      return lessons.find((lesson) => lesson.order === order - 1);
    },
    [],
  );

  const getNextLessonByOrder = useCallback(
    (lessons: Lesson[], order: number) => {
      return lessons.find((lesson) => lesson.order === order + 1);
    },
    [],
  );

  const canProceedToNext = () => {
    // If lesson has quizzes, must pass all quizzes to proceed
    if (activeLesson?.quizzes && activeLesson.quizzes.length > 0) {
      return allQuizzesPassed;
    }
    // If no quizzes, can proceed immediately
    return true;
  };

  const nextLesson = activeLesson
    ? getNextLessonByOrder(lesson.data.module.lessons, lesson.data.order)
    : null;

  const previousLesson = activeLesson
    ? getPreviousLessonByOrder(lesson.data.module.lessons, lesson.data.order)
    : null;

  const hasQuizzes = activeLesson?.quizzes && activeLesson.quizzes.length > 0;

  return (
    <RootSidebarLayout
      activeLesson={activeLesson}
      setActiveLesson={setActiveLesson}
    >
      <Head title="Tutorials" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {/* Video Section */}
          {activeLesson?.video && (
            <div className="mb-8">
              <VideoPlayer url={activeLesson.video} width="100%" />
            </div>
          )}

          {/* Content Section */}
          <div className="prose prose-lg dark:prose-invert mb-8 max-w-none">
            {activeLesson?.content ? (
              <MarkdownViewer content={activeLesson.content} />
            ) : (
              <p>Select a lesson to view its content.</p>
            )}
          </div>

          {/* Multiple Quiz Section */}
          {hasQuizzes && (
            <MultipleQuizSection
              quizzes={activeLesson.quizzes}
              handleNextModule={handleNextModule}
            />
          )}

          {/* Lesson Completion Status */}
          {hasQuizzes && allQuizzesPassed && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="font-semibold">Lesson Completed!</span>
              </div>
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                You have successfully completed all quizzes in this lesson and
                can now proceed to the next one.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex h-10 w-full items-center justify-between gap-5">
            <Button disabled={!previousLesson}>
              {previousLesson ? (
                <Link
                  className="flex items-center gap-2"
                  href={`/academies/${lesson.data.module.course.id}/tutorials/${previousLesson.id}`}
                >
                  <ArrowLeftCircleIcon className="h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <span className="flex items-center gap-2 opacity-50">
                  <ArrowLeftCircleIcon className="h-4 w-4" />
                  Previous
                </span>
              )}
            </Button>

            <Button
              disabled={!nextLesson || !canProceedToNext()}
              className="ml-auto"
            >
              {nextLesson ? (
                canProceedToNext() ? (
                  <Button
                    className="flex items-center gap-2"
                    onClick={handleMarkComplete}
                  >
                    Next
                    <ArrowRightCircleIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <span className="flex items-center gap-2 opacity-50">
                    Complete All Quizzes First
                    <ArrowRightCircleIcon className="h-4 w-4" />
                  </span>
                )
              ) : (
                <span className="flex items-center gap-2 opacity-50">
                  Next
                  <ArrowRightCircleIcon className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>

          {/* Quiz Required Notice */}
          {hasQuizzes && !canProceedToNext() && nextLesson && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
              <p className="text-center text-sm text-amber-700 dark:text-amber-400">
                📝 You must complete and pass all quizzes to proceed to the next
                lesson
              </p>
            </div>
          )}

          {isLessonCompleted && (
            <div className="mt-8 font-semibold text-green-600">
              <CheckCircle className="mr-2 inline-block" /> Pelajaran ini telah
              Anda selesaikan!
            </div>
          )}
        </div>
      </div>
    </RootSidebarLayout>
  );
}
