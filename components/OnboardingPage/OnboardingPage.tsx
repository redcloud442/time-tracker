"use client";

import { createOnboardingRequest } from "@/services/Onboarding/Member.";
import { getTeamOnboarding } from "@/services/Team/Member";
import { escapeFormData } from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { team_table } from "@prisma/client";
import {
  IconCheckbox,
  IconCircleCheck,
  IconInfoCircle,
  IconPhoto,
  IconUpload,
  IconUserCheck,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
const onBoardingSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  avatar: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "File size should not exceed 5MB"
    )
    .refine(
      (file) =>
        !file || ["image/png", "image/jpeg", "image/gif"].includes(file.type),
      "Only PNG, JPEG, and GIF files are accepted"
    ),
  teamId: z.string().min(2),
});

type OnBoardingSchema = z.infer<typeof onBoardingSchema>;

const OnboardingPage = () => {
  const supabase = createClient();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [teams, setTeams] = useState<team_table[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const form = useForm<OnBoardingSchema>({
    resolver: zodResolver(onBoardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      avatar: undefined,
      teamId: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = form;

  const nextStep = () => {
    const firstName = watch("firstName");
    const lastName = watch("lastName");

    if (active === 0 && (!firstName || !lastName)) {
      notifications.show({
        title: "Error",
        message:
          "Please enter both First Name and Last Name before proceeding.",
        color: "red",
      });
      return;
    }

    setActive((current) => (current < 2 ? current + 1 : current));
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleModalOpen = (teamId: string) => {
    modals.open({
      modalId: "deleteApiKey",
      title: <Text>Please confirm your action.</Text>,
      children: (
        <>
          <Text>Are you sure you want to join this team?</Text>
          <Flex mt="md" align="center" justify="flex-end" gap="sm">
            <Button
              variant="default"
              color="dimmed"
              onClick={() => {
                modals.close("deleteApiKey");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="green"
              onClick={async () => {
                modals.close("deleteApiKey");
                setValue("teamId", teamId);
              }}
            >
              Join
            </Button>
          </Flex>
        </>
      ),
      centered: true,
    });
  };

  const teamId = watch("teamId");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (active !== 1) return;
        setIsLoading(true);
        const { data, count } = await getTeamOnboarding(supabase, {
          page: activePage,
          limit: 10,
        });
        setTeams(data);
        setTeamCount(count);
      } catch (e) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch teams",

          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [active]);

  const onSubmit = async (values: OnBoardingSchema) => {
    try {
      const escapedData = escapeFormData(values);
      console.log(values);

      await createOnboardingRequest({
        ...escapedData,
        avatar: escapedData.avatar as File,
      });
      notifications.show({
        title: "Success",
        message: "Onboarding request created successfully",
        color: "green",
      });
    } catch (e) {
      notifications.show({
        title: "Error",
        message: "Failed to create onboarding request",
        color: "red",
      });
    }
  };

  const columns = [
    {
      accessor: "team_name",
      width: "80%",
      render: (team: team_table) => team.team_name,
    },
    {
      accessor: "action",
      label: "Action",
      id: "action",
      width: "20%",
      render: (team: team_table) =>
        teamId ? null : (
          <Button
            variant="outline"
            onClick={() => handleModalOpen(team.team_id)}
          >
            Join
          </Button>
        ),
    },
  ];

  return (
    <Container>
      <Flex direction="column" justify="center" w="100%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stepper
            active={active}
            onStepClick={setActive}
            orientation={isMobile ? "vertical" : "horizontal"}
            completedIcon={
              <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />
            }
            color="blue"
            size="md"
            styles={{
              stepBody: {
                margin: 0,
              },
              stepLabel: {
                fontSize: rem(14),
              },
            }}
          >
            <Stepper.Step
              icon={
                <IconUserCheck style={{ width: rem(20), height: rem(20) }} />
              }
              label="Step 1"
              description="Account Personal Information"
            />
            <Stepper.Step
              icon={
                <IconUsersGroup style={{ width: rem(20), height: rem(20) }} />
              }
              label="Step 2"
              description="Join a team"
            />
            <Stepper.Step
              icon={
                <IconCheckbox style={{ width: rem(20), height: rem(20) }} />
              }
              label="Step 3"
              description="Confirmation"
            />
          </Stepper>

          <Paper withBorder shadow="sm" p="md" mt="lg" w="100%">
            {active === 0 && (
              <Stack>
                {" "}
                <Title order={5} fw={500}>
                  Upload an avatar
                </Title>
                <Paper withBorder shadow="none" p="md">
                  <Controller
                    name="avatar"
                    control={control}
                    render={({ field }) => (
                      <Dropzone
                        onDrop={(files) => {
                          field.onChange(files[0]); // Set the first file to the form state
                        }}
                        onReject={(files) => {
                          console.log("rejected files", files);
                        }}
                        maxSize={5 * 1024 ** 2} // 5MB limit
                        accept={IMAGE_MIME_TYPE}
                      >
                        <Group
                          justify="center"
                          gap="xl"
                          style={{ pointerEvents: "none" }}
                        >
                          <Dropzone.Accept>
                            <IconUpload
                              style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-blue-6)",
                              }}
                              stroke={1.5}
                            />
                          </Dropzone.Accept>
                          <Dropzone.Reject>
                            <IconX
                              style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-red-6)",
                              }}
                              stroke={1.5}
                            />
                          </Dropzone.Reject>
                          <Dropzone.Idle>
                            <IconPhoto
                              style={{
                                width: rem(52),
                                height: rem(52),
                                color: "var(--mantine-color-dimmed)",
                              }}
                              stroke={1.5}
                            />
                          </Dropzone.Idle>

                          <div>
                            <Text size="xl" inline>
                              Drag images here or click to select files to
                              upload an avatar
                            </Text>
                            <Text size="sm" c="dimmed" inline mt={7}>
                              Attach one file as you like, file should not
                              exceed 5MB
                            </Text>
                          </div>
                        </Group>
                      </Dropzone>
                    )}
                  />
                </Paper>
                {errors.avatar && <Text c="red">{errors.avatar.message}</Text>}
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      label="First Name"
                      withAsterisk
                      {...field}
                      placeholder="First Name"
                    />
                  )}
                />
                {errors.firstName && (
                  <Text c="red">{errors.firstName.message}</Text>
                )}
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      label="Last Name"
                      withAsterisk
                      {...field}
                      placeholder="Last Name"
                    />
                  )}
                />
                {errors.lastName && (
                  <Text c="red">{errors.lastName.message}</Text>
                )}
              </Stack>
            )}
            {active === 1 && (
              <>
                <DataTable
                  idAccessor="team_id"
                  withTableBorder
                  minHeight={180}
                  columns={columns}
                  records={teams}
                  fetching={isLoading}
                  onPageChange={(page) => setActivePage(page)}
                  page={activePage}
                  totalRecords={teamCount}
                  recordsPerPage={10}
                />
              </>
            )}

            {active === 2 && (
              <>
                <Alert
                  variant="light"
                  color="blue"
                  title="Information Confirmation"
                  icon={<IconInfoCircle />}
                >
                  Upon Submitting this I agree that the data provided is
                  accurate and correct.
                </Alert>
              </>
            )}
          </Paper>

          <Flex mt="md" gap="sm">
            <Button onClick={prevStep} disabled={active === 0}>
              Back
            </Button>
            {active === 2 ? (
              <Button type="submit">Submit</Button>
            ) : (
              <Button onClick={nextStep} disabled={active === 2}>
                Next
              </Button>
            )}
          </Flex>
        </form>
      </Flex>
    </Container>
  );
};

export default OnboardingPage;
