import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { RootContent } from '@/components/root-content';
import { StudentSettingsNavigation } from '@/components/student-settings-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RootLayout from '@/layouts/root-layout';
import { Image } from 'lucide-react';

type ProfileForm = {
  avatar: File | null;
  name: string;
  email: string;
  _method: string;
};

export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;

  const { data, setData, post, errors, processing, recentlySuccessful } =
    useForm<Required<ProfileForm>>({
      avatar: null,
      name: auth.user.name,
      email: auth.user.email,
      _method: 'patch',
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('profile.update'), {
      preserveScroll: true,
      forceFormData: true,
      method: 'patch',
      onError: (e) => console.log(e),
    });
  };

  return (
    <RootLayout>
      <Head title="Profile settings" />

      <RootContent className="pt-32">
        <div className="grid grid-cols-1 gap-5 px-40 md:grid-cols-[1fr_3fr]">
          <StudentSettingsNavigation />

          <div className="space-y-6">
            <HeadingSmall
              title="Profile information"
              description="Update your name and email address"
            />
            <Card>
              <CardContent>
                <div className="mb-4 space-y-6">
                  <HeadingSmall
                    title="Profile information"
                    description="Update your name and email address"
                  />

                  <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                      <div className="flex gap-3">
                        <div className="grid gap-2">
                          <Label htmlFor="avatar">Avatar</Label>
                          <div className="bg-muted h-28 w-28">
                            {data.avatar ? (
                              <img
                                src={URL.createObjectURL(data.avatar)}
                                alt={data.name}
                                className="h-full w-full object-cover"
                              />
                            ) : auth.user.avatar ? (
                              <img
                                src={`/storage/${auth.user.avatar}`}
                                alt={auth.user.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Image className="h-10 w-10" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex w-full flex-col gap-2">
                          <Input
                            id="avatar"
                            type="file"
                            className="mt-5 w-1/3"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setData('avatar', file);
                              }
                            }}
                          />
                          <p className="text-muted-foreground w-1/3 text-xs">
                            Gambar Profile Anda sebaiknya memiliki rasio 1.1 dan
                            berukuran tidak lebih dari 2MB
                          </p>
                        </div>
                      </div>

                      <InputError className="mt-2" message={errors.avatar} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>

                      <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Full name"
                      />

                      <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email address</Label>

                      <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="Email address"
                      />

                      <InputError className="mt-2" message={errors.email} />
                    </div>

                    {mustVerifyEmail &&
                      auth.user.email_verified_at === null && (
                        <div>
                          <p className="text-muted-foreground -mt-4 text-sm">
                            Your email address is unverified.{' '}
                            <Link
                              href={route('verification.send')}
                              method="post"
                              as="button"
                              className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                            >
                              Click here to resend the verification email.
                            </Link>
                          </p>

                          {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                              A new verification link has been sent to your
                              email address.
                            </div>
                          )}
                        </div>
                      )}

                    <div className="flex items-center gap-4">
                      <Button disabled={processing}>Save</Button>

                      <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                      >
                        <p className="text-sm text-neutral-600">Saved</p>
                      </Transition>
                    </div>
                  </form>
                </div>

                <DeleteUser />
              </CardContent>
            </Card>
          </div>
        </div>
      </RootContent>
    </RootLayout>
  );
}
