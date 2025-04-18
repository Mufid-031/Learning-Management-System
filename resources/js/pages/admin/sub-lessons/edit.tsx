import FormFieldInput from '@/components/form-field-input';
import FormFieldMarkdown from '@/components/form-field-markdown';
import FormFieldSelect from '@/components/form-field-select';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form-layout';
import { BreadcrumbItem, Lesson, SubLesson } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sub Lessons',
    href: '/sub-lessons',
  },
  {
    title: 'Edit',
    href: '/sub-lessons/edit',
  },
];

export default function EditSubLesson({
  subLesson,
  lessons,
  success,
  error,
}: {
  subLesson: { data: SubLesson };
  lessons: { data: Lesson[] };
  success?: string;
  error?: string;
}) {
  const { data, setData, put, processing, errors } = useForm({
    title: subLesson.data.title,
    content: subLesson.data.content,
    order: subLesson.data.order,
    lesson_id: subLesson.data.lesson.id,
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    put(route('sub-lessons.update', subLesson.data.id), {
      preserveScroll: true,
      onError: (e) => console.log(e),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {success && toast.success(success)}
      {error && toast.error(error)}
      <Head title="Edit Sub Lesson" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <FormLayout onSubmit={handleSubmit}>
            <FormFieldInput
              htmlFor="title"
              label="Title"
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              message={errors.title || ''}
            />
            <FormFieldMarkdown
              htmlFor="content"
              label="Content"
              value={data.content}
              onChange={(value) => setData('content', value || '')}
              message={errors.content || ''}
            />
            <FormFieldInput
              htmlFor="order"
              label="Order"
              type="number"
              id="order"
              name="order"
              value={data.order}
              onChange={(e) => setData('order', Number(e.target.value))}
              message={errors.order || ''}
            />
            <FormFieldSelect<Lesson>
              data={lessons.data}
              label="Lesson"
              value={data.lesson_id}
              onChange={(value) => setData('lesson_id', Number(value))}
              displayValue={
                lessons.data.find((lesson) => lesson.id === data.lesson_id)
                  ?.title || ''
              }
              getOptionLabel={(lesson: Lesson) => lesson.title}
              getOptionValue={(lesson: Lesson) => String(lesson.id)}
              message={errors.lesson_id || ''}
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
