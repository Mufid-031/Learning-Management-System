import FormFieldInput from '@/components/form-field-input';
import FormFieldSelect from '@/components/form-field-select';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form-layout';
import { BreadcrumbItem, Course } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Modules',
    href: '/modules',
  },
  {
    title: 'Create',
    href: '/modules/create',
  },
];

export default function ModuleCreate({
  courses,
  sucess,
  error,
}: {
  courses: {
    data: Course[];
  };
  sucess?: string;
  error?: string;
}) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    course_id: 0,
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    post(route('modules.store'), {
      onError: (e) => console.log(e),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {sucess && toast.success(sucess)}
      {error && toast.error(error)}
      <Head title="Create Module" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <FormLayout onSubmit={handleSubmit}>
            <FormFieldInput
              htmlFor="title"
              placeholder="Module title"
              label="Title"
              value={data.title || ''}
              onChange={(e) => setData('title', e.target.value)}
              message={errors.title || ''}
            />
            <FormFieldSelect<Course>
              data={courses.data}
              label="Course"
              value={data.course_id}
              displayValue={
                courses.data.find((course) => course.id === data.course_id)
                  ?.title || ''
              }
              onChange={(value) => setData('course_id', Number(value))}
              getOptionLabel={(course) => course.title}
              getOptionValue={(course) => course.id}
              message={errors.course_id}
            />
            <Button
              type="submit"
              className="mt-4 w-full"
              tabIndex={4}
              disabled={processing}
            >
              {processing && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </FormLayout>
        </div>
      </div>
    </AppLayout>
  );
}
