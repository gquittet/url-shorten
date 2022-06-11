import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ShortcodeApiService } from '../api/shortcode.api-service';

const Redirect = () => {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const homepage = () => Router.push('/');

    if (typeof slug === 'string') {
      new ShortcodeApiService()
        .find({ slug })
        .then((shortcode) => {
          window.location.href = shortcode.url;
        })
        .catch(homepage);
    } else {
      homepage().then();
    }
  });
};

export default Redirect;
