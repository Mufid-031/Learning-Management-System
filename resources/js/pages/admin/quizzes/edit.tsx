import FormFieldInput from '@/components/form-field-input'; // Ensure this is imported if used
import { BorderBeam } from '@/components/ui/border-beam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRequiredFieldNumber } from '@/hooks/use-required-field-number';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form-layout';
import { BreadcrumbItem, Quiz, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

// Added Button and LoaderCircle for the submit button
import { DeleteModal } from '@/components/delete-modal';
import InputError from '@/components/input-error'; // Ensure InputError is imported if used
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner'; // Ensure toast is imported

export default function QuizzesEdit() {
  const { quiz } = usePage<SharedData & { quiz: { data: Quiz } }>().props;

  const { data, setData, put, processing, errors } = useForm({
    question: quiz.data.question,
    options: quiz.data.options,
    answer: quiz.data.answer,
    lesson_id: quiz.data.lesson.id, // Important: Associate quiz with the lesson
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Academics',
      href: '/academics',
    },
    {
      title: 'Courses',
      href: `/academics/${quiz.data.lesson.module.course.academic.id}/edit`,
    },
    {
      title: 'Modules',
      href: `/courses/${quiz.data.lesson.module.course.id}/edit`,
    },
    {
      title: 'Lessons',
      href: `/modules/${quiz.data.lesson.module.id}/edit`,
    },
    {
      title: 'Quizzes',
      href: `/quizzes/${quiz.data.lesson.id}/create`, // This breadcrumb links to the current page
    },
    {
      title: 'Edit',
      href: `/quizzes/${quiz.data.id}/edit`, // Corrected href to match the current page
    },
  ];

  // The required fields are question (1), 4 options (4), and answer (1). Total = 6 fields.
  // The useRequiredFieldNumber hook will automatically count these based on the `data` object.
  const [requiredFieldsNumber, setRequiredFieldsNumber] =
    useRequiredFieldNumber(data); // Removed setRequiredFieldsNumber from destructuring as we won't manually set it here

  // Helper to update a specific option by index
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...data.options]; // Create a copy of the array
    if (value.trim() === '') {
      newOptions[index] = ''; // If the value is empty, set it to an empty string
    } else {
      newOptions[index] = value; // Update the specific index
      setData('options', newOptions); // Set the updated array
      setRequiredFieldsNumber(requiredFieldsNumber + 1);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    put(route('quizzes.update', quiz.data.id), {
      onError: (e) => console.log(e),
      onSuccess: () => {
        toast.success('Quiz created successfully!');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Quiz" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex items-center justify-between pl-4">
          <div>
            <h1 className="text-2xl font-bold">Edit Quiz</h1>
            <p className="text-muted-foreground text-sm">
              Complete all fields ({requiredFieldsNumber}/6){' '}
            </p>
          </div>
          <DeleteModal resourceName="quizze" id={quiz.data.id} />
        </div>
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <FormLayout onSubmit={handleSubmit}>
            <FormFieldInput
              htmlFor="question"
              label="Quiz question"
              name="question"
              value={data.question}
              setValue={(value) => setData('question', value)}
              // Removed onFilled logic here, as useRequiredFieldNumber should handle it
              message={errors.question || ''}
            />
            <Card>
              <CardHeader>
                <CardTitle>
                  <Label className="text-xl">Quiz options</Label>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {data.options.map((option, index) => (
                  <Input
                    key={index}
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    // Removed onBlur logic here, as useRequiredFieldNumber should handle it
                  />
                ))}
                {errors.options && <InputError message={errors.options} />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Label className="text-xl">Answer</Label>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={data.answer}
                  onValueChange={(value) => {
                    setData('answer', value);
                    // Removed manual setRequiredFieldsNumber logic here, as useRequiredFieldNumber should handle it
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.options.map(
                      (option, index) =>
                        option.trim() !== '' && (
                          <SelectItem key={index} value={option}>
                            {`Option ${String.fromCharCode(65 + index)}: ${option}`}
                          </SelectItem>
                        ),
                    )}
                  </SelectContent>
                </Select>
                {errors.answer && <InputError message={errors.answer} />}
              </CardContent>
            </Card>
            <Button
              type="submit"
              className="mt-4 w-full"
              tabIndex={4}
              disabled={processing || requiredFieldsNumber < 3} // Disable if not all fields are filled
            >
              {processing && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Quiz
            </Button>
          </FormLayout>
          <BorderBeam size={300} duration={10} />
        </div>
      </div>
    </AppLayout>
  );
}
