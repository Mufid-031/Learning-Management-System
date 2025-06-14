import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
  user: User & {
    admin?: {
      id: number;
      user_id: number;
    };
    student?: {
      id: number;
      user_id: number;
    };
  };
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  icon?: LucideIcon | null;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  courses: {
    data: Course[];
  };
  [key: string]: unknown;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  by: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  admin?: {
    id: number;
    user_id: number;
  };
  student?: Student;
  [key: string]: unknown; // This allows for additional properties...
}

export interface Student {
  id: number;
  user_id: number;
  courses_enrolled: Course[];
  submission_histories: SubmissionHistory[];
  user: User;
  lesson_completions: LessonCompletion[];
  course_progresses: CourseProgress[];
  [key: string]: unknown;
}

export interface Academic {
  id: number;
  title: string;
  image: string;
  description: string;
  status: string;
  courses: Course[];
}

export interface Course {
  id: number;
  title: string;
  image: string;
  information: string;
  description: string;
  order: number;
  duration: number;
  difficulty: string;
  price: number;
  status: string;
  academic: Academic;
  modules: Module[];
  students: User[];
  ratings: Rating[];
  is_completed?: number;
}

export interface Module {
  id: number;
  title: string;
  order: number;
  status: string;
  course: Course;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
  video: string;
  status: string;
  module: Module;
  quizzes: Quiz[];
}

export interface Quiz {
  id: number;
  question: string;
  options: string[];
  answer: string;
  lesson: Lesson;
}

export interface Rating {
  id: number;
  rating: number;
  comment: string;
  course: Course;
  student: Student;
}

export type DataContextType = {
  events?: {
    data: Event[];
  };
  academics?: {
    data: Academic[];
  };
  academic?: {
    data: Academic;
  };
  courses?: {
    data: Course[];
  };
  course?: {
    data: Course;
  };
};

export interface Reply {
  id: number;
  content: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface Discussion {
  id: number;
  title: string;
  content: string;
  category: string;
  user: User;
  created_at: string;
  updated_at: string;
  replies: Reply[];
  likes: number;
  resolved: boolean;
}

export interface SubmissionHistory {
  id: number;
  lesson: Lesson;
  student: Student;
  submissions: Submissions[];
  status: string;
  grade: number | null;
}

export interface Submissions {
  id: number;
  student: Student;
  quiz: Quiz;
  submission_history: SubmissionHistory;
  selected_answer: string;
  is_correct: boolean;
}

export interface LessonCompletion {
  id: number;
  lesson: Lesson;
  student: Student;
  completed_at: Date | null;
}

export interface CourseProgress {
  id: number;
  course: Course;
  student: Student;
  lessons_completed: number;
  total_lessons: number;
  quizzes_passed: number;
  total_quizzes: number;
  progress_percentage: number;
  is_completed: boolean;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Certificate {
    id: number;
    student: Student;
    course: Course;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
