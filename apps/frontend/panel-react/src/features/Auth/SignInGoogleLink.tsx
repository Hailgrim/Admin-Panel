import { FC, MouseEventHandler, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import FormLink from '@/shared/ui/Form/FormLink';
import { useAppDispatch } from '@/shared/store/hooks';
import { setProfile } from '@/shared/store/main/main';
import useTranslate from '@/shared/hooks/useTranslate';
import { IUser, IWindowMessage } from '@ap/shared/src/types';
import { getGoogleSignInUrl, ROUTES } from '@ap/shared/src/libs';

const SignInGoogleLink: FC = () => {
  const t = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const timeout = useRef<NodeJS.Timeout>(undefined);

  const googleHandler: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();

    const message: IWindowMessage<string> = {
      type: ROUTES.ui.signInGoogle,
      payload: String(Math.random()),
    };
    const googleWindow = window.open(
      getGoogleSignInUrl(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.HOST!,
        message.payload
      ),
      undefined,
      'top=100,left=100,width=500,height=500'
    );

    clearTimeout(timeout.current);
    timeout.current = setInterval(() => {
      googleWindow?.postMessage(message);
    }, 1000);
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent<IWindowMessage<IUser>>) => {
      if (event.data.type !== ROUTES.ui.signInGoogle) {
        return;
      }

      dispatch(setProfile(event.data.payload));
      router.push(
        decodeURIComponent(searchParams.get('return') || ROUTES.ui.home)
      );
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [dispatch, router, searchParams]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <FormLink
      onClick={googleHandler}
      href={ROUTES.ui.signInGoogle}
      mui={{ align: 'center' }}
    >
      {t.signInWithGoogle}
    </FormLink>
  );
};
export default SignInGoogleLink;
