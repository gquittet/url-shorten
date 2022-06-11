import { LinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { AxiosError } from 'axios';
import joi from 'joi';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ShortcodeApiService } from '../api/shortcode.api-service';

const schema = joi.object({
  url: joi.string().uri().required(),
  slug: joi.string().alphanum().allow('', null),
});

export function Index() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
    setFocus,
  } = useForm({
    defaultValues: {
      url: '',
      slug: '',
    },
    resolver: joiResolver(schema),
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const submitWithEnter = (callback) => (event) => {
    if (event.code === 'Enter') {
      callback();
    }
  };

  useEffect(() => {
    const listener = submitWithEnter(handleSubmit(onSubmit));
    window.addEventListener('keyup', listener);
    return () => {
      window.removeEventListener('keyup', listener);
    };
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { slug } = await new ShortcodeApiService().create({
        ...data,
        slug: data.slug || undefined,
      });
      toast({
        title: 'Shortcode created!',
        description: `Your short link with slug ${slug} is ready.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      setFocus('url');
      reset();
    } catch (e) {
      if (e instanceof AxiosError) {
        setLoading(false);
        setError('slug', { type: 'custom', message: e.response.data.message });
        return;
      }
      toast({
        title: 'Something was wrong!',
        description: e.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
  };

  return (
    <Center h="calc(var(--vh, 1vh) * 100)">
      <Stack spacing={10}>
        <Center mt={-40}>
          <Heading>Url Shorten 🔗</Heading>
        </Center>
        <Stack
          spacing={8}
          p={8}
          shadow="md"
          borderRadius={8}
          borderWidth={1}
          w={{
            base: '80vw',
            sm: '60vw',
            md: '50vw',
            lg: '40vw',
            xl: '30vw',
            '2xl': '20vw',
          }}
        >
          <Stack>
            <FormControl isInvalid={Boolean(errors.url)}>
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LinkIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      {...field}
                      {...register('url')}
                      required
                      placeholder="Paste your link"
                    />
                  </InputGroup>
                )}
              />
              <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.slug)}>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    {...register('slug')}
                    placeholder="slug (optional)"
                  />
                )}
              />
              <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
          <Button
            isLoading={isLoading}
            colorScheme="blue"
            rightIcon={<LinkIcon />}
            onClick={handleSubmit(onSubmit)}
          >
            Shorten
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
}

export default Index;
