import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { RootContent } from '@/components/root-content';
import { RootShell } from '@/components/root-shell';
import { TutorialsSidebar } from '@/components/tutorials-sidebar';
import { BreadcrumbItem, Course, Lesson, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface RootSidebarLayoutProps {
  children: React.ReactNode;
  activeLesson: Lesson | null;
  setActiveLesson: React.Dispatch<React.SetStateAction<Lesson | null>>;
}

export default function RootSidebarLayout({
  children,
  activeLesson,
  setActiveLesson,
}: RootSidebarLayoutProps) {
  const { course } = usePage<
    SharedData & { course: { data: Course }; lesson: { data: Lesson } }
  >().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: course.data.title,
      href: `/academies/${course.data.id}`,
    },
  ];

  return (
    <RootShell variant="sidebar">
      <TutorialsSidebar
        activeLesson={activeLesson}
        setActiveLesson={setActiveLesson}
      />
      <RootContent>
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        {children}
      </RootContent>
    </RootShell>
  );
}
