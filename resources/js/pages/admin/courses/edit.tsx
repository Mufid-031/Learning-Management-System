import FormFieldInput from '@/components/form-field-input';
import FormFieldMarkdown from '@/components/form-field-markdown';
import FormFieldSelect from '@/components/form-field-select';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form-layout';
import { BreadcrumbItem, Course, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Courses',
    href: '/courses',
  },
  {
    title: 'Create',
    href: '/courses/create',
  },
];

export default function CourseEdit({
  instructors,
  course,
  success,
  error,
}: {
  instructors: {
    data: User[];
  };
  course: {
    data: Course;
  };
  success?: string;
  error?: string;
}) {
  const { data, setData, put, processing, errors, reset } = useForm({
    title: course.data.title,
    description: course.data.description,
    instructor_id: course.data.instructor_id,
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    put(route('courses.update', course.data.id), {
      onFinish: () => reset('title', 'instructor_id'),
      onError: (e) => console.log(e),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {success && toast.success(success)}
      {error && toast.error(error)}
      <Head title="Create User" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <FormLayout onSubmit={handleSubmit}>
            <FormFieldInput
              htmlFor="title"
              label="Title"
              type="text"
              id="title"
              name="title"
              placeholder="Javascript"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              message={errors.title || ''}
            />
            <FormFieldMarkdown
              htmlFor="description"
              label="Description"
              value={data.description}
              onChange={(value) => setData('description', value || '')}
              message={errors.description || ''}
            />
            <FormFieldSelect<User>
              data={instructors.data}
              label="Instructor"
              value={data.instructor_id}
              displayValue={
                instructors.data.find(
                  (instructor) => instructor.id === data.instructor_id,
                )?.name || ''
              }
              onChange={(value) => setData('instructor_id', Number(value))}
              getOptionLabel={(instructor) => instructor.name}
              getOptionValue={(instructor) => instructor.id}
              message={errors.instructor_id || ''}
            />
            <Button
              type="submit"
              className="mt-4 w-full"
              tabIndex={4}
              disabled={processing}
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </FormLayout>
        </div>
      </div>
    </AppLayout>
  );
}
