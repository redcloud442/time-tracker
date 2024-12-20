"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AspectRatio,
  Button,
  Container,
  Divider,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthLogo from "../../public/AuthLogo";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    try {
    } catch (e) {}
  };

  return (
    <Container size="md" h="100vh">
      <Flex justify="center" align="center" h="100%">
        <Paper withBorder p="xl" radius="md" w="100%" maw={1000}>
          <Flex align="center" gap="xl">
            <Stack w="50%">
              <AspectRatio ratio={1} h={400} maw={500}>
                <AuthLogo />
              </AspectRatio>
              <Title order={2} ta="center">
                Track Time Easily
              </Title>
              <Text ta="center">
                Manage your tasks efficiently with our intuitive time-tracking
                tools.
              </Text>
            </Stack>
            <Divider orientation="vertical" />

            <Stack w="50%">
              <Title order={3} mb="md">
                Login
              </Title>

              <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Stack>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        label="Email"
                        placeholder="Enter your email"
                        {...field}
                        error={errors.email?.message}
                        withAsterisk
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        {...field}
                        error={errors.password?.message}
                        withAsterisk
                      />
                    )}
                  />

                  <Button type="submit" fullWidth mt="lg">
                    Login
                  </Button>

                  <Divider label="OR" labelPosition="center" />

                  <Button
                    leftSection={<IconBrandGoogle color="orange" />}
                    variant="outline"
                    fullWidth
                  >
                    Login with Google
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Flex>
        </Paper>
      </Flex>
    </Container>
  );
};

export default LoginPage;
