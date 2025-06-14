import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { Lesson, Quiz, SharedData, Student } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import {
  BookOpenIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SendIcon,
  XCircleIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuizProgress {
  quiz_id: number;
  is_completed: boolean;
  is_correct: boolean;
  selected_answer?: string | null;
  correct_answer?: string | null;
}

interface MultipleQuizSectionProps {
  quizzes: Quiz[];
  handleNextModule: () => void;
}

export default function MultipleQuizSection({
  quizzes,
  handleNextModule,
}: MultipleQuizSectionProps) {
  const { student, lesson } = usePage<
    SharedData & {
      student: { data: Student };
      lesson: { data: Lesson };
    }
  >().props;
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizResults, setQuizResults] = useState<Record<number, QuizProgress>>(
    {},
  );

  const { setData, post, processing, reset } = useForm({
    submissions: [] as Array<{
      quiz_id: number;
      selected_answer: string | null;
    }>,
  });

  //   console.log(student);
  //   console.log(quizzes);

  const currentQuiz = quizzes[currentQuizIndex];
  const currentQuizResult = currentQuiz
    ? quizResults[currentQuiz.id]
    : undefined;

  const studentSubmissionHistories = student.data.submission_histories;

  useEffect(() => {
    const initialResults: Record<number, QuizProgress> = {};
    const initialUserAnswers: Record<number, string> = {};
    quizzes.forEach((quiz) => {
      initialResults[quiz.id] = {
        quiz_id: quiz.id,
        is_completed: false,
        is_correct: false,
        selected_answer: null,
      };
      initialUserAnswers[quiz.id] = '';
    });
    setQuizResults(initialResults);
    setUserAnswers(initialUserAnswers);
    setCurrentQuizIndex(0);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizzes]);

  const handleAnswerSelect = (value: string) => {
    if (!currentQuiz) return;

    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuiz.id]: value,
    }));

    setData((prevData) => {
      const existingSubmissionIndex = prevData.submissions.findIndex(
        (sub) => sub.quiz_id === currentQuiz.id,
      );

      if (existingSubmissionIndex > -1) {
        const updatedSubmissions = [...prevData.submissions];
        updatedSubmissions[existingSubmissionIndex] = {
          quiz_id: currentQuiz.id,
          selected_answer: value,
        };
        return {
          ...prevData,
          submissions: updatedSubmissions,
        };
      } else {
        return {
          ...prevData,
          submissions: [
            ...prevData.submissions,
            { quiz_id: currentQuiz.id, selected_answer: value },
          ],
        };
      }
    });
  };

  const handleSubmitAll = () => {
    const finalSubmissions = quizzes.map((quiz) => ({
      quiz_id: quiz.id,
      selected_answer: userAnswers[quiz.id] || null,
    }));

    setData('submissions', finalSubmissions);

    post(route('academics.quizzes.submit'), {
      onError: (errors) => {
        console.error('Quiz submission error:', errors);
      },
    });
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  const handlePreviousQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

  const options =
    currentQuiz && typeof currentQuiz.options === 'string'
      ? JSON.parse(currentQuiz.options)
      : currentQuiz?.options || [];

  const getAnsweredQuizzesCount = () => {
    return Object.keys(userAnswers).filter(
      (key) =>
        userAnswers[Number(key)] !== null &&
        userAnswers[Number(key)] !== undefined &&
        userAnswers[Number(key)] !== '',
    ).length;
  };

  const getProgressPercentage = () => {
    return (getAnsweredQuizzesCount() / quizzes.length) * 100;
  };

  if (quizzes.length === 0) return <p>Tidak ada kuis untuk lesson ini.</p>;
  if (!currentQuiz) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <BookOpenIcon className="h-5 w-5" />
            Kuis: {lesson.data.module.title} (Soal {currentQuizIndex + 1} dari{' '}
            {quizzes.length})
          </CardTitle>
          <Badge variant="outline">
            {getAnsweredQuizzesCount()} / {quizzes.length} terjawab
          </Badge>
        </div>
        <div className="mt-2 space-y-1">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Progress Menjawab</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Navigasi Nomor Soal */}
        <div className="my-4 flex flex-wrap items-center justify-center gap-2">
          {quizzes.map((quiz, index) => (
            <Button
              key={quiz.id}
              onClick={() => setCurrentQuizIndex(index)}
              disabled={quizResults[quiz.id]?.is_completed}
              variant={
                index === currentQuizIndex && !studentSubmissionHistories
                  ? 'secondary'
                  : studentSubmissionHistories &&
                      quizResults[quiz.id]?.is_completed
                    ? quizResults[quiz.id]?.is_correct
                      ? 'default'
                      : 'destructive'
                    : userAnswers[quiz.id]
                      ? 'default'
                      : 'outline'
              }
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {/* Pertanyaan dan Opsi Jawaban */}
        <p className="text-base font-medium">{currentQuiz.question}</p>
        <RadioGroup
          value={userAnswers[currentQuiz.id] || ''}
          onValueChange={handleAnswerSelect}
          disabled={currentQuizResult?.is_completed ?? false}
          className="space-y-3"
        >
          {options.map((option: string, index: number) => {
            const optionKey = getOptionLabel(index);
            const isSelected = userAnswers[currentQuiz.id] === optionKey;
            const isCorrectAnswerAfterSubmit =
              studentSubmissionHistories &&
              currentQuizResult?.is_completed &&
              currentQuiz.answer === optionKey;
            const isSelectedAndIncorrectAfterSubmit =
              studentSubmissionHistories &&
              currentQuizResult?.is_completed &&
              isSelected &&
              !currentQuizResult.is_correct;

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 rounded-lg border p-4 transition-all ${
                  studentSubmissionHistories && currentQuizResult?.is_completed
                    ? isCorrectAnswerAfterSubmit
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : isSelectedAndIncorrectAfterSubmit
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-muted dark:border-slate-700'
                    : isSelected
                      ? 'border-primary bg-primary/10 ring-primary/50 ring-2'
                      : 'border-muted hover:border-primary/50 dark:hover:border-primary/60 dark:border-slate-700' // Default sebelum submit
                } ${studentSubmissionHistories ? 'cursor-default' : 'cursor-pointer'} `}
                onClick={() =>
                  !currentQuizResult?.is_completed && handleAnswerSelect(option)
                }
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${currentQuiz.id}-${index}`}
                  disabled={
                    studentSubmissionHistories.length > 0 ||
                    (currentQuizResult?.is_completed ?? false)
                  }
                />
                <Label
                  htmlFor={`option-${currentQuiz.id}-${index}`}
                  className={`flex-1 font-medium ${studentSubmissionHistories ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {optionKey}
                    </Badge>
                    {option}
                  </span>
                </Label>
                {studentSubmissionHistories &&
                  currentQuizResult?.is_completed && (
                    <>
                      {isCorrectAnswerAfterSubmit && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                      {isSelectedAndIncorrectAfterSubmit && (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </>
                  )}
              </div>
            );
          })}
        </RadioGroup>

        {/* Tombol Navigasi Soal & Submit/Retry */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuiz}
            disabled={currentQuizIndex === 0}
            className="w-full sm:w-auto"
          >
            <ChevronLeftIcon className="mr-1 h-4 w-4" />
            Soal Sebelumnya
          </Button>

          {currentQuizIndex === quizzes.length - 1 && (
            <Button
              onClick={handleSubmitAll}
              disabled={
                processing || getAnsweredQuizzesCount() !== quizzes.length
              } // Disable jika belum semua dijawab
              className="order-first w-full bg-green-600 hover:bg-green-700 sm:order-none sm:w-auto"
              size="lg"
            >
              <SendIcon className="mr-2 h-4 w-4" />
              {processing ? 'Mengirim...' : 'Kumpulkan Semua Jawaban'}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleNextQuiz}
            disabled={currentQuizIndex === quizzes.length - 1}
            className="w-full sm:w-auto"
          >
            Soal Berikutnya
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Tampilkan hasil individual setelah submit semua */}
        {studentSubmissionHistories && currentQuizResult?.is_completed && (
          <div
            className={`mt-4 rounded-lg border-2 p-4 text-center ${
              currentQuizResult.is_correct
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-red-500 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            {currentQuizResult.is_correct ? (
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircleIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">Jawaban Benar!</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400">
                  <XCircleIcon className="h-6 w-6" />
                  <span className="text-lg font-semibold">Jawaban Salah</span>
                </div>
                {currentQuiz.answer && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Jawaban yang benar: <strong>{currentQuiz.answer}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ringkasan Kuis setelah semua disubmit */}
        {studentSubmissionHistories && (
          <div className="bg-muted/30 dark:bg-muted/10 mt-8 rounded-lg border p-4 dark:border-slate-700">
            <h4 className="mb-3 text-lg font-semibold">Ringkasan Hasil Kuis</h4>
            <div className="flex flex-col gap-4">
              {studentSubmissionHistories.map((submissionHistory) => (
                <Card key={submissionHistory.id}>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Total Soal:
                        </span>
                        <span className="ml-2 font-medium">
                          {submissionHistory.submissions.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Persentase Benar:
                        </span>
                        <span
                          className={cn(
                            'ml-2 font-medium',
                            parseFloat(
                              submissionHistory.grade?.toString() ?? '0',
                            ) <= 100 &&
                              parseFloat(
                                submissionHistory.grade?.toString() ?? '0',
                              ) > 70
                              ? 'text-green-600 dark:text-green-400'
                              : parseFloat(
                                    submissionHistory.grade?.toString() ?? '0',
                                  ) < 70 &&
                                  parseFloat(
                                    submissionHistory.grade?.toString() ?? '0',
                                  ) > 50
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400',
                          )}
                        >
                          {submissionHistory.grade}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {studentSubmissionHistories.find(
                (submissionHistory) =>
                  parseFloat(submissionHistory.grade?.toString() ?? '0') >= 70,
              ) && (
                <Button onClick={handleNextModule} className="cursor-pointer">
                  Next Module
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
