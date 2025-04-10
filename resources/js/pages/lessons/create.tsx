import FormFieldInput from '@/components/form-field-input';
import FormFieldSelect from '@/components/form-field-select';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form-layout';
import { BreadcrumbItem, Module } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Lessons',
    href: '/lessons',
  },
  {
    title: 'Create',
    href: '/lessons/create',
  },
];

export default function LessonsCreate({
  modules,
  success,
  error,
}: {
  modules: {
    data: Module[];
  };
  success?: string;
  error?: string;
}) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    order: '',
    module_id: 0,
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    post(route('lessons.store'), {
      onError: (e) => console.log(e),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {success && toast.success(success)}
      {error && toast.error(error)}
      <Head title="Create Lesson" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <FormLayout onSubmit={handleSubmit}>
            <FormFieldInput
              htmlFor="title"
              label="Title"
              type="text"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              message={errors.title || ''}
            />
            <FormFieldInput
              htmlFor="order"
              label="Order"
              type="number"
              value={data.order}
              onChange={(e) => setData('order', e.target.value)}
              message={errors.order || ''}
            />
            <FormFieldSelect<Module>
              data={modules.data}
              label="Module"
              value={data.module_id}
              displayValue={
                modules.data.find((module) => module.id === data.module_id)
                  ?.title || ''
              }
              onChange={(value) => setData('module_id', Number(value))}
              getOptionLabel={(module) => module.title}
              getOptionValue={(module) => String(module.id)}
              message={errors.module_id || ''}
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
