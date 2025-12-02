import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Vacancy } from "@shared/schema";

const vacancyFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  requirements: z.string().optional(),
  salary: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "closed", "filled"]),
  ghlPipelineId: z.string().optional(),
  ghlStageId: z.string().optional(),
});

type VacancyFormValues = z.infer<typeof vacancyFormSchema>;

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function VacancyFormPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id && id !== "new";

  const { data: vacancy, isLoading } = useQuery<Vacancy>({
    queryKey: ["/api/vacancies", id],
    enabled: isEditing,
  });

  const form = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      description: "",
      requirements: "",
      salary: "",
      status: "draft",
      ghlPipelineId: "",
      ghlStageId: "",
    },
  });

  useEffect(() => {
    if (vacancy) {
      form.reset({
        title: vacancy.title,
        department: vacancy.department,
        location: vacancy.location,
        description: vacancy.description || "",
        requirements: vacancy.requirements || "",
        salary: vacancy.salary || "",
        status: vacancy.status,
        ghlPipelineId: vacancy.ghlPipelineId || "",
        ghlStageId: vacancy.ghlStageId || "",
      });
    }
  }, [vacancy, form]);

  const createMutation = useMutation({
    mutationFn: async (data: VacancyFormValues) => {
      const response = await apiRequest("POST", "/api/vacancies", data);
      return response as Vacancy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies"] });
      toast({
        title: "Vacancy created",
        description: "The vacancy has been successfully created.",
      });
      navigate("/vacancies");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create vacancy. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: VacancyFormValues) => {
      const response = await apiRequest("PATCH", `/api/vacancies/${id}`, data);
      return response as Vacancy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies", id] });
      toast({
        title: "Vacancy updated",
        description: "The vacancy has been successfully updated.",
      });
      navigate("/vacancies");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update vacancy. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VacancyFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vacancies">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-vacancy-form-title">
            {isEditing ? "Edit Vacancy" : "Create Vacancy"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update the vacancy details" : "Add a new job opening"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Vacancy Details</CardTitle>
            <CardDescription>
              Fill in the details for this job vacancy. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing && isLoading ? (
              <FormSkeleton />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Senior Software Engineer"
                            {...field}
                            data-testid="input-vacancy-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Engineering"
                              {...field}
                              data-testid="input-vacancy-department"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., London, UK (Remote)"
                              {...field}
                              data-testid="input-vacancy-location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Range</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., £60,000 - £80,000"
                              {...field}
                              data-testid="input-vacancy-salary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-vacancy-status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                              <SelectItem value="filled">Filled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the role, responsibilities, and what makes it exciting..."
                            className="min-h-[120px]"
                            {...field}
                            data-testid="textarea-vacancy-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List the skills, experience, and qualifications required..."
                            className="min-h-[120px]"
                            {...field}
                            data-testid="textarea-vacancy-requirements"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">GoHighLevel Integration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="ghlPipelineId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GHL Pipeline ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Optional - for CRM sync"
                                {...field}
                                data-testid="input-vacancy-ghl-pipeline"
                              />
                            </FormControl>
                            <FormDescription>
                              Link this vacancy to a GoHighLevel pipeline
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ghlStageId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GHL Stage ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Optional - initial stage"
                                {...field}
                                data-testid="input-vacancy-ghl-stage"
                              />
                            </FormControl>
                            <FormDescription>
                              Default stage for new candidates
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Link href="/vacancies">
                      <Button type="button" variant="outline" data-testid="button-cancel">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isPending} data-testid="button-save-vacancy">
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {isEditing ? "Update Vacancy" : "Create Vacancy"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
